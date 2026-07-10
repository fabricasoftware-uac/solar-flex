import puppeteer from "puppeteer-core";

/** Prueba en vivo: ¿funciona backdrop-filter con la máscara en el
 *  elemento padre en lugar del propio elemento filtrado? */
const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
  args: ["--hide-scrollbars"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto("http://localhost:4173/", { waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 4000));
await page.evaluate(() => window.scrollTo({ top: 2600, behavior: "instant" }));
await new Promise((r) => setTimeout(r, 2200));
await page.mouse.move(400, 550, { steps: 10 });
await new Promise((r) => setTimeout(r, 900));

// Variante: máscara al padre, filtro puro en el hijo
await page.evaluate(() => {
  const layers = document.querySelectorAll(".z-30");
  const root = layers[0];
  const filterEl = root?.firstElementChild;
  if (!root || !filterEl) return;
  const mask = filterEl.style.maskImage;
  filterEl.style.maskImage = "none";
  filterEl.style.webkitMaskImage = "none";
  root.style.maskImage = mask;
  root.style.webkitMaskImage = mask;
});
await new Promise((r) => setTimeout(r, 600));
await page.screenshot({ path: process.argv[2] });
await browser.close();
console.log("saved", process.argv[2]);
