# Aurora — Premium Weather Dashboard

A beautiful, animated weather dashboard built with vanilla HTML, CSS, and JavaScript. No frameworks, no build tools, no API keys required.

![Aurora Weather Dashboard](https://img.shields.io/badge/weather-live-blue) ![No Dependencies](https://img.shields.io/badge/dependencies-zero-green) ![PWA Ready](https://img.shields.io/badge/PWA-ready-purple)

## Features

- **Live weather data** from [Open-Meteo](https://open-meteo.com/) (free, no API key)
- **City search** with autocomplete (any city worldwide)
- **Geolocation** support — use your current location
- **7-day forecast** with hi/lo temps and precipitation probability
- **24-hour hourly forecast** with temperature chart
- **Detailed metrics** — wind, humidity, UV index, pressure, visibility, precipitation
- **°F/°C and MPH/KPH toggles**
- **Sunrise, sunset, and daylight duration**
- **Dynamic background themes** that shift based on weather conditions
- **Animated weather effects:**
  - ☀️ Sun rays with floating golden dust motes
  - ☁️ Drifting cloud wisps
  - 🌫️ Rolling fog layers
  - 🌧️ Falling rain
  - ⛈️ Rain with lightning bolts and screen flash
  - 🧊 Hail (ice pellets + rain mix)
  - ❄️ Wobbling snowflakes
- **Glassmorphic UI** with frosted card effects
- **Aurora background** with animated blobs and twinkling stars
- **Custom animated SVG weather icons**
- **PWA ready** — installable on mobile, works offline
- **Fully responsive** — desktop, tablet, and mobile
- **Zero dependencies** — pure vanilla HTML/CSS/JS
- **No external CDN** — all assets are local

## Getting Started

Just open `index.html` in your browser. That's it.

```bash
# Or serve it locally for PWA support
npx serve .
```

## PWA Installation

1. Serve the app over HTTPS (or localhost)
2. Open in Chrome on your phone
3. Tap **"Add to Home Screen"** or **"Install app"**
4. Launches fullscreen like a native app

## Icons

To generate the PWA icons, open `generate-icons.html` in your browser and save the two canvas images as `icon-192.png` and `icon-512.png`.

## Tech

- **Weather API:** [Open-Meteo](https://open-meteo.com/) — free, open-source, no key required
- **Geocoding:** [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api)
- **Reverse Geocoding:** [BigDataCloud](https://www.bigdatacloud.com/) (free tier, client-side)
- **Charts:** Custom canvas rendering (no Chart.js)
- **Icons:** Inline animated SVGs
- **Fonts:** System font stack (Segoe UI / Georgia)

## License

MIT
