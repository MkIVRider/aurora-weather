// ============================================================
// AURORA — Premium Weather Dashboard
// Data: Open-Meteo (open-meteo.com) — free, no API key needed
// ============================================================

const state = {
  unit: 'f',          // 'f' or 'c'
  speed: 'mph',       // 'mph' or 'kph'
  lat: null,
  lon: null,
  place: null,
  data: null,
};

// ---------- Weather code → icon + label + theme ----------
const WMO = {
  0:  { label: 'Clear sky',              icon: 'sun',          theme: 'sunny'  },
  1:  { label: 'Mainly clear',           icon: 'sun',          theme: 'sunny'  },
  2:  { label: 'Partly cloudy',          icon: 'partly-cloud', theme: 'cloudy' },
  3:  { label: 'Overcast',               icon: 'cloud',        theme: 'cloudy' },
  45: { label: 'Fog',                    icon: 'fog',          theme: 'foggy'  },
  48: { label: 'Rime fog',               icon: 'fog',          theme: 'foggy'  },
  51: { label: 'Light drizzle',          icon: 'drizzle',      theme: 'rainy'  },
  53: { label: 'Drizzle',                icon: 'drizzle',      theme: 'rainy'  },
  55: { label: 'Heavy drizzle',          icon: 'drizzle',      theme: 'rainy'  },
  56: { label: 'Freezing drizzle',       icon: 'sleet',        theme: 'rainy'  },
  57: { label: 'Freezing drizzle',       icon: 'sleet',        theme: 'rainy'  },
  61: { label: 'Light rain',             icon: 'rain',         theme: 'rainy'  },
  63: { label: 'Rain',                   icon: 'rain',         theme: 'rainy'  },
  65: { label: 'Heavy rain',             icon: 'rain',         theme: 'rainy'  },
  66: { label: 'Freezing rain',          icon: 'sleet',        theme: 'rainy'  },
  67: { label: 'Freezing rain',          icon: 'sleet',        theme: 'rainy'  },
  71: { label: 'Light snow',             icon: 'snow',         theme: 'snowy'  },
  73: { label: 'Snow',                   icon: 'snow',         theme: 'snowy'  },
  75: { label: 'Heavy snow',             icon: 'snow',         theme: 'snowy'  },
  77: { label: 'Snow grains',            icon: 'snow',         theme: 'snowy'  },
  80: { label: 'Rain showers',           icon: 'rain',         theme: 'rainy'  },
  81: { label: 'Rain showers',           icon: 'rain',         theme: 'rainy'  },
  82: { label: 'Violent rain showers',   icon: 'rain',         theme: 'rainy'  },
  85: { label: 'Snow showers',           icon: 'snow',         theme: 'snowy'  },
  86: { label: 'Snow showers',           icon: 'snow',         theme: 'snowy'  },
  95: { label: 'Thunderstorm',           icon: 'storm',        theme: 'stormy' },
  96: { label: 'Storm with hail',        icon: 'storm',        theme: 'hail'   },
  99: { label: 'Severe thunderstorm',    icon: 'storm',        theme: 'hail'   },
};

