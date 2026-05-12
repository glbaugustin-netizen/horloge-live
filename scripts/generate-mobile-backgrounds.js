const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inputDir = path.join(__dirname, '../public/backgrounds');
const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.webp') && !f.includes('-mobile'));

async function run() {
  for (const file of files) {
    const input = path.join(inputDir, file);
    const output = path.join(inputDir, file.replace('.webp', '-mobile.webp'));
    await sharp(input)
      .resize({ width: 828, withoutEnlargement: true })
      .webp({ quality: 70 })
      .toFile(output);
    const inSize = fs.statSync(input).size;
    const outSize = fs.statSync(output).size;
    console.log(`${file} → ${file.replace('.webp', '-mobile.webp')} (${Math.round(inSize/1024)}KB → ${Math.round(outSize/1024)}KB, -${Math.round((1-outSize/inSize)*100)}%)`);
  }
}

run().catch(console.error);
