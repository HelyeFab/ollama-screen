const fs = require('fs');
const toIco = require('to-ico');
const sharp = require('sharp');

async function convertToIco() {
  try {
    const svgBuffer = fs.readFileSync('./public/icons/lama.svg');

    // Generate PNGs at different sizes for the ICO file
    const sizes = [16, 32, 48, 64, 128, 256];
    const pngBuffers = await Promise.all(
      sizes.map(size =>
        sharp(svgBuffer)
          .resize(size, size)
          .png()
          .toBuffer()
      )
    );

    // Convert to ICO
    const icoBuffer = await toIco(pngBuffers);
    fs.writeFileSync('./public/icons/lama.ico', icoBuffer);

    console.log('✅ ICO file created successfully at public/icons/lama.ico');
  } catch (error) {
    console.error('❌ Error creating ICO file:', error);
    process.exit(1);
  }
}

convertToIco();