// ---------- Weather icons (inline SVG) ----------
const icons = {
  sun: (size = 120) => `
    <svg viewBox="0 0 120 120" width="${size}" height="${size}">
      <defs>
        <radialGradient id="sunG" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fde68a"/>
          <stop offset="60%" stop-color="#fbbf24"/>
          <stop offset="100%" stop-color="#f59e0b"/>
        </radialGradient>
      </defs>
      <g style="transform-origin:60px 60px;animation:spin 30s linear infinite">
        ${[0,45,90,135,180,225,270,315].map(a=>`<line x1="60" y1="12" x2="60" y2="22" stroke="#fbbf24" stroke-width="4" stroke-linecap="round" transform="rotate(${a} 60 60)"/>`).join('')}
      </g>
      <circle cx="60" cy="60" r="26" fill="url(#sunG)"/>
    </svg>`,
  moon: (size = 120) => `
    <svg viewBox="0 0 120 120" width="${size}" height="${size}">
      <defs>
        <radialGradient id="moonG" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#f8fafc"/>
          <stop offset="100%" stop-color="#cbd5e1"/>
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="32" fill="url(#moonG)"/>
      <circle cx="72" cy="52" r="4" fill="#94a3b8" opacity="0.5"/>
      <circle cx="56" cy="72" r="3" fill="#94a3b8" opacity="0.4"/>
      <circle cx="66" cy="68" r="2" fill="#94a3b8" opacity="0.3"/>
    </svg>`,
  'partly-cloud': (size = 120) => `
    <svg viewBox="0 0 120 120" width="${size}" height="${size}">
      <defs>
        <radialGradient id="pcSun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fde68a"/>
          <stop offset="100%" stop-color="#f59e0b"/>
        </radialGradient>
        <linearGradient id="pcCloud" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#f1f5f9"/>
          <stop offset="100%" stop-color="#94a3b8"/>
        </linearGradient>
      </defs>
      <circle cx="42" cy="42" r="18" fill="url(#pcSun)"/>
      <path d="M30 78 Q30 62 48 62 Q52 52 64 52 Q82 52 84 68 Q98 68 98 82 Q98 92 88 92 L38 92 Q30 92 30 82 Z" fill="url(#pcCloud)"/>
    </svg>`,
  cloud: (size = 120) => `
    <svg viewBox="0 0 120 120" width="${size}" height="${size}">
      <defs>
        <linearGradient id="cG" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#f1f5f9"/>
          <stop offset="100%" stop-color="#94a3b8"/>
        </linearGradient>
      </defs>
      <path d="M22 72 Q22 52 44 52 Q50 38 66 38 Q88 38 90 58 Q104 58 104 74 Q104 86 90 86 L34 86 Q22 86 22 74 Z" fill="url(#cG)"/>
    </svg>`,
  rain: (size = 120) => `
    <svg viewBox="0 0 120 120" width="${size}" height="${size}">
      <defs>
        <linearGradient id="rG" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#cbd5e1"/>
          <stop offset="100%" stop-color="#64748b"/>
        </linearGradient>
      </defs>
      <path d="M22 58 Q22 38 44 38 Q50 24 66 24 Q88 24 90 44 Q104 44 104 60 Q104 72 90 72 L34 72 Q22 72 22 60 Z" fill="url(#rG)"/>
      ${[0,1,2,3,4].map(i=>`<line x1="${36+i*12}" y1="80" x2="${32+i*12}" y2="${100+(i%2)*4}" stroke="#60a5fa" stroke-width="3" stroke-linecap="round">
        <animate attributeName="opacity" values="1;0;1" dur="1.2s" begin="${i*0.15}s" repeatCount="indefinite"/>
      </line>`).join('')}
    </svg>`,
  drizzle: (size = 120) => `
    <svg viewBox="0 0 120 120" width="${size}" height="${size}">
      <defs><linearGradient id="dG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cbd5e1"/><stop offset="1" stop-color="#64748b"/></linearGradient></defs>
      <path d="M22 58 Q22 38 44 38 Q50 24 66 24 Q88 24 90 44 Q104 44 104 60 Q104 72 90 72 L34 72 Q22 72 22 60 Z" fill="url(#dG)"/>
      ${[0,1,2].map(i=>`<circle cx="${42+i*18}" cy="88" r="2.5" fill="#60a5fa"><animate attributeName="cy" values="80;100;80" dur="1.5s" begin="${i*0.3}s" repeatCount="indefinite"/></circle>`).join('')}
    </svg>`,
  snow: (size = 120) => `
    <svg viewBox="0 0 120 120" width="${size}" height="${size}">
      <defs><linearGradient id="sG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f1f5f9"/><stop offset="1" stop-color="#cbd5e1"/></linearGradient></defs>
      <path d="M22 58 Q22 38 44 38 Q50 24 66 24 Q88 24 90 44 Q104 44 104 60 Q104 72 90 72 L34 72 Q22 72 22 60 Z" fill="url(#sG)"/>
      ${[0,1,2,3].map(i=>`<text x="${34+i*16}" y="${96+(i%2)*6}" font-size="14" fill="#f1f5f9" text-anchor="middle"><animate attributeName="y" values="${90+(i%2)*6};${104+(i%2)*6};${90+(i%2)*6}" dur="2.5s" begin="${i*0.3}s" repeatCount="indefinite"/>❄</text>`).join('')}
    </svg>`,
  sleet: (size = 120) => `
    <svg viewBox="0 0 120 120" width="${size}" height="${size}">
      <path d="M22 58 Q22 38 44 38 Q50 24 66 24 Q88 24 90 44 Q104 44 104 60 Q104 72 90 72 L34 72 Q22 72 22 60 Z" fill="#94a3b8"/>
      <line x1="40" y1="82" x2="36" y2="100" stroke="#60a5fa" stroke-width="3" stroke-linecap="round"/>
      <text x="58" y="100" font-size="14" fill="#f1f5f9" text-anchor="middle">❄</text>
      <line x1="80" y1="82" x2="76" y2="100" stroke="#60a5fa" stroke-width="3" stroke-linecap="round"/>
    </svg>`,
  fog: (size = 120) => `
    <svg viewBox="0 0 120 120" width="${size}" height="${size}">
      <path d="M22 48 Q22 32 40 32 Q46 22 60 22 Q80 22 82 40 Q96 40 96 54 Q96 64 82 64 L32 64 Q22 64 22 54 Z" fill="#94a3b8" opacity="0.7"/>
      ${[72,82,92].map((y,i)=>`<line x1="18" y1="${y}" x2="102" y2="${y}" stroke="#cbd5e1" stroke-width="3" stroke-linecap="round" opacity="${0.8-i*0.2}"><animate attributeName="x1" values="18;24;18" dur="3s" begin="${i*0.4}s" repeatCount="indefinite"/></line>`).join('')}
    </svg>`,
  storm: (size = 120) => `
    <svg viewBox="0 0 120 120" width="${size}" height="${size}">
      <defs><linearGradient id="stG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#64748b"/><stop offset="1" stop-color="#334155"/></linearGradient></defs>
      <path d="M22 58 Q22 38 44 38 Q50 24 66 24 Q88 24 90 44 Q104 44 104 60 Q104 72 90 72 L34 72 Q22 72 22 60 Z" fill="url(#stG)"/>
      <polygon points="58,74 48,94 58,94 52,108 72,86 62,86 68,74" fill="#fbbf24">
        <animate attributeName="opacity" values="1;0.3;1" dur="0.8s" repeatCount="indefinite"/>
      </polygon>
    </svg>`,
};

