# EPIK partner widget — test store

"NovaHome" is a fictional partner storefront used to test the EPIK demo-booking
widget end to end, cross-origin, against the real EPIK APIs.

## Run

```bash
# 1. EPIK frontend (serves /embed.js, /embed, /api/widget/config/*)
cd ../frontend && npm run dev          # http://localhost:3000

# 2. This store, on a DIFFERENT origin so the embed is genuinely cross-origin
npm run dev                            # http://localhost:4321
```

Open http://localhost:4321 and click any product.

`npm run dev` kills whatever holds :4321 first — `serve` otherwise falls back to a
random port and the stale process keeps answering :4321 with old code, which looks
exactly like "only the first product works".

`serve.json` turns off `cleanUrls`: with it on, `serve` 301s `product.html?sku=X` to
`/product` and **drops the query**, so every card opened the first product. Firebase
serves the `.html` paths as-is, so this just keeps local behaviour honest.

The EPIK origin is derived, not hardcoded: localhost when this store is served from
localhost, the `frontend` PR-385 preview otherwise (getepik.in has neither
`/embed.js` nor the Xiaomi microsite yet). Point it anywhere with `?epik=`, e.g.
`http://localhost:4321/product.html?sku=CS-001&epik=https://beta.getepik.in`.

## How the integration works

The store pastes one tag and one div — nothing else. Both are literal in this repo:
the tag sits at the bottom of [`index.html`](index.html) and [`product.html`](product.html),
and the mount point is in the PDP markup.

```html
<script src="https://www.getepik.in/embed.js" data-partner="caresmith"></script>
<div data-epik-product="CS-001"></div>
```

(This store builds that tag from `STORE.epikOrigin` rather than writing it literally,
so one config value repoints every page.)

The tag loads before the PDP markup is rendered, so this also exercises the loader's
`MutationObserver` — the same situation as a partner store that renders client-side.

`embed.js` fetches `/api/widget/config/caresmith`, then renders everything the partner's
page can see — trigger button, FAB, backdrop, modal, drawer — inside a **closed shadow
root**, so neither side's CSS can reach the other:

- a **trigger button** in every `[data-epik-product]` whose SKU is on the allowlist;
- a **floating FAB** for the sitewide catalog;
- a **centred modal** for a single product, a **right drawer** for the catalog, both a
  **bottom sheet** under 640px. Escape and backdrop click dismiss.

Only the flow content runs in an iframe on the EPIK origin — that's what keeps the OTP
session token on EPIK's `localStorage` and out of the partner's.

Product data on this store is fetched live from the EPIK API (`/shopify/products/:id`),
so the PDP and the widget always show the same product.

## What to verify

| Check | Where |
|---|---|
| Button renders on an allowlisted SKU | `product.html?sku=CS-001` |
| Button does **not** render on a SKU EPIK has not allowlisted | drop `CS-001` from the brand's widget config and reload |
| Partner CSS can't restyle the widget | shadow root is `closed` — `el.shadowRoot` is `null` |
| Catalog is a drawer, booking is a modal | FAB vs product button |
| Both become a bottom sheet on mobile | narrow the viewport under 640px |
| FAB opens the full demo-eligible catalog | bottom-right, any page |
| A microsite product shows the banner, not a button | `product.html?sku=NJ-PHONE-RN17P` |
| Funnel events reach the host page | "EPIK widget events" panel at page bottom |
| Framing is partner-gated | `/embed` without `?partner=` → 404 |

## Config

Partner id, EPIK origin and the store's SKU list live in [`config.js`](config.js).
The SKU **allowlist** is owned by EPIK, not this store — see
`src/config/partnerWidget.ts` in the frontend repo.
