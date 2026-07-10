import puppeteer from "puppeteer-core";
import { readFileSync, writeFileSync } from "node:fs";

/**
 * Convierte los logos de aliados en versiones blancas con fondo
 * transparente: el fondo claro se vuelve alpha 0 y el resto blanco,
 * con borde suavizado según luminancia. Se ejecuta una sola vez.
 */
const LOGOS = [
  ["public/img/ally-emprendelab.png", "public/img/ally-emprendelab-white.png"],
  ["public/img/ally-autonoma.png", "public/img/ally-autonoma-white.png"],
];

const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
});
const page = await browser.newPage();

for (const [input, output] of LOGOS) {
  const url =
    "data:image/png;base64," + readFileSync(input).toString("base64");
  const dataUrl = await page.evaluate(async (src) => {
    const img = new Image();
    img.src = src;
    await img.decode();
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const px = data.data;
    for (let i = 0; i < px.length; i += 4) {
      const lum = (0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2]) / 255;
      // Fondo claro fuera, trazo blanco dentro, transición suave
      const alpha = Math.max(0, Math.min(1, (0.88 - lum) / 0.18));
      px[i] = 255;
      px[i + 1] = 255;
      px[i + 2] = 255;
      px[i + 3] = Math.round(alpha * (px[i + 3] / 255) * 255);
    }
    ctx.putImageData(data, 0, 0);
    return canvas.toDataURL("image/png");
  }, url);

  writeFileSync(output, Buffer.from(dataUrl.split(",")[1], "base64"));
  console.log("ok:", output);
}

await browser.close();
