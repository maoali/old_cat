const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.goto('http://localhost:8080');
  await page.waitForSelector('.user-select-screen');
  await page.click('.user-card-new');
  await page.waitForSelector('#new-user-name');
  await page.type('#new-user-name', 'TestUser');
  await page.click('button.btn-primary[onclick="submitCreateUser()"]');
  await page.waitForSelector('.sidebar-user-avatar');
  await page.click('button[title="切换用户"]');
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'screenshot.png' });
  await browser.close();
})();
