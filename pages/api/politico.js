import { Cheerio } from "cheerio"
import { Puppeteer } from "puppeteer"

export default async (req, res) => { 

    if (req.method === 'POST') {
    const dataSelector = ".embed-table-cell"
    const url = 'https://www.politico.com/news/2022/06/24/abortion-laws-by-state-roe-v-wade-00037695';


  try {
    const browser = await Puppeteer.launch()
    const page = await browser.newPage()
    await page.setRequestInterception(true)
    page.on("request", (request) => {
      if (request.resourceType() === "document") {
        console.log('got here')
        request.continue()
      } else {
        
        request.abort()
      }
    })

    await page.goto(url, { timeout: 0 }).then(async (response) => {})
    const html = await page.evaluate(() => {
         console.log(html)
      return document.querySelector("body").innerHTML
     
    })

  
    const $ = Cheerio.load(html)

    // create empty result set, assume selectors will return same number of results
    let result = []
    for (let i = 0; i < $(dataSelector).length; i++) {
      result.push({})
    }


  

    // fill result set by parsing the html for each property selector
    $(dataSelector).each((i, elem) => {
        result[i].data = $(elem).text()
      })

    await browser.close()
    res.status(200).json({ statusCode: 200, result })
  } catch(error) {
    return res.status(500).send(error.message)
  }
}
}