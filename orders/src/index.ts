import mongoose from "mongoose"
import { app } from "./app"
import { natsWrapper } from "./nats-wrapper"
import { TicketCreatedListener } from "./events/listners/ticket-created-listner"
import { TicketUpdatedListener } from "./events/listners/ticket-updated-listner"

const start = async () => {
  try {
    await natsWrapper.connect(process.env.NATS_CLUSTER_ID!!, process.env.NATS_CLIENT_ID!!, process.env.NATS_URL!!)
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed')
      process.exit()
    })
    process.on('SIGINT', () => natsWrapper.client.close())
    process.on('SIGTERM', () => natsWrapper.client.close())

    new TicketCreatedListener(natsWrapper.client).listen()
    new TicketUpdatedListener(natsWrapper.client).listen()



    await mongoose.connect(process.env.MONGO_URI!!)
    console.log('[Orders]---> Connected to MongoDB')
    // console log the @aqibtickets/common package version
    console.log('[Orders]---> @aqibtickets/common version:', require('@aqibtickets/common/package.json').version)
  } catch (err) {
    console.error(err)
  }


  app.listen(3000, () => {
    console.log('[Orders]---> Listening on port 3000')
  })

}



start();
