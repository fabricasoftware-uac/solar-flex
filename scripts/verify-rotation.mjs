import puppeteer from "puppeteer-core";

const b = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
});
const pg = await b.newPage();
await pg.setViewport({ width: 1440, height: 900 });
await pg.goto("http://localhost:4173/", { waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 3500));
await pg.mouse.move(720, 450);
await pg.mouse.wheel({ deltaY: 120 });

const seen = new Set();
for (let i = 0; i < 16; i++) {
  await new Promise((r) => setTimeout(r, 1000));
  seen.add(await pg.evaluate(() => document.querySelector("h1")?.textContent));
}
console.log(JSON.stringify([...seen], null, 1));
await b.close();
