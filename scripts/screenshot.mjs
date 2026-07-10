import puppeteer from "puppeteer-core";

const [, , url = "http://localhost:4173/", out = "page.png", scrollY = "0", width = "1440", height = "900", settleMs = "2500"] =
  process.argv;

const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
  args: ["--disable-gpu", "--hide-scrollbars"],
});

const page = await browser.newPage();
await page.setViewport({ width: Number(width), height: Number(height) });

page.on("console", (msg) => console.log("[console]", msg.type(), msg.text()));
page.on("pageerror", (err) => console.log("[pageerror]", err.message));

await page.goto(url, { waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 3500));

if (Number(scrollY) > 0) {
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), Number(scrollY));
  await new Promise((r) => setTimeout(r, Number(settleMs)));
}

await page.screenshot({ path: out });
await browser.close();
console.log("saved", out);
