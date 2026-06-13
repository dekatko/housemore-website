import sharp from 'sharp';

// OG image: 1200x630, teal gradient, H+roof logomark, wordmark, tagline
// The logomark is the nav SVG scaled to ~120px, centred-left in a 200px zone.
// Wordmark and tagline sit to the right in the remaining space.

const W = 1200;
const H = 630;

// Scale factor: nav SVG is 36x36, we want ~120px → scale = 120/36 ≈ 3.333
const LOGO_SRC = 36;
const LOGO_SIZE = 120;
const S = LOGO_SIZE / LOGO_SRC; // 3.333…

// Logo is centred horizontally in the left 260px column, vertically centred
const logoX = (260 - LOGO_SIZE) / 2;  // ~70
const logoY = (H - LOGO_SIZE) / 2;    // ~255

// Text block starts at x=300, vertically centred
const textX = 300;

function scale(n) { return (n * S).toFixed(3); }
function scaleX(n) { return (logoX + n * S).toFixed(3); }
function scaleY(n) { return (logoY + n * S).toFixed(3); }

const svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"
  xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#14B8A6"/>
      <stop offset="100%" stop-color="#0D9488"/>
    </linearGradient>
    <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1DD1BF"/>
      <stop offset="100%" stop-color="#0E8077"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="url(#bg)"/>

  <!-- Subtle noise overlay via a very light semi-transparent rect pattern -->
  <rect width="${W}" height="${H}" fill="rgba(0,0,0,0.04)"/>

  <!-- Vertical divider between logo zone and text -->
  <line x1="260" y1="80" x2="260" y2="${H - 80}"
        stroke="rgba(255,255,255,0.2)" stroke-width="1"/>

  <!-- ── LOGOMARK (nav SVG paths, scaled ${S.toFixed(3)}×) ── -->
  <!-- Rounded square background -->
  <rect x="${logoX}" y="${logoY}" width="${scale(LOGO_SRC)}" height="${scale(LOGO_SRC)}"
        rx="${scale(8)}" fill="rgba(255,255,255,0.18)"/>

  <!-- H left vertical: x=10.5,y=14,w=3.5,h=13,rx=1.75 -->
  <rect x="${scaleX(10.5)}" y="${scaleY(14)}" width="${scale(3.5)}" height="${scale(13)}"
        rx="${scale(1.75)}" fill="white"/>

  <!-- H right vertical: x=22,y=14,w=3.5,h=13,rx=1.75 -->
  <rect x="${scaleX(22)}" y="${scaleY(14)}" width="${scale(3.5)}" height="${scale(13)}"
        rx="${scale(1.75)}" fill="white"/>

  <!-- H crossbar: x=10.5,y=19,w=15,h=3,rx=1.5 -->
  <rect x="${scaleX(10.5)}" y="${scaleY(19)}" width="${scale(15)}" height="${scale(3)}"
        rx="${scale(1.5)}" fill="white"/>

  <!-- Roof chevron: points="8.5,14 18,7.5 27.5,14" -->
  <polyline
    points="${scaleX(8.5)},${scaleY(14)} ${scaleX(18)},${scaleY(7.5)} ${scaleX(27.5)},${scaleY(14)}"
    fill="none" stroke="white" stroke-width="${scale(2.8)}"
    stroke-linecap="round" stroke-linejoin="round"/>

  <!-- ── WORDMARK ── -->
  <text x="${textX}" y="${H / 2 - 48}"
        font-family="Georgia, 'Times New Roman', serif"
        font-size="86" font-weight="700"
        fill="white" letter-spacing="-2">Housemore</text>

  <!-- ── TAGLINE ── -->
  <text x="${textX}" y="${H / 2 + 28}"
        font-family="Arial, Helvetica, sans-serif"
        font-size="32" font-weight="400"
        fill="rgba(255,255,255,0.88)" letter-spacing="0.2">Know every household.</text>
  <text x="${textX}" y="${H / 2 + 74}"
        font-family="Arial, Helvetica, sans-serif"
        font-size="32" font-weight="400"
        fill="rgba(255,255,255,0.88)" letter-spacing="0.2">Keep every client.</text>
</svg>`;

await sharp(Buffer.from(svg))
  .png({ compressionLevel: 9 })
  .toFile('og-image.png');

console.log('og-image.png written (1200×630)');
