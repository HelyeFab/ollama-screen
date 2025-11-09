const fs = require('fs');
const sharp = require('sharp');

// Convert SVG to PNG at different sizes for ICO
const sizes = [16, 32, 48, 256];

async function convertIcon() {
  const svgBuffer = fs.readFileSync('./public/icons/lama.svg');

  // Create PNG at 256x256 which works well for Windows shortcuts
  await sharp(svgBuffer)
    .resize(256, 256)
    .png()
    .toFile('./public/icons/lama.png');

  console.log('Icon converted successfully to PNG!');
}

convertIcon().catch(err => {
  console.error('Error converting icon:', err);
  process.exit(1);
});
