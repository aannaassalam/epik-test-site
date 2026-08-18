/** Fetches live product data from the EPIK API so the test store shows real catalog content. */
const api = (path) => fetch(`${STORE.epikApi}${path}`).then((r) => {
  if (!r.ok) throw new Error(`${path} -> ${r.status}`);
  return r.json();
});

const money = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

function normalise(product) {
  const images = product.images?.edges?.map((e) => e.node) ?? product.images ?? [];
  const variant = product.variants?.[0] ?? product.variants?.edges?.[0]?.node;
  return {
    id: product.id?.split("/").pop(),
    title: product.title,
    vendor: product.vendor,
    descriptionHtml: product.descriptionHtml || product.description || "",
    image: images[0]?.url || images[0]?.src || "",
    price: variant?.price?.amount ?? variant?.price ?? 0,
  };
}

const loadProduct = async (epikId) =>
  normalise((await api(`/shopify/products/${epikId}`)).product);

/** Injects the EPIK loader with this store's partner id. */
function mountEpikWidget() {
  const s = document.createElement("script");
  s.src = `${STORE.epikOrigin}/embed.js`;
  s.dataset.partner = STORE.partnerId;
  document.body.appendChild(s);

  // PRD §9 — the widget re-dispatches its funnel events on the host page.
  const log = document.getElementById("events");
  ["widget_loaded", "widget_opened", "product_selected", "booking_confirmed", "widget_closed"]
    .forEach((name) =>
      window.addEventListener(`epik:${name}`, (e) => {
        if (!log) return;
        const row = document.createElement("div");
        row.textContent = `${new Date().toLocaleTimeString()}  ${name}  ${JSON.stringify(e.detail ?? {})}`;
        log.prepend(row);
      }),
    );
}
