import puppeteer from "puppeteer-core";

/** Verifica el flujo completo: puerta → wheel → hero → rotación de
 *  frases → indicador de carga al hacer scroll. */
const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
  args: ["--hide-scrollbars", "--autoplay-policy=no-user-gesture-required"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));

await page.goto("http://localhost:4173/", { waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 3500));
await page.screenshot({ path: "shots-gate.png" });

// Cruzar la puerta con la rueda
await page.mouse.move(720, 450);
await page.mouse.wheel({ deltaY: 120 });
await new Promise((r) => setTimeout(r, 3200));
await page.screenshot({ path: "shots-hero.png" });

// Esperar la rotación del titular (hold 3.8s + transición)
await new Promise((r) => setTimeout(r, 4200));
const headline = await page.evaluate(
  () => document.querySelector("h1")?.textContent,
);
await page.screenshot({ path: "shots-rotated.png" });

// Scroll profundo: indicador de carga
await page.evaluate(() => window.scrollTo({ top: 6000, behavior: "instant" }));
await new Promise((r) => setTimeout(r, 2000));
const charge = await page.evaluate(
  () => document.querySelector("aside span")?.textContent,
);
await page.screenshot({ path: "shots-charge.png" });

console.log(JSON.stringify({ headline, charge, errors }, null, 1));
await browser.close();
