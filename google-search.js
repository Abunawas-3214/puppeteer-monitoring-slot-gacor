import puppeteer from "puppeteer";

const scrapGoogleSearch = async (keyword, domain) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const searchQuery = `${keyword} site:${domain}`;

    console.log(`Scraping query: ${searchQuery}`);

    await page.goto(`https://www.google.com/search?q=${searchQuery}`);

    let links = []
    let pageNavigation = 1
    try {
        await page.waitForSelector("#search")
        links = await page.evaluate((domain) => {
            const links = document.querySelectorAll(".yuRUbf a");
            const links_array = Array.from(links);
            return links_array.map(link => ({
                url: link.href,
                title: link.textContent.trim().split(domain)[0],
            }));
        }, domain);

        try {
            await page.waitForSelector('tbody', { visible: true });

            const tbody = await page.$('tbody');

            if (tbody) {
                const tdCount = await tbody.evaluate(tbody => tbody.querySelectorAll('td').length);
                pageNavigation = tdCount - 2
            } else {
                console.error('tbody element not found');
            }
        } catch (error) {
            console.error('It seems that there is no pagination for this result');
        }
    } catch (error) {
        console.error("An error occurred while scraping:", error);
    }

    const result = {
        meta: {
            pageCount: links.length,
            navigation: pageNavigation
        },
        data: links
    }

    // console.log(result);
    await browser.close();
    return result;
}

export default scrapGoogleSearch;