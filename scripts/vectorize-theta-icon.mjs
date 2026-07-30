import fs from "node:fs";
import path from "node:path";
import ImageTracer from "imagetracerjs";
import sharp from "sharp";

const input = "C:/Users/ether/OneDrive/Desktop/theta-scribe-icon.png";
const outputSvg = path.resolve("public/images/theta-scribe-icon.svg");
const outputPng = path.resolve("public/images/theta-scribe-icon.png");

const { data, info } = await sharp(input)
  .resize(512, 512, { fit: "contain" })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const imageData = {
  width: info.width,
  height: info.height,
  data: new Uint8ClampedArray(data),
};

const svg = ImageTracer.imagedataToSVG(imageData, {
  ltres: 0.5,
  qtres: 0.5,
  pathomit: 4,
  colorsampling: 1,
  numberofcolors: 24,
  mincolorratio: 0.01,
  colorquantcycles: 4,
  scale: 1,
  linefilter: false,
  rightangleenhance: false,
  viewbox: true,
});

fs.mkdirSync(path.dirname(outputSvg), { recursive: true });
fs.writeFileSync(outputSvg, svg);
await sharp(input).resize(512, 512, { fit: "contain" }).png().toFile(outputPng);

console.log("Wrote", outputSvg);
console.log("Wrote", outputPng);
console.log("SVG size:", (fs.statSync(outputSvg).size / 1024).toFixed(1), "KB");