// ---------- Utils ----------
const $ = id => document.getElementById(id);
const fmt = (n, d = 0) => Number.isFinite(n) ? n.toFixed(d) : '--';
const pad = n => String(n).padStart(2, '0');
const toF = c => c * 9 / 5 + 32;
const kmhToMph = k => k * 0.621371;
const kmToMi = k => k * 0.621371;
const degToCompass = d => {
  const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
  return dirs[Math.round(d / 22.5) % 16];
};
const uvLabel = u => u < 3 ? 'Low' : u < 6 ? 'Moderate' : u < 8 ? 'High' : u < 11 ? 'Very high' : 'Extreme';
const visLabel = km => km >= 10 ? 'Excellent' : km >= 5 ? 'Good' : km >= 2 ? 'Moderate' : 'Poor';
const formatTime = (date, tz) => date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: tz });
const formatLocalDate = (date, tz) => date.toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric', timeZone: tz });

// Open-Meteo returns times in the location's timezone but WITHOUT a timezone suffix.
// We need to parse them as if they were in `tz`, not the browser's local time.
// The simplest correct approach: treat the string as a "wall-clock" in `tz` and
// compute the equivalent UTC instant.
function parseLocalToDate(isoLike, tz) {
  // isoLike: "2026-04-24T09:03" — no Z, no offset
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(isoLike);
  if (!m) return new Date(isoLike);
  const [, y, mo, d, h, mi] = m.map(Number);
  // Create a Date as if these wall-clock numbers were UTC, then adjust for tz offset.
  const utcGuess = Date.UTC(y, mo - 1, d, h, mi);
  // Find offset of tz at that instant
  const tzDate = new Date(utcGuess);
  const tzParts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(tzDate).reduce((a, p) => (a[p.type] = p.value, a), {});
  const asTzUtc = Date.UTC(+tzParts.year, +tzParts.month - 1, +tzParts.day, +tzParts.hour % 24, +tzParts.minute);
  const offset = asTzUtc - utcGuess;
  return new Date(utcGuess - offset);
}

function tempText(c) {
  if (!Number.isFinite(c)) return '--';
  return state.unit === 'f' ? Math.round(toF(c)) : Math.round(c);
}

function applyTheme(theme, isNight, showStars = false) {
  document.body.className = '';
  if (isNight) document.body.classList.add('theme-night');
  else if (theme) document.body.classList.add('theme-' + theme);
  document.body.classList.toggle('show-stars', showStars);
}

// ---------- Stars ----------
function renderStars() {
  const s = $('stars');
  s.innerHTML = '';
  for (let i = 0; i < 50; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.animationDelay = Math.random() * 4 + 's';
    star.style.animationDuration = 2 + Math.random() * 4 + 's';
    s.appendChild(star);
  }
}

// ---------- Data fetch ----------
async function geocode(query) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('geocode failed');
  const j = await res.json();
  return j.results || [];
}

async function reverseGeocode(lat, lon) {
  // Open-Meteo doesn't have reverse geocoding; use a nearest-city workaround via search
  // Fallback: just show coordinates. We'll try BigDataCloud's free reverse geocoding.
  try {
    const r = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
    if (r.ok) {
      const j = await r.json();
      const name = j.city || j.locality || j.principalSubdivision;
      const region = [j.principalSubdivision, j.countryName].filter(Boolean).join(', ');
      if (name) return { name, admin1: j.principalSubdivision, country: j.countryName, display: region };
    }
  } catch {}
  return { name: `${lat.toFixed(2)}, ${lon.toFixed(2)}`, display: '' };
}

async function fetchWeather(lat, lon) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: 'temperature_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m,relative_humidity_2m,visibility,uv_index',
    hourly: 'temperature_2m,precipitation_probability,weather_code,is_day',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max,uv_index_max',
    timezone: 'auto',
    forecast_days: 7,
  });
  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  if (!res.ok) throw new Error('weather fetch failed');
  return res.json();
}

