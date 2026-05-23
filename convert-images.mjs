import sharp from 'sharp';

const phoneScreens = [
  'home_dashboard_screen',
  'calendar_heatmap',
  'bookings_screen',
  'employees_screen',
];

const icons = [
  'calendar_heatmap',
  'booking_details',
];

async function run() {
  // Phone frames display at 280px (hero/screenshots) or 220px (how section).
  // Generate 280w and 560w (2x retina) WebP for all phone screen images.
  for (const name of phoneScreens) {
    for (const w of [280, 560]) {
      await sharp(`${name}.PNG`)
        .resize(w)
        .webp({ quality: 82 })
        .toFile(`${name}-${w}w.webp`);
      console.log(`${name}-${w}w.webp`);
    }
  }

  // Icons display at 52px. Generate 104w (2x) WebP.
  for (const name of icons) {
    await sharp(`${name}.PNG`)
      .resize(104)
      .webp({ quality: 82 })
      .toFile(`${name}-icon-104w.webp`);
    console.log(`${name}-icon-104w.webp`);
  }
}

run().catch(err => { console.error(err); process.exit(1); });
