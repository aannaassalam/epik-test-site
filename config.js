/**
 * NovaHome — fictional partner storefront used to test the EPIK widget.
 * Point `epikOrigin` at your running frontend (localhost:3000) or beta.getepik.in.
 */
window.STORE = {
  name: "NovaHome",
  partnerId: "ninja-demo",
  epikOrigin: localStorage.getItem("epikOrigin") || "http://localhost:3000",
  epikApi: "https://epik-consumer-service.onrender.com",

  // The partner's own catalog, in the partner's own SKUs.
  // Demo eligibility is NOT decided here — it comes from EPIK's widget config.
  products: [
    { sku: "NJ-VAC-A20", epikId: "9053123674337" },
    { sku: "NJ-VAC-X11", epikId: "9290669752545" },
    { sku: "NJ-KIT-LUMA", epikId: "9450815258849" },
    { sku: "NJ-AV-MOGO4", epikId: "9300717043937" },
    { sku: "NJ-WEAR-RB2", epikId: "9299337543905" },
    // Deliberately absent from EPIK's SKU allowlist — the button must NOT render here.
    { sku: "NJ-ACC-FILTER", epikId: "9388205801697" },
  ],
};
