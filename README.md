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

To test against a deployed EPIK instead of localhost:

```js
localStorage.setItem("epikOrigin", "https://beta.getepik.in"); location.reload();
```

## How the integration works

The store pastes one tag and one div — nothing else:

```html
<script src="https://www.getepik.in/embed.js" data-partner="ninja-demo"></script>
<div data-epik-product="NJ-VAC-A20"></div>
```

`embed.js` fetches `/api/widget/config/ninja-demo`, then renders everything the partner's
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
| Button renders on a demo-eligible SKU | any product except `NJ-ACC-FILTER` |
| Button does **not** render on an ineligible SKU | `product.html?sku=NJ-ACC-FILTER` |
| Partner CSS can't restyle the widget | shadow root is `closed` — `el.shadowRoot` is `null` |
| Catalog is a drawer, booking is a modal | FAB vs product button |
| Both become a bottom sheet on mobile | narrow the viewport under 640px |
| FAB opens the full demo-eligible catalog | bottom-right, any page |
| Funnel events reach the host page | "EPIK widget events" panel at page bottom |
| Framing is partner-gated | `/embed` without `?partner=` → 404 |

## Config

Partner id, EPIK origin and the store's SKU list live in [`config.js`](config.js).
The SKU **allowlist** is owned by EPIK, not this store — see
`src/config/partnerWidget.ts` in the frontend repo.
