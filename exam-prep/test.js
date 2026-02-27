const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    // Pipe console
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));

    console.log("Navigating to localhost:8080");
    await page.goto('http://localhost:8080');

    // Wait for user-select-screen
    await page.waitForSelector('.user-select-screen');
    console.log("User select screen loaded");

    // Create new user
    await page.click('.user-card-new');
    console.log("Clicked new user card");
    await page.waitForSelector('#new-user-name');
    await page.type('#new-user-name', 'TestUser');
    await page.click('button.btn-primary[onclick="submitCreateUser()"]');
    console.log("Submitted new user");

    // Wait for dashboard
    await page.waitForSelector('.sidebar-user-avatar');
    console.log("Dashboard loaded");

    // Click switch user button
    console.log("Clicking switch user button...");
    await page.click('button[title="切换用户"]');
    console.log("Clicked switch user");

    // Wait a bit to see what happens
    await new Promise(r => setTimeout(r, 1000));

    const bodyHtml = await page.evaluate(() => document.body.innerHTML);
    const userSelect = await page.$('.user-select-screen');

    console.log("Has user-select-screen?", !!userSelect);
    if (userSelect) {
        const display = await page.evaluate(el => window.getComputedStyle(el).display, userSelect);
        console.log("user-select-screen display:", display);
    } else {
        console.log("Body HTML length:", bodyHtml.length);
    }

    await browser.close();
})();
