require("dotenv").config();
const { IgApiClient } = require("instagram-private-api");
const config = require("./config");
const fs = require('fs/promises');
const path = require("path");

const baseJsonPath = path.resolve(__dirname, 'datasets', 'json')

const main = async () => {
  try {
    const ig = new IgApiClient()
    for await (let acc of config.creds) {
      const jsonDir = await fs.readdir(`${baseJsonPath}`)
      if (jsonDir.length > 0) {
        for (let i in jsonDir) {
          const jsonFile = await fs.readFile(`${baseJsonPath}/${jsonDir[i]}`, 'utf8')
          const parsedJson = JSON.parse(jsonFile)
          ig.state.generateDevice(acc.username)
          console.log(`[info]: login instagram using ${acc.username}`)
          await ig.account.login(acc.username, acc.password)
          for await (let dm of parsedJson.dms) {
            const userId = await ig.user.getIdByUsername(dm.username)
            if (userId) {
              const thread = ig.entity.directThread([userId.toString()])
              await thread.broadcastText(dm.text)
              console.log(`[info]: Sending message to: ${dm.username}`)
            } else {
              console.warn('[warn]: User not found')
            }
          }
        }
      } else {
        throw new Error(`Please generate your JSON first!`)
      }
    }
    console.log('[info]: successfully!')
    process.exit(0)
  } catch (error) {
    console.error(error)
    throw new Error(error)
  }
}

main().catch(console.error)