// ---------- Render ----------
function render() {
  const d = state.data;
  if (!d) return;
  const tz = d.timezone;
  const cur = d.current;
  const hourly = d.hourly;
  const daily = d.daily;

  // Condition
  const code = cur.weather_code;
  const isDay = cur.is_day === 1;
  const info = WMO[code] || { label: 'Unknown', icon: 'cloud', theme: 'cloudy' };
  const iconKey = (info.icon === 'sun' && !isDay) ? 'moon' : info.icon;
  const useNightTheme = !isDay && (info.theme === 'sunny' || info.theme === 'cloudy' || info.theme === 'foggy');
  const showStars = !isDay && info.theme === 'sunny';

  applyTheme(info.theme, useNightTheme, showStars);

  // Activate rain/snow particle FX
  weatherFx.setMode(getWeatherFxMode(info.theme, isDay));

  // Location + time
  const placeName = state.place?.name || '—';
  const placeRegion = state.place?.display || '';
  // Clean up overly formal country names
  const cleanRegion = placeRegion
    .replace(/United States of America \(the\)/i, 'USA')
    .replace(/United States of America/i, 'USA')
    .replace(/United States/i, 'USA')
    .replace(/United Kingdom of Great Britain and Northern Ireland \(the\)/i, 'UK')
    .replace(/United Kingdom/i, 'UK')
    .replace(/Russian Federation \(the\)/i, 'Russia')
    .replace(/\s*\(the\)/gi, '');
  $('locName').textContent = cleanRegion ? `${placeName}, ${cleanRegion}` : placeName;
  const localNow = new Date();
  $('locTime').textContent = formatLocalDate(localNow, tz) + ' · ' + formatTime(localNow, tz);

  $('conditionBadge').textContent = info.label;
  $('weatherArt').innerHTML = icons[iconKey](180);

  // Temps
  $('temp').textContent = tempText(cur.temperature_2m);
  $('feelsLike').textContent = tempText(cur.apparent_temperature) + '°';
  $('tempHigh').textContent = tempText(daily.temperature_2m_max[0]) + '°';
  $('tempLow').textContent = tempText(daily.temperature_2m_min[0]) + '°';

  // Sun
  const sunrise = parseLocalToDate(daily.sunrise[0], tz);
  const sunset  = parseLocalToDate(daily.sunset[0],  tz);
  $('sunrise').textContent = formatTime(sunrise, tz);
  $('sunset').textContent  = formatTime(sunset,  tz);
  const daylightMs = sunset - sunrise;
  const dh = Math.floor(daylightMs / 3600000);
  const dm = Math.floor((daylightMs % 3600000) / 60000);
  $('daylight').textContent = `${dh}h ${dm}m`;

  // Stats
  const isMph = state.speed === 'mph';
  const speedLabel = isMph ? 'mph' : 'km/h';
  const distLabel = isMph ? 'mi' : 'km';
  const windVal = isMph ? Math.round(kmhToMph(cur.wind_speed_10m)) : Math.round(cur.wind_speed_10m);
  const gustVal = isMph ? Math.round(kmhToMph(cur.wind_gusts_10m)) : Math.round(cur.wind_gusts_10m);
  $('windSpeed').textContent = windVal;
  $('windSpeed').nextElementSibling.textContent = speedLabel;
  $('windDir').textContent = degToCompass(cur.wind_direction_10m) + ` · Gusts ${gustVal} ${speedLabel}`;
  $('humidity').textContent = cur.relative_humidity_2m;
  $('humidityBar').style.width = cur.relative_humidity_2m + '%';
  $('uv').textContent = fmt(cur.uv_index, 1);
  $('uvLabel').textContent = uvLabel(cur.uv_index);
  $('pressure').textContent = Math.round(cur.pressure_msl);
  $('pressureTrend').textContent = cur.pressure_msl > 1013 ? 'Above average' : 'Below average';
  const visKm = cur.visibility / 1000;
  const visVal = isMph ? kmToMi(visKm) : visKm;
  $('visibility').textContent = fmt(visVal, 1);
  $('visibility').nextElementSibling.textContent = distLabel;
  $('visLabel').textContent = visLabel(visKm);

  // Precipitation probability at the current hour in the location's timezone
  const currentHourStr = new Date().toLocaleString('en-US', { hour: 'numeric', hour12: false, timeZone: tz });
  const currentHourNum = parseInt(currentHourStr, 10);
  const precipIdx = hourly.time.findIndex(t => {
    const h = parseInt(t.split('T')[1], 10);
    return h === currentHourNum;
  });
  $('precip').textContent = hourly.precipitation_probability?.[precipIdx >= 0 ? precipIdx : 0] ?? 0;
  $('precipSub').textContent = cur.precipitation > 0 ? `${cur.precipitation.toFixed(1)} mm now` : 'Currently dry';

  // Hourly
  renderHourly(d);

  // Forecast
  renderForecast(d);
}

function renderHourly(d) {
  const hourly = d.hourly;
  const tz = d.timezone;
  const nowIdx = hourly.time.findIndex(t => new Date(t).getTime() >= Date.now() - 1800000);
  const start = Math.max(0, nowIdx);
  const end = Math.min(hourly.time.length, start + 24);

  const times  = hourly.time.slice(start, end);
  const temps  = hourly.temperature_2m.slice(start, end);
  const codes  = hourly.weather_code.slice(start, end);
  const isDays = hourly.is_day.slice(start, end);
  const probs  = hourly.precipitation_probability.slice(start, end);

  // Strip
  const strip = $('hourlyStrip');
  strip.innerHTML = times.map((t, i) => {
    const dt = new Date(t);
    const hour = dt.toLocaleTimeString('en-US', { hour: 'numeric', timeZone: tz });
    const info = WMO[codes[i]] || WMO[3];
    const iconKey = (info.icon === 'sun' && !isDays[i]) ? 'moon' : info.icon;
    return `
      <div class="hour">
        <div class="hour-time">${i === 0 ? 'Now' : hour}</div>
        <div class="hour-ico">${icons[iconKey](32)}</div>
        <div class="hour-temp">${tempText(temps[i])}°</div>
        ${probs[i] > 10 ? `<div class="hour-precip">💧 ${probs[i]}%</div>` : ''}
      </div>`;
  }).join('');

  $('hourlyRange').textContent = `${formatTime(new Date(times[0]), tz)} — ${formatTime(new Date(times[times.length-1]), tz)}`;

  // Chart
  drawChart(times, temps, tz);
}

