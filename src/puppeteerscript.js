import puppeteer from 'puppeteer';
import fs from 'fs';


async function getTitleValue(page) {
    await page.waitForSelector('span[title]', { visible: true });
    const titleValue = await page.$eval(
        'span[title]',
        (element) => element.getAttribute('title')
    );
    return titleValue;
}

async function run() {
    const browser = await puppeteer.launch({
        headless: false,
    });

    const page = await browser.newPage();

    await page.goto('https://www.instagram.com');
    await page.waitForSelector('.x19onx9a > div > button', { timeout: 3000 });

    await page.click('.x19onx9a > div > button');

    await page.type("[name=username]", "dende545", { delay: 200 });
    await page.type("[name=password]", "Adsayan95", { delay: 200 });
    await page.click('button[type=submit]');

    await page.waitForSelector('div[role]', { visible: true });
    await page.click('div[role]');
    await page.goto('https://www.instagram.com/shakira/');

    const titleValue = await getTitleValue(page);
    console.log('Valeur du titre:', titleValue);

    // Sauvegarder la valeur du titre dans un fichier
    fs.writeFileSync('src/titleValue.txt', titleValue);

    // Rafraîchir la page toutes les minutes
    setInterval(async () => {
        if (page.isClosed()) {
            console.error('Page is closed');
            return;
        }
        try {
            await page.reload();
            await page.waitForSelector('span[title]', { visible: true });
            const newTitleValue = await getTitleValue(page);
            console.log('Nouvelle valeur du titre:', newTitleValue);
            fs.writeFileSync('src/titleValue.txt', newTitleValue);
        } catch (error) {
            console.error('Error reloading page:', error);
        }
    }, 10000); // 08 secondes
}

run();
