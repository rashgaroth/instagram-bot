const fs = require('fs/promises')
const c2j = require('csvtojson/v2')
const path = require('path')

const basePath = path.resolve(__dirname, 'datasets', 'csv')
const baseJsonPath = path.resolve(__dirname, 'datasets', 'json')

const main = async () => {
  try {
    const ls = await fs.readdir(basePath)
    for await (let l of ls) {
      console.log(`${basePath}${l}`)
      c2j()
        .fromFile(`${basePath}/${l}`)
        .then(async (json) => {
          if (Array.isArray(json)) {
            const newArr = []
            for (let i in json) {
              let obj = {}
              obj.username = json[i].Username
              obj.text = `GM! You're Invited!\n \nCome join our WEB3 Discord community and connect by individuals and groups with similar interested in web3 technology. Share information, network, and explore the exciting possibilities of web3 technology. Gather together with massive communities in the web3 space.\n \nJoin us now at https://discord.gg/4xKxgd8n8U`
              newArr.push(obj)
            }
            const dmsObj = {
              dms: newArr
            }
            const dmsObjString = JSON.stringify(dmsObj)
            await fs.writeFile(`${baseJsonPath}/${l.replace('.csv', '.json')}`, dmsObjString)
          }
        })
    }
  } catch (error) {
    throw new Error(error)
  }
}

main().catch(console.error)