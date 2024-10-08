import puppeteer from "puppeteer";

async function extractTextContent(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    page.setDefaultTimeout(0);
    await page.goto(url);

    const textContent = await page.evaluate(() => {
        return document.body.textContent.trim();
    });

    await browser.close();

    return textContent;
}


const contentCheck = async (textContent, keyword) => {
    if (textContent) {
        const keywords = Array.isArray(keyword) ? keyword : [keyword]
        return keywords.some(word => textContent.toLowerCase().includes(word.toLowerCase()))
    }
    const errorText = ['404', 'not found', '403', 'forbidden', '503']
    if (errorText.some(word => textContent.toLowerCase().includes(word.toLowerCase()))) {
        return false
    }
    return false
}

const pageCheck = async (url, keyword) => {
    console.log(`Checking: ${url}`)
    const textContent = await extractTextContent(url)
    return contentCheck(textContent, keyword)
}

// const textContent = await extractTextContent('https://humaniora.uin-malang.ac.id/index.php?option=com_content&view=article&id=5751:tahiyyah-2023-prodi-bsa-ajak-mahasiswa-baru-pahami-keunggulan-studi&catid=73&Itemid=842')
// contentCheck(textContent, ['slot', 'gacor']).then(result => {
//     console.log(textContent)
//     console.log(result)
// })

export default pageCheck