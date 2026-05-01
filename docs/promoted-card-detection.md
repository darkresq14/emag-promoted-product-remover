# eMAG Promoted Card Detection

## DOM Structure

Each product card lives inside a `.card-v2-wrapper.js-section-wrapper` element. Within it, there's a `.card-v2-badge-cmp-holder` container that holds campaign badges (e.g., "Electro Weekend", "Smart Deals", "Multi Deals").

## Anti-Adblock Obfuscation

eMAG marks promoted products with an obfuscated "Promovat" (Romanian for "Promoted") badge. The word is broken up with random hex/alpha chunks inserted between characters, and rendered via scattered `<span>` elements where some chunks have `display: none`. Examples observed:

- `Pr5j8omovat`
- `Prom088go5ffav9b0e55at`
- `Prom886ovch4d0iat`
- `Pr00b369omo4j3va48b4a3t`
- `Promova30f9dt`
- `Promovae0a8d1t`

This defeats simple text searches for "Promovat" since the raw string never appears in the DOM. However, `textContent` still collects the full obfuscated string.

## Detection Method

A card is **promoted** if it contains a `.card-v2-badge-cmp` element that meets both conditions:

1. **Non-empty text content** — `badge.textContent.trim().length > 0`
2. **Generic class name** — the element does NOT have any `cmp-badge-*` class in its `className`

Legitimate campaign badges like "Electro Weekend", "Smart Deals", or "Multi Deals" have specific classes like `cmp-badge-electro-weekend`, `cmp-badge-smart-deals`. The promoted badge only has generic classes: `card-v2-badge-cmp badge bg-light bg-opacity-90 text-neutral-darkest`.

## CSS Selector

```css
.card-v2-wrapper:has(.card-v2-badge-cmp:not([class*="cmp-badge-"])) {
  display: none !important;
}
```

## JavaScript (Content Script)

```js
document.querySelectorAll('.card-v2-wrapper').forEach(wrapper => {
  const cmpBadges = wrapper.querySelectorAll('.card-v2-badge-cmp');
  const isPromoted = Array.from(cmpBadges).some(badge => {
    const text = badge.textContent.trim();
    return text.length > 0 && !badge.className.includes('cmp-badge-');
  });
  if (isPromoted) {
    wrapper.style.display = 'none';
  }
});
```

## "Top Favorite" Badge

The `.commercial-badge` with text "Top Favorite" found in `.card-v2-badges` is **not a reliable indicator** of promoted status. It is sometimes correlated (4 out of 6 promoted cards had it on the tested page) but promoted cards can exist without it, and it may theoretically appear on organic products too.

## Test Results

Page: eMAG phone case listing filtered for Pixel 7 Pro with wireless charging.

| Metric | Count |
|---|---|
| Total cards | 14 |
| Promoted cards | 6 (indices 0, 1, 4, 7, 10, 13) |
| Organic cards | 8 |

## Robustness

The `:has()` + `:not([class*="cmp-badge-"])` approach is resilient to obfuscation changes because it relies on the **structural class difference** rather than parsing the obfuscated text. Even if eMAG changes the random character insertion algorithm, the class-based distinction remains the same.
