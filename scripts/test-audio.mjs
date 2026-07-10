import puppeteer from "puppeteer-core";

/** Simula el primer gesto del usuario y verifica que el motor de
 *  audio arranca sin errores (AudioContext running). */
const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
  args: ["--autoplay-policy=no-user-gesture-required"],
});

const page = await browser.newPage();
const errors = [];
page.on("pageerror", (err) => errors.push(err.message));
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text());
});

await page.goto("http://localhost:4173/", { waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 4000));
await page.mouse.click(720, 700);
await new Promise((r) => setTimeout(r, 2000));

const state = await page.evaluate(() => {
  const btn = document.querySelector('button[aria-pressed]');
  return {
    toggleFound: Boolean(btn),
    pressed: btn?.getAttribute("aria-pressed"),
    barsAnimating: btn
      ? getComputedStyle(btn.querySelector("span")).animationName
      : null,
  };
});

console.log("audio state:", JSON.stringify(state));
console.log("errors:", errors.length ? errors : "none");
await browser.close();
