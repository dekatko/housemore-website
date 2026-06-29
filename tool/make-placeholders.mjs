// Generates on-brand placeholder SVGs for Housemore marketing screenshots.
// Two families:
//   - mobile (phone screen, 280x560) -> drops into .phone-frame
//   - web    (browser screen, 1280x800, 16:10) -> drops into .browser-frame
// Each is clearly marked as a placeholder and is a 1:1 swap target for a real PNG.
import { writeFileSync } from 'node:fs';

const C = {
  teal: '#0D9488', tealLight: '#14B8A6', tealDark: '#0F766E',
  faint: '#F0FDFA', muted: '#6B7280', border: '#E5E7EB',
  bgSoft: '#F9FAFB', dark: '#0D1F1E', white: '#FFFFFF',
};

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Generic placeholder body (image glyph + labels), drawn into a w×h canvas.
function body(w, h, { title, surface, ratioNote }) {
  const cx = w / 2;
  const glyphY = h * 0.40;
  const g = Math.min(w, h) * 0.16; // glyph half-size
  const titleSize = Math.round(Math.min(w, h) * (surface === 'web' ? 0.038 : 0.062));
  const subSize = Math.round(titleSize * 0.62);
  const pillW = Math.max(96, title.length * 0); // unused, kept for clarity
  return `
  <rect x="0" y="0" width="${w}" height="${h}" fill="${C.bgSoft}"/>
  <rect x="${w*0.05}" y="${h*0.05}" width="${w*0.9}" height="${h*0.9}" rx="${Math.min(w,h)*0.04}"
        fill="${C.faint}" stroke="${C.teal}" stroke-width="2" stroke-dasharray="9 7" opacity="0.9"/>

  <!-- image glyph -->
  <g transform="translate(${cx}, ${glyphY})" opacity="0.85">
    <rect x="${-g}" y="${-g*0.78}" width="${g*2}" height="${g*1.56}" rx="${g*0.14}"
          fill="${C.white}" stroke="${C.teal}" stroke-width="2.5"/>
    <circle cx="${-g*0.42}" cy="${-g*0.30}" r="${g*0.20}" fill="${C.tealLight}"/>
    <path d="M ${-g*0.82} ${g*0.55} L ${-g*0.18} ${-g*0.10} L ${g*0.30} ${g*0.42} L ${g*0.55} ${g*0.16} L ${g*0.82} ${g*0.55} Z"
          fill="${C.teal}"/>
  </g>

  <!-- PLACEHOLDER pill -->
  <g transform="translate(${cx}, ${h*0.62})">
    <rect x="-78" y="-16" width="156" height="32" rx="16" fill="${C.teal}"/>
    <text x="0" y="5" text-anchor="middle" font-family="-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif"
          font-size="13" font-weight="700" letter-spacing="1.5" fill="${C.white}">PLACEHOLDER</text>
  </g>

  <text x="${cx}" y="${h*0.72}" text-anchor="middle"
        font-family="-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif"
        font-size="${titleSize}" font-weight="700" fill="${C.dark}">${esc(title)}</text>

  <text x="${cx}" y="${h*0.72 + titleSize + 8}" text-anchor="middle"
        font-family="-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif"
        font-size="${subSize}" font-weight="500" fill="${C.muted}">Replace with real screenshot</text>

  <text x="${cx}" y="${h*0.72 + titleSize + 8 + subSize + 10}" text-anchor="middle"
        font-family="ui-monospace,SFMono-Regular,Menlo,monospace"
        font-size="${Math.round(subSize*0.92)}" font-weight="500" fill="${C.teal}">${esc(ratioNote)}</text>

  <!-- surface tag -->
  <text x="${cx}" y="${h*0.93}" text-anchor="middle"
        font-family="-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif"
        font-size="${subSize}" font-weight="600" letter-spacing="0.5" fill="${C.tealDark}">
    Housemore · ${surface === 'web' ? 'Web app' : 'Mobile app'}</text>`;
}

function mobile(title) {
  const w = 280, h = 560;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="Placeholder screenshot: ${esc(title)} (mobile)">
${body(w, h, { title, surface: 'mobile', ratioNote: '280 × 560' })}
</svg>`;
}

function web(title) {
  const w = 1280, h = 800;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="Placeholder screenshot: ${esc(title)} (web app)">
${body(w, h, { title, surface: 'web', ratioNote: '1280 × 800  (16:10)' })}
</svg>`;
}

const targets = [
  // web (desktop dashboard) screens
  ['ph-web-booking-studio.svg',     web('Booking Studio')],
  ['ph-web-dashboard.svg',          web('Owner Dashboard')],
  ['ph-web-clients-households.svg', web('Clients & Households')],
  ['ph-web-leads-inquiries.svg',    web('Leads & Inquiries')],
  // mobile (app) screens
  ['ph-mobile-household.svg',       mobile('Household Profile')],
  ['ph-mobile-client-booking.svg',  mobile('Client Booking')],
  ['ph-mobile-employee-day.svg',    mobile('Field Schedule')],
];

for (const [name, svg] of targets) {
  writeFileSync(name, svg.trim() + '\n');
  console.log('wrote', name);
}
console.log('done:', targets.length, 'placeholders');
