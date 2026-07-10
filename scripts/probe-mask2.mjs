import puppeteer from "puppeteer-core";

/** ¿Aplica backdrop-filter sin máscara? ¿Qué dice el estilo computado? */
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

const info = await page.evaluate(() => {
  const root = document.querySelector(".z-30");
  const el = root?.firstElementChild;
  if (!el) return { found: false };
  const cs = getComputedStyle(el);
  // quitar máscaras por completo
  el.style.maskImage = "none";
  el.style.webkitMaskImage = "none";
  root.style.maskImage = "none";
  root.style.webkitMaskImage = "none";
  return {
    found: true,
    backdropFilter: cs.backdropFilter,
    maskBefore: cs.maskImage?.slice(0, 60),
    zIndex: getComputedStyle(root).zIndex,
    rect: el.getBoundingClientRect().toJSON(),
  };
});
console.log(JSON.stringify(info, null, 1));
await new Promise((r) => setTimeout(r, 600));
await page.screenshot({ path: process.argv[2] });
await browser.close();
console.log("saved", process.argv[2]);
