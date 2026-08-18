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

`embed.js` fetches `/api/widget/config/ninja-demo`, then:

- renders a **trigger button** into every `[data-epik-product]` whose SKU is on the
  allowlist, inside a **closed shadow root** (partner CSS can't reach in, partner JS can't reach out);
- renders a **floating FAB** for the sitewide catalog entry point;
- opens the booking flow in a **fixed iframe on the EPIK origin**, so the OTP session
  token stays on EPIK's `localStorage`, never the partner's.

Product data on this store is fetched live from the EPIK API (`/shopify/products/:id`),
so the PDP and the widget always show the same product.

## What to verify

| Check | Where |
|---|---|
| Button renders on a demo-eligible SKU | any product except `NJ-ACC-FILTER` |
| Button does **not** render on an ineligible SKU | `product.html?sku=NJ-ACC-FILTER` |
| Partner CSS can't restyle the button | shadow root is `closed` |
| FAB opens the full demo-eligible catalog | bottom-right, any page |
| Funnel events reach the host page | "EPIK widget events" panel at page bottom |
| Framing is partner-gated | `/embed` without `?partner=` → 404 |

## Config

Partner id, EPIK origin and the store's SKU list live in [`config.js`](config.js).
The SKU **allowlist** is owned by EPIK, not this store — see
`src/config/partnerWidget.ts` in the frontend repo.
