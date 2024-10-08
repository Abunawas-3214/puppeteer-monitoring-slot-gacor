import scrapGoogleSearch from "./google-search.js";
import pageCheck from "./page-check.js";

const keyword = 'gacor'
const domain = 'uin-malang.ac.id'
const searchResult = await scrapGoogleSearch(keyword, domain)
const processData = async (searchResult, pageCheck) => {
    var pageValidCount = 0

    if (searchResult.data && searchResult.data.length > 0) {
        console.log(`Validating ${searchResult.data.length} links`)
        for (const item of searchResult.data) {
            const valid = await pageCheck(item.url, keyword)
            item.isValid = valid
            if (valid) {
                pageValidCount++
            }
        }
    }
    searchResult.meta.pageValidCount = pageValidCount

    return searchResult
}

const newData = await processData(searchResult, pageCheck)

console.log(newData)