function drawChart(times, tempsC, tz) {
  const canvas = $('hourlyChart');
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const w = rect.width;
  const h = rect.height;
  const pad = { top: 20, right: 20, bottom: 28, left: 20 };

  const temps = tempsC.map(c => state.unit === 'f' ? toF(c) : c);
  const min = Math.min(...temps);
  const max = Math.max(...temps);
  const range = Math.max(1, max - min);

  ctx.clearRect(0, 0, w, h);

  // Plot line
  const points = temps.map((t, i) => {
    const x = pad.left + (i / (temps.length - 1)) * (w - pad.left - pad.right);
    const y = pad.top + (1 - (t - min) / range) * (h - pad.top - pad.bottom);
    return { x, y, t };
  });

  // Gradient fill
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, 'rgba(125, 211, 252, 0.4)');
  grad.addColorStop(1, 'rgba(125, 211, 252, 0)');

  ctx.beginPath();
  ctx.moveTo(points[0].x, h - pad.bottom);
  points.forEach((p, i) => {
    if (i === 0) ctx.lineTo(p.x, p.y);
    else {
      const prev = points[i - 1];
      const cx = (prev.x + p.x) / 2;
      ctx.quadraticCurveTo(prev.x, prev.y, cx, (prev.y + p.y) / 2);
      ctx.lineTo(p.x, p.y);
    }
  });
  ctx.lineTo(points[points.length - 1].x, h - pad.bottom);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Line
  ctx.beginPath();
  points.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
  ctx.strokeStyle = '#7dd3fc';
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.stroke();

  // Temperature labels at peaks
  ctx.font = '600 11px Segoe UI, system-ui, sans-serif';
  ctx.fillStyle = 'rgba(241, 245, 249, 0.9)';
  ctx.textAlign = 'center';
  const step = Math.max(1, Math.floor(points.length / 8));
  points.forEach((p, i) => {
    if (i % step === 0) {
      ctx.fillText(`${Math.round(p.t)}°`, p.x, p.y - 8);
    }
  });

  // Time labels
  ctx.fillStyle = 'rgba(241, 245, 249, 0.45)';
  ctx.font = '500 10px Segoe UI, system-ui, sans-serif';
  points.forEach((p, i) => {
    if (i % step === 0) {
      const t = new Date(times[i]);
      const lbl = t.toLocaleTimeString('en-US', { hour: 'numeric', timeZone: tz });
      ctx.fillText(lbl, p.x, h - 8);
    }
  });
}

function renderForecast(d) {
  const list = $('forecastList');
  const daily = d.daily;
  list.innerHTML = daily.time.map((t, i) => {
    const date = new Date(t + 'T12:00:00');
    const name = i === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });
    const info = WMO[daily.weather_code[i]] || WMO[3];
    return `
      <div class="day">
        <div class="day-name">${name}</div>
        <div class="day-ico">${icons[info.icon](44)}</div>
        <div class="day-temps">
          <span class="day-hi">${tempText(daily.temperature_2m_max[i])}°</span>
          <span class="day-lo">${tempText(daily.temperature_2m_min[i])}°</span>
        </div>
        ${daily.precipitation_probability_max[i] > 10 ? `<div class="day-precip">💧 ${daily.precipitation_probability_max[i]}%</div>` : '<div class="day-precip" style="visibility:hidden">·</div>'}
      </div>`;
  }).join('');
}

// ---------- Loading + error ----------
function showLoader(show) {
  $('loader').classList.toggle('hide', !show);
}

async function loadWeather(lat, lon, placeInfo) {
  showLoader(true);
  try {
    const data = await fetchWeather(lat, lon);
    state.lat = lat;
    state.lon = lon;
    state.data = data;
    state.place = placeInfo || await reverseGeocode(lat, lon);
    render();
    localStorage.setItem('aurora:last', JSON.stringify({ lat, lon, place: state.place }));
  } catch (err) {
    console.error(err);
    $('locName').textContent = 'Unable to load weather';
  } finally {
    showLoader(false);
  }
}

// ---------- Search ----------
let searchTimer = null;
const input = $('searchInput');
const sugg = $('suggestions');

input.addEventListener('input', () => {
  clearTimeout(searchTimer);
  const q = input.value.trim();
  if (q.length < 2) { sugg.classList.remove('show'); return; }
  searchTimer = setTimeout(async () => {
    try {
      const results = await geocode(q);
      if (!results.length) { sugg.classList.remove('show'); return; }
      sugg.innerHTML = results.map((r, i) => `
        <div class="suggestion-item" data-idx="${i}">
          <div class="suggestion-name">${r.name}</div>
          <div class="suggestion-region">${[r.admin1, r.country].filter(Boolean).join(', ')}</div>
        </div>`).join('');
      sugg.classList.add('show');
      sugg.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', () => {
          const r = results[Number(item.dataset.idx)];
          input.value = r.name;
          sugg.classList.remove('show');
          loadWeather(r.latitude, r.longitude, {
            name: r.name,
            display: [r.admin1, r.country].filter(Boolean).join(', '),
          });
        });
      });
    } catch {}
  }, 220);
});

document.addEventListener('click', e => {
  if (!e.target.closest('.search-wrap')) sugg.classList.remove('show');
});

input.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const first = sugg.querySelector('.suggestion-item');
    if (first) first.click();
  }
});

// ---------- Geolocation ----------
$('geoBtn').addEventListener('click', () => {
  if (!navigator.geolocation) return;
  showLoader(true);
  navigator.geolocation.getCurrentPosition(
    pos => loadWeather(pos.coords.latitude, pos.coords.longitude),
    err => { console.warn(err); showLoader(false); },
    { enableHighAccuracy: false, timeout: 8000, maximumAge: 600000 }
  );
});

// ---------- Units ----------
document.querySelectorAll('.unit-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.unit-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.unit = btn.dataset.unit;
    if (state.data) render();
  });
});

document.querySelectorAll('.speed-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.speed = btn.dataset.speed;
    if (state.data) render();
  });
});

