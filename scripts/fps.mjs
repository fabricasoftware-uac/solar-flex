import puppeteer from "puppeteer-core";

const url = process.argv[2] ?? "http://localhost:4173/";
const exe =
  process.argv[3] ?? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const browser = await puppeteer.launch({
  executablePath: exe,
  headless: "new",
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 4000));

const measure = () =>
  page.evaluate(
    () =>
      new Promise((resolve) => {
        let frames = 0;
        const start = performance.now();
        const loop = () => {
          frames += 1;
          if (performance.now() - start < 2000) requestAnimationFrame(loop);
          else resolve(Math.round(frames / 2));
        };
        requestAnimationFrame(loop);
      }),
  );

console.log("FPS hero:", await measure());

await page.evaluate(() => window.scrollTo(0, 2600));
await new Promise((r) => setTimeout(r, 1500));
console.log("FPS producto:", await measure());

await page.evaluate(() => window.scrollTo(0, 12000));
await new Promise((r) => setTimeout(r, 1500));
console.log("FPS CTA:", await measure());

await browser.close();
