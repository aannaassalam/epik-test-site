/**
 * NovaHome — fictional partner storefront used to test the EPIK widget.
 *
 * The widget tag at the bottom of each page is built from `epikOrigin` below, so
 * this file is the only place an EPIK environment is chosen.
 */
window.STORE = {
    name: "NovaHome",
    partnerId: "ray-ban",
    epikApi: "https://epik-consumer-service.onrender.com",
    // Where EPIK is served from: the widget script, the microsites we link out to
    // and their assets all resolve against this. Derived rather than hardcoded so
    // the deployed copy of this store does not point at somebody's localhost.
    // Override with ?epik=https://some-epik.example to test another environment.
    epikOrigin: (() => {
        const override = new URLSearchParams(location.search).get("epik");
        if (override) return override.replace(/\/$/, "");
        return /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname)
            ? "http://localhost:3000"
            : // The PR preview, not getepik.in: production carries neither /embed.js nor
              // the Xiaomi microsite and its assets. Repoint once that ships.
              "https://frontend-epik-pr-385.onrender.com";
    })(),

    // The partner's own catalog, in the partner's own SKUs.
    // Demo eligibility is NOT decided here — it comes from EPIK's widget config.
    products: [
        // Caresmith Charge Boost Massage Gun — the one product EPIK carries for
        // this store. Whether it gets a demo button is EPIK's widget config to
        // decide, not this list's.
        { sku: "RB-001", epikId: "9401188548833" },

        // A launch product EPIK does not carry yet, so there is no epikId to fetch and
        // no demo button to render. Its PDP gets the microsite banner instead: the demo
        // is booked over there, against the EPIK product URL the microsite already holds.
        // {
        //     sku: "NJ-PHONE-RN17P",
        //     microsite: "/xiaomi/redmi-note-17-pro",
        //     // Stand-in catalog copy — swap for a live epikId once the listing exists.
        //     static: {
        //         title: "Redmi Note 17 Pro 5G",
        //         vendor: "Xiaomi",
        //         price: 24999, // placeholder; India pricing not announced
        //         image: "/assets/images/xiaomi/redmi-note-17-pro/blue-back.webp",
        //         descriptionHtml:
        //             '<p>6.83" 1.5K AMOLED at 120Hz and 3500 nits. Snapdragon 6s Gen 4. ' +
        //             "50MP OIS main camera with an 8MP ultrawide. 8340mAh battery with 67W " +
        //             "turbo charging. IP68 and IP69K rated.</p>",
        //     },
        // },
    ],
};
