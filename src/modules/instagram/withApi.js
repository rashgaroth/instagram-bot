require("dotenv").config();
const { IgApiClient } = require("instagram-private-api");
const config = require("./config");

const main = async () => {
  try {
    const ig = new IgApiClient()
    for await (let acc of config.creds) {
      ig.state.generateDevice(acc.username)
      console.log(`[info]: login instagram using ${acc.username}`)
      await ig.account.login(acc.username, acc.password)
      for await (let dm of acc.dms) {
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
    console.log('[info]: successfully!')
    process.exit(0)
  } catch (error) {
    throw new Error(error)
  }
}

main().catch(console.error)