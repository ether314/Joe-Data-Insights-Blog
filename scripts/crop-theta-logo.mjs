import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const input =
  "C:/Users/ether/.cursor/projects/e-AI-Projects-data-insights-blog/assets/c__Users_ether_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_theta-scribe-logo-2428e7fe-d424-4ad1-9ab8-bcde27ad16d3.png";
const output = path.resolve(__dirname, "../public/images/theta-scribe-logo.png");

const meta = await sharp(input).metadata();
const { width, height } = meta;
console.log("Source:", width, "x", height);

// Crop tightly to the central theta + quill only.
const left = Math.round(width * 0.335);
const top = Math.round(height * 0.19);
const cropWidth = Math.round(width * 0.33);
const cropHeight = Math.round(height * 0.31);

await sharp(input)
  .extract({ left, top, width: cropWidth, height: cropHeight })
  .resize(512, 512, { fit: "contain", background: { r: 10, g: 18, b: 32, alpha: 1 } })
  .png()
  .toFile(output);

console.log("Wrote:", output);