// ---------- Weather FX (rain / snow / cloud / fog / hail particles) ----------
const weatherFx = (() => {
  const canvas = $('weatherFx');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mode = null; // 'rain', 'snow', 'clouds', 'fog', 'hail', or null
  let animId = null;

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // --- Rain (with optional lightning for storms) ---
  let isStorm = false;
  let lightningTimer = 0;
  let lightningFlash = 0; // countdown frames for flash
  let lightningBolt = null; // current bolt path

  function createLightningBolt(w, h) {
    const points = [];
    let x = w * 0.2 + Math.random() * w * 0.6;
    let y = 0;
    points.push({ x, y });
    const segments = 8 + Math.floor(Math.random() * 6);
    for (let i = 0; i < segments; i++) {
      x += (Math.random() - 0.5) * 80;
      y += h / segments * (0.7 + Math.random() * 0.6);
      points.push({ x, y: Math.min(y, h) });
      // Random branch
      if (Math.random() > 0.6) {
        const bx = x + (Math.random() - 0.5) * 120;
        const by = y + 20 + Math.random() * 60;
        points.push({ x: bx, y: by, branch: true });
        points.push({ x, y, rejoin: true });
      }
    }
    return points;
  }

  function drawLightning(w, h) {
    if (!isStorm) return;

    lightningTimer--;
    if (lightningTimer <= 0) {
      // Trigger a new lightning strike
      lightningBolt = createLightningBolt(w, h);
      lightningFlash = 8 + Math.floor(Math.random() * 6);
      lightningTimer = 180 + Math.floor(Math.random() * 300); // 3-8 seconds at 60fps
    }

    if (lightningFlash > 0) {
      lightningFlash--;

      // Screen flash
      const flashAlpha = lightningFlash > 4 ? 0.15 : lightningFlash > 2 ? 0.06 : 0.02;
      ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha})`;
      ctx.fillRect(0, 0, w, h);

      // Draw bolt
      if (lightningBolt && lightningFlash > 1) {
        ctx.save();
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.7 + lightningFlash * 0.03})`;
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowColor = '#7dd3fc';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        let branching = false;
        for (let i = 0; i < lightningBolt.length; i++) {
          const p = lightningBolt[i];
          if (p.branch) {
            // Start a branch
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(lightningBolt[i - 1].x, lightningBolt[i - 1].y);
            ctx.lineWidth = 1.2;
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
            branching = true;
          } else if (p.rejoin) {
            // Return to main path
            ctx.beginPath();
            ctx.lineWidth = 2.5;
            ctx.moveTo(p.x, p.y);
            branching = false;
          } else {
            if (i === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
          }
        }
        ctx.stroke();
        ctx.restore();
      }
    }
  }

  function drawRainWithLightning() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);
    for (const p of particles) {
      p.y += p.speed;
      p.x += p.drift;
      if (p.y > h) { p.y = Math.random() * -60; p.x = Math.random() * w; }
      if (p.x < 0) p.x = w;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + p.drift * 0.5, p.y + p.len);
      ctx.strokeStyle = `rgba(174, 210, 245, ${p.opacity})`;
      ctx.lineWidth = 1.5;
      ctx.lineCap = 'round';
      ctx.stroke();
    }
    drawLightning(w, h);
  }
  function createRainDrop() {
    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * -window.innerHeight,
      len: 14 + Math.random() * 20,
      speed: 8 + Math.random() * 10,
      opacity: 0.3 + Math.random() * 0.5,
      drift: -1 + Math.random() * -1.5,
    };
  }

  function drawRain() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);
    for (const p of particles) {
      p.y += p.speed;
      p.x += p.drift;
      if (p.y > h) { p.y = Math.random() * -60; p.x = Math.random() * w; }
      if (p.x < 0) p.x = w;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + p.drift * 0.5, p.y + p.len);
      ctx.strokeStyle = `rgba(174, 210, 245, ${p.opacity})`;
      ctx.lineWidth = 1.5;
      ctx.lineCap = 'round';
      ctx.stroke();
    }
  }

  // --- Snow ---
  function createSnowflake() {
    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * -window.innerHeight,
      r: 1.5 + Math.random() * 3.5,
      speed: 0.5 + Math.random() * 1.5,
      opacity: 0.3 + Math.random() * 0.5,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.01 + Math.random() * 0.02,
      wobbleAmp: 0.5 + Math.random() * 1,
    };
  }

  function drawSnow() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);
    for (const p of particles) {
      p.y += p.speed;
      p.wobble += p.wobbleSpeed;
      p.x += Math.sin(p.wobble) * p.wobbleAmp;
      if (p.y > h + 10) { p.y = -10; p.x = Math.random() * w; }
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
      ctx.fill();
    }
  }

  // --- Clouds (drifting translucent wisps) ---
  function createCloudWisp() {
    return {
      x: Math.random() * window.innerWidth * 1.5 - window.innerWidth * 0.25,
      y: Math.random() * window.innerHeight,
      w: 250 + Math.random() * 400,
      h: 50 + Math.random() * 80,
      speed: 0.2 + Math.random() * 0.4,
      opacity: 0.06 + Math.random() * 0.1,
    };
  }

  function drawClouds() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);
    for (const p of particles) {
      p.x += p.speed;
      if (p.x > w + p.w) { p.x = -p.w - 50; p.y = Math.random() * h; }
      // Draw layered ellipses for a puffier look
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.w / 2, p.h / 2, 0, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 210, 225, ${p.opacity})`;
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(p.x + p.w * 0.15, p.y - p.h * 0.2, p.w / 3, p.h / 2.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(210, 220, 235, ${p.opacity * 0.8})`;
      ctx.fill();
    }
  }

  // --- Fog (thick rolling horizontal layers) ---
  function createFogLayer() {
    return {
      x: Math.random() * window.innerWidth * 2 - window.innerWidth * 0.5,
      y: window.innerHeight * 0.2 + Math.random() * window.innerHeight * 0.7,
      w: 400 + Math.random() * 600,
      h: 60 + Math.random() * 100,
      speed: 0.1 + Math.random() * 0.25,
      opacity: 0.06 + Math.random() * 0.1,
      phase: Math.random() * Math.PI * 2,
      phaseSpeed: 0.003 + Math.random() * 0.005,
    };
  }

  function drawFog() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);
    // Base fog wash
    const grad = ctx.createLinearGradient(0, h * 0.3, 0, h);
    grad.addColorStop(0, 'rgba(180, 190, 200, 0)');
    grad.addColorStop(0.5, 'rgba(180, 190, 200, 0.06)');
    grad.addColorStop(1, 'rgba(180, 190, 200, 0.12)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    // Fog layers
    for (const p of particles) {
      p.x += p.speed;
      p.phase += p.phaseSpeed;
      const yOff = Math.sin(p.phase) * 8;
      if (p.x > w + p.w) { p.x = -p.w - 100; p.y = h * 0.2 + Math.random() * h * 0.7; }
      ctx.beginPath();
      ctx.ellipse(p.x, p.y + yOff, p.w / 2, p.h / 2, 0, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 210, 220, ${p.opacity})`;
      ctx.fill();
    }
  }

  // --- Hail (ice pellets + rain mix) ---
  function createHailstone() {
    const isIce = Math.random() > 0.4;
    if (isIce) {
      return {
        type: 'ice',
        x: Math.random() * window.innerWidth,
        y: Math.random() * -window.innerHeight,
        r: 2 + Math.random() * 4,
        speed: 6 + Math.random() * 8,
        opacity: 0.5 + Math.random() * 0.4,
        drift: -0.5 + Math.random() * -1,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: 0.05 + Math.random() * 0.1,
      };
    }
    return {
      type: 'rain',
      x: Math.random() * window.innerWidth,
      y: Math.random() * -window.innerHeight,
      len: 10 + Math.random() * 14,
      speed: 9 + Math.random() * 10,
      opacity: 0.15 + Math.random() * 0.3,
      drift: -1 + Math.random() * -1.5,
    };
  }

  function drawHail() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);
    for (const p of particles) {
      p.y += p.speed;
      p.x += (p.drift || 0);
      if (p.y > h) { p.y = Math.random() * -80; p.x = Math.random() * w; }
      if (p.x < 0) p.x = w;

      if (p.type === 'ice') {
        p.rotation += p.rotSpeed;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        // Draw a small irregular ice pellet
        ctx.beginPath();
        ctx.moveTo(-p.r, -p.r * 0.5);
        ctx.lineTo(0, -p.r);
        ctx.lineTo(p.r, -p.r * 0.5);
        ctx.lineTo(p.r * 0.7, p.r * 0.6);
        ctx.lineTo(-p.r * 0.7, p.r * 0.6);
        ctx.closePath();
        ctx.fillStyle = `rgba(220, 235, 255, ${p.opacity})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(180, 210, 240, ${p.opacity * 0.6})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
        ctx.restore();
      } else {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.drift * 0.5, p.y + p.len);
        ctx.strokeStyle = `rgba(174, 210, 245, ${p.opacity})`;
        ctx.lineWidth = 1.2;
        ctx.lineCap = 'round';
        ctx.stroke();
      }
    }
  }

  // --- Sun rays (subtle rotating golden light beams) ---
  let sunAngle = 0;

  function drawSunRays() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);
    sunAngle += 0.001;

    const cx = w * 0.75;
    const cy = h * 0.12;
    const rayCount = 14;
    const maxLen = Math.max(w, h) * 1.2;

    for (let i = 0; i < rayCount; i++) {
      const angle = sunAngle + (i / rayCount) * Math.PI * 2;
      const spread = 0.04 + Math.sin(sunAngle * 3 + i) * 0.015;
      const opacity = 0.03 + Math.sin(sunAngle * 2 + i * 0.7) * 0.015;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(maxLen, -maxLen * spread);
      ctx.lineTo(maxLen, maxLen * spread);
      ctx.closePath();

      const grad = ctx.createLinearGradient(0, 0, maxLen, 0);
      grad.addColorStop(0, `rgba(251, 191, 36, ${opacity * 2})`);
      grad.addColorStop(0.3, `rgba(253, 230, 138, ${opacity})`);
      grad.addColorStop(1, 'rgba(253, 230, 138, 0)');
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();
    }

    // Subtle warm glow at the source
    const glowGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 250);
    glowGrad.addColorStop(0, 'rgba(251, 191, 36, 0.08)');
    glowGrad.addColorStop(0.5, 'rgba(253, 230, 138, 0.03)');
    glowGrad.addColorStop(1, 'rgba(253, 230, 138, 0)');
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, 0, w, h);

    // Floating dust/light particles
    for (const p of particles) {
      p.y -= p.speed;
      p.x += Math.sin(p.wobble) * p.wobbleAmp;
      p.wobble += p.wobbleSpeed;
      p.life += p.lifeSpeed;

      const alpha = p.baseOpacity * Math.sin(p.life);
      if (p.y < -10 || alpha < 0) {
        p.y = h + 10;
        p.x = Math.random() * w;
        p.life = 0;
      }

      if (alpha > 0) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(253, 230, 138, ${Math.max(0, alpha)})`;
        ctx.fill();
      }
    }
  }

  function createSunMote() {
    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: 1 + Math.random() * 2.5,
      speed: 0.15 + Math.random() * 0.3,
      baseOpacity: 0.15 + Math.random() * 0.25,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.005 + Math.random() * 0.01,
      wobbleAmp: 0.3 + Math.random() * 0.5,
      life: Math.random() * Math.PI,
      lifeSpeed: 0.008 + Math.random() * 0.01,
    };
  }

  function drawMoonGlow() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);

    const cx = w * 0.78;
    const cy = h * 0.15;
    const r = 34;

    const glowGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 220);
    glowGrad.addColorStop(0, 'rgba(241, 245, 249, 0.12)');
    glowGrad.addColorStop(0.35, 'rgba(191, 219, 254, 0.08)');
    glowGrad.addColorStop(1, 'rgba(191, 219, 254, 0)');
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.fillStyle = 'rgba(241, 245, 249, 0.88)';
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(cx + 14, cy - 4, r * 0.92, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.globalCompositeOperation = 'source-over';

    for (const p of particles) {
      p.y -= p.speed;
      p.x += Math.sin(p.wobble) * p.wobbleAmp;
      p.wobble += p.wobbleSpeed;
      p.life += p.lifeSpeed;

      const alpha = p.baseOpacity * Math.sin(p.life);
      if (p.y < -10 || alpha < 0) {
        p.y = h + 10;
        p.x = Math.random() * w;
        p.life = 0;
      }

      if (alpha > 0) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(191, 219, 254, ${Math.max(0, alpha)})`;
        ctx.fill();
      }
    }
  }

  function createMoonMote() {
    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: 1 + Math.random() * 2,
      speed: 0.08 + Math.random() * 0.18,
      baseOpacity: 0.08 + Math.random() * 0.14,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.004 + Math.random() * 0.008,
      wobbleAmp: 0.2 + Math.random() * 0.45,
      life: Math.random() * Math.PI,
      lifeSpeed: 0.006 + Math.random() * 0.008,
    };
  }

  // --- Particle init ---
  const configs = {
    sunny:     { count: 40,  factory: createSunMote,   draw: drawSunRays,           storm: false },
    moonlight: { count: 28,  factory: createMoonMote,  draw: drawMoonGlow,          storm: false },
    rain:      { count: 200, factory: createRainDrop,  draw: drawRain,              storm: false },
    storm:     { count: 250, factory: createRainDrop,  draw: drawRainWithLightning, storm: true  },
    snow:      { count: 120, factory: createSnowflake, draw: drawSnow,              storm: false },
    clouds:    { count: 18,  factory: createCloudWisp, draw: drawClouds,            storm: false },
    fog:       { count: 25,  factory: createFogLayer,  draw: drawFog,               storm: false },
    hail:      { count: 180, factory: createHailstone, draw: drawHail,              storm: false },
  };

  function initParticles(type) {
    const cfg = configs[type];
    if (!cfg) return;
    isStorm = cfg.storm;
    lightningTimer = 60 + Math.floor(Math.random() * 120);
    lightningFlash = 0;
    lightningBolt = null;
    particles = [];
    for (let i = 0; i < cfg.count; i++) {
      const p = cfg.factory();
      // Spread particles across screen initially
      if (type !== 'clouds' && type !== 'fog' && type !== 'sunny' && type !== 'moonlight') {
        p.y = Math.random() * window.innerHeight;
      }
      particles.push(p);
    }
  }

  function loop() {
    if (!mode) return;
    const cfg = configs[mode];
    if (cfg) cfg.draw();
    animId = requestAnimationFrame(loop);
  }

  function setMode(newMode) {
    if (newMode === mode) return;
    if (animId) cancelAnimationFrame(animId);
    animId = null;
    mode = newMode;

    if (!mode) {
      canvas.classList.add('hidden');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles = [];
      return;
    }

    canvas.classList.remove('hidden');
    resize();
    initParticles(mode);
    loop();
  }

  window.addEventListener('resize', () => {
    if (mode) resize();
  });

  return { setMode };
})();

