import puppeteer from "puppeteer-core";

/** Screenshot con el mouse posado en un punto: verifica la linterna
 *  de color (CursorLight) sobre las imágenes. */
const [, , url, out, scrollY = "0", mx = "400", my = "600"] = process.argv;

const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
  args: ["--hide-scrollbars"],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
page.on("pageerror", (err) => console.log("[pageerror]", err.message));

await page.goto(url, { waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 4000));

// Cruzar la puerta de entrada
await page.mouse.move(720, 450);
await page.mouse.wheel({ deltaY: 120 });
await new Promise((r) => setTimeout(r, 2600));

if (Number(scrollY) > 0) {
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), Number(scrollY));
  await new Promise((r) => setTimeout(r, 2200));
}

await page.mouse.move(Number(mx), Number(my), { steps: 12 });
await new Promise((r) => setTimeout(r, 1200));

await page.screenshot({ path: out });
await browser.close();
console.log("saved", out);
