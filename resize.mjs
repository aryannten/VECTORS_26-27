import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const inputFile = '01-Gemini_Generated_Image_745wmd745wmd745w (1).webp';
const outDir = 'client/public';

async function resizeImage(width, name) {
  const outputPath = path.join(outDir, `${name}.webp`);
  console.log(`Generating ${name} (${width}w)...`);
  await sharp(inputFile)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 90, effort: 6 })
    .toFile(outputPath);
  console.log(`Done: ${outputPath}`);
}

async function run() {
  try {
    // 4K size (3840w)
    await resizeImage(3840, 'hero-bg-4k');
    // 2K / Desktop size (2560w)
    await resizeImage(2560, 'hero-bg-2k');
    // Mobile / Tablet size (1280w)
    await resizeImage(1280, 'hero-bg-mobile');
    
    // Copy the original massive file back as the ultimate fallback
    fs.copyFileSync(inputFile, path.join(outDir, 'hero-bg.webp'));
    console.log('Done: restored original hero-bg.webp');
  } catch (err) {
    console.error('Error generating images:', err);
  }
}

run();
