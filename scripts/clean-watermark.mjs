#!/usr/bin/env node
// Removes the small Gemini "sparkle" watermark that consistently lands in
// the bottom-right corner of generated images, by blurring that corner and
// feathering it back into the photo so there's no visible patch.
import sharp from "sharp";

const [, , inputPath, outputPathArg] = process.argv;
if (!inputPath) {
  console.error("Usage: node scripts/clean-watermark.mjs <input-image> [output-image]");
  process.exit(1);
}
const outputPath = outputPathArg || inputPath.replace(/(\.\w+)$/, "-clean$1");

const { width, height } = await sharp(inputPath).metadata();

const boxX0 = Math.round(width * 0.76);
const boxY0 = Math.round(height * 0.82);
const boxX1 = Math.round(width * 0.98);
const boxY1 = Math.round(height * 0.99);
const boxW = boxX1 - boxX0;
const boxH = boxY1 - boxY0;

const blurredPatch = await sharp(inputPath)
  .extract({ left: boxX0, top: boxY0, width: boxW, height: boxH })
  .blur(20)
  .toBuffer();

const maskSvg = Buffer.from(
  `<svg width="${boxW}" height="${boxH}">
     <defs>
       <radialGradient id="g" cx="50%" cy="50%" r="55%">
         <stop offset="60%" stop-color="white" stop-opacity="1" />
         <stop offset="100%" stop-color="white" stop-opacity="0" />
       </radialGradient>
     </defs>
     <rect width="100%" height="100%" fill="url(#g)" />
   </svg>`,
);

const maskedPatch = await sharp(blurredPatch)
  .composite([{ input: await sharp(maskSvg).png().toBuffer(), blend: "dest-in" }])
  .png()
  .toBuffer();

await sharp(inputPath)
  .composite([{ input: maskedPatch, left: boxX0, top: boxY0 }])
  .toFile(outputPath);

console.log(`Cleaned image saved to ${outputPath}`);
