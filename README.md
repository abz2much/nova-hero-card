# Nova Hero Card

A small animated status card for Home Assistant dashboards — a breathing
ember/gold "stellar core" orb next to the current time and date, with status
chips for your alarm panel and how many lights are on. Built to match
[Nova](https://github.com/abz2much/NOVA)'s own visual identity, and pairs
naturally with the [Nova theme](https://github.com/abz2much/nova-ha-theme),
but works with any theme — it falls back to sensible defaults if theme
variables aren't set.

No dependencies, no build step — it's a single vanilla-JS custom element.

## Install via HACS

1. HACS → the three-dot menu → **Custom repositories**.
2. Add this repository's URL, category **Dashboard** (plugin).
3. Install **Nova Hero Card**, then hard-refresh your browser.

## Install manually

1. Copy `nova-hero-card.js` into your Home Assistant `config/www/` directory.
2. Add it as a dashboard resource (**Settings → Dashboards → ⋮ → Resources →
   Add Resource**):
   - URL: `/local/nova-hero-card.js`
   - Resource type: **JavaScript Module**
3. Hard-refresh your browser.

## Usage

Add a card with type `custom:nova-hero-card` to any dashboard. It takes one
optional option:

```yaml
type: custom:nova-hero-card
alarm_entity: alarm_control_panel.home_security
```

- `alarm_entity` *(optional)* — an `alarm_control_panel` entity to show as a
  status chip. Omit it to drop the alarm chip entirely.
- A second chip always shows how many `light.*` entities are currently `on`.

## Appearance

The orb, chip colors, and layout are intentionally close to Nova's own panel
look, but every color reads from standard Home Assistant theme variables
(`--card-background-color`, `--primary-text-color`, `--divider-color`, etc.)
with hardcoded fallbacks, so it renders reasonably under any theme — not
just Nova.

Respects `prefers-reduced-motion` — the orb's breathing animation is disabled
for users with that preference set.
