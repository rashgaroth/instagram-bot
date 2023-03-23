const conf = require('./config')
const p = require('puppeteer')
const { sleep } = require('../../utils')

const getInputByName = (name) => `input[name=${name}]`
const getSelectorByClass = (cname) => `[class="${cname}"]`

const main = async () => {
  try {
    console.log('preparing ...')
    const browser = await p.launch({ 
      headless: false, 
      timeout: 20000000, 
      args: [
        '--disable-web-security',
        '--disable-features=IsolateOrigins',
        '--disable-site-isolation-trials',
      ],
      // devtools: true
    })
    const page = await browser.newPage()

    const igUrl = 'https://www.instagram.com/'
    const accs = conf.creds
    for await (let acc of accs) {
      await page.goto(igUrl, { waitUntil: 'networkidle2' })
      await page.setViewport({width: 1080, height: 1024})
      
      await sleep(500)

      // login process
      await page.waitForSelector(getInputByName('username'))
      await page.waitForSelector(getInputByName('password'))
  
      await page.type(getInputByName('username'), acc.username)
      await page.type(getInputByName('password'), acc.password)
      
      await page.click('[type="submit"]')
      
      await page.waitForNavigation({
        waitUntil: 'networkidle2',
      })

      for await (let dm of acc.dms) {
        await page.goto(`${igUrl}direct/new/`)

        await page.$$eval('button', anchors => {
          anchors.map((v) => {
            if (v.textContent === 'Not Now') {
              v.click()
              return
            }
          })
        })

        await page.waitForSelector(getSelectorByClass(`_abm0`))
        
        await page.type(getInputByName('queryBox'), dm.username)

        await page.waitForSelector(getSelectorByClass(conf.selectors.firstPerson))
        await page.click(getSelectorByClass(conf.selectors.firstPerson))
        await page.click(getSelectorByClass(conf.selectors.nextBtn))

        // await sleep(2000)

        await page.waitForSelector(getSelectorByClass(conf.selectors.chatInput))
        await page.type(getSelectorByClass(conf.selectors.chatInput), dm.text)
        await page.waitForSelector(getSelectorByClass(conf.selectors.btnSend))
        await page.click(getSelectorByClass(conf.selectors.btnSend)) 
      }

      await sleep(500)
      console.log('done ...')
      await browser.close()
    }
  } catch (error) {
    throw new Error(error)
  }
}

module.exports = main