// Map weather theme to FX mode
function getWeatherFxMode(theme, isDay) {
  if (theme === 'sunny') return isDay ? 'sunny' : 'moonlight';
  if (theme === 'rainy') return 'rain';
  if (theme === 'stormy') return 'storm';
  if (theme === 'snowy') return 'snow';
  if (theme === 'cloudy') return 'clouds';
  if (theme === 'foggy') return 'fog';
  if (theme === 'hail') return 'hail';
  return null;
}

// ---------- Init ----------
window.addEventListener('resize', () => { if (state.data) drawChart(
  state.data.hourly.time.slice(0, 24),
  state.data.hourly.temperature_2m.slice(0, 24),
  state.data.timezone
); });

renderStars();

(function init() {
  const last = localStorage.getItem('aurora:last');
  if (last) {
    try {
      const { lat, lon, place } = JSON.parse(last);
      if (Number.isFinite(lat) && Number.isFinite(lon)) {
        loadWeather(lat, lon, place);
        return;
      }
    } catch {}
  }
  // Default: New York
  loadWeather(40.7128, -74.0060, { name: 'New York', display: 'New York, United States' });
})();


// ---------- PWA Service Worker ----------
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('SW registered:', reg.scope))
      .catch(err => console.warn('SW registration failed:', err));
  });
}
