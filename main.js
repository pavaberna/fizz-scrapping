import puppeteer from 'puppeteer';
import fs from 'fs';

async function scrapeFizz() {
    const fizzData = fs.readFileSync('fizz_links.txt', 'utf8');
    const urls = fizzData.split('\n').filter(Boolean); 

    const browser = await puppeteer.launch({ headless: false });
    
    const results = []; 

    for (let i = 0; i < urls.length; i += 5) {
        const urlBatch = urls.slice(i, i + 5);
        const pagePromises = urlBatch.map(async (url) => {
            const page = await browser.newPage();
            try {
                await page.goto(url);
                await new Promise(resolve => setTimeout(resolve, 2000));

                const nev = await page.evaluate(() => {
                    const titleNodes = document.querySelector('#__next > div.flex.min-h-screen.w-screen.flex-col > main > div > div.flex.gap-4.md\\:gap-8 > div.flex.flex-1.flex-col.gap-4.md\\:gap-8 > section > div.flex.flex-col.justify-center.gap-2 > h5');
                    return titleNodes ? titleNodes.textContent : 'N/A'; 
                });

                const ar = await page.evaluate(() => {
                    const priceNode = document.querySelector('#__next > div.flex.min-h-screen.w-screen.flex-col > main > div > div.flex.gap-4.md\\:gap-8 > div.flex.flex-1.flex-col.gap-4.md\\:gap-8 > section > div.flex.flex-col.justify-center.gap-4.order-1.mt-0.md\\:order-2.md\\:mt-2 > div > p');
                    return priceNode ? priceNode.textContent : 'N/A'; 
                });

                const elado = await page.evaluate(() => {
                    const merchantNode = document.querySelector('#__next > div.flex.min-h-screen.w-screen.flex-col > main > div > div.flex.gap-4.md\\:gap-8 > div.flex.flex-1.flex-col.gap-4.md\\:gap-8 > section > div.flex.flex-col.justify-center.gap-4.order-4.mt-0.md\\:order-5.md\\:mt-2 > a > div > span');
                    return merchantNode.textContent;
                });

                results.push({ name: nev, price: ar, merchant: elado });

            } catch (error) {
                console.error(`Error scraping ${url}:`, error);
            } finally {
                await page.close(); 
            }
        });

        await Promise.all(pagePromises); 
    }

    await browser.close();

    fs.writeFileSync('data.json', JSON.stringify(results, null, 2));
}

scrapeFizz();
