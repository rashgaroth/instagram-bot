const { IgApiClient } = require("instagram-private-api");
const config = require("./config");

const main = async () => {
  try {
    const ig = new IgApiClient()
    for await (let acc of config.creds) {
      ig.state.generateDevice(acc.username)
      const account = await ig.account.login(acc.username, acc.password)
      console.log(`[info]: account`, account)
      const challenge = ig.state.challenge
      console.log(`[info]: challenge`, challenge)
    }
  } catch (error) {
    console.error(error)
    throw new Error(error)
  }
}

main().catch(console.error)