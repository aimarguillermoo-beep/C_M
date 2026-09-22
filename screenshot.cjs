const puppeteer = require('puppeteer');
const path = require('path');

const SCREENSHOT_DIR = 'C:\\Users\\guill\\.gemini\\antigravity\\brain\\1f02a5bf-1fe2-4ba5-afbf-7a41a0bcbc8d';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // Home page - full page
  console.log('Capturing Home page...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2', timeout: 15000 });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'home_full.png'), fullPage: true });
  console.log('Home full page saved');

  // Home viewport only
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'home_viewport.png'), fullPage: false });
  console.log('Home viewport saved');

  // Products page
  console.log('Capturing Products page...');
  await page.goto('http://localhost:5173/productos', { waitUntil: 'networkidle2', timeout: 15000 });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'products_page.png'), fullPage: true });
  console.log('Products page saved');

  // Product detail
  console.log('Capturing Product detail...');
  await page.goto('http://localhost:5173/producto/1', { waitUntil: 'networkidle2', timeout: 15000 });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'product_detail.png'), fullPage: true });
  console.log('Product detail saved');

  // Contact
  console.log('Capturing Contact page...');
  await page.goto('http://localhost:5173/contacto', { waitUntil: 'networkidle2', timeout: 15000 });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'contact_page.png'), fullPage: true });
  console.log('Contact page saved');

  await browser.close();
  console.log('All screenshots captured!');
})();
