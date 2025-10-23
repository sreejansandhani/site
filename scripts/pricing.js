/* Sponsorship pricing, discounts, and summary calculator. */
const Pricing = (() => {
  // Base prices can be pulled from ad_config CSV; here are defaults
  const BASE = {
    drawing_book_front: 15,  // per unit
    drawing_book_back: 10,
    bag_space: 25,           // per unit
    banner: 50,              // per banner
  };

  const promoCodes = {
    "SANDHANI10": { type: "percent", value: 10 },
    "SREEJAN5": { type: "percent", value: 5 }
  };

  const calc = (items, promo) => {
    // items: { drawingBooks:[{space:"front|back", qty, side}], bags:[{space, qty}], banners:[{placement, qty}] }
    let subtotal = 0;
    const lineItems = [];

    (items.drawingBooks || []).forEach(it => {
      const key = it.side === "Front" ? "drawing_book_front" : "drawing_book_back";
      const price = BASE[key] * Number(it.qty || 0);
      subtotal += price;
      lineItems.push({ label: `Drawing Book (${it.side}) x${it.qty}`, amount: price });
    });

    (items.bags || []).forEach(it => {
      const price = BASE.bag_space * Number(it.qty || 0);
      subtotal += price;
      lineItems.push({ label: `Bag Space x${it.qty}`, amount: price });
    });

    (items.banners || []).forEach(it => {
      const price = BASE.banner * Number(it.qty || 0);
      subtotal += price;
      lineItems.push({ label: `Banner (${it.placement}) x${it.qty}`, amount: price });
    });

    let discount = 0;
    let appliedPromo = null;
    if (promo && promoCodes[promo]) {
      const p = promoCodes[promo];
      appliedPromo = promo;
      discount = p.type === "percent" ? Math.round(subtotal * (p.value / 100)) : p.value;
    }

    const total = Math.max(0, subtotal - discount);
    const summary = { subtotal, discount, total, lineItems, promo: appliedPromo };
    return summary;
  };

  return { calc };
})();
