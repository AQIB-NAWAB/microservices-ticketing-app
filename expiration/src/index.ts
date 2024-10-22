import { natsWrapper } from "./nats-wrapper"
import { OrderCreatedListner } from "./events/listners/order-created-listner"

const start = async () => {
  try {
    await natsWrapper.connect(process.env.NATS_CLUSTER_ID!!, process.env.NATS_CLIENT_ID!!, process.env.NATS_URL!!)
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed')
      process.exit()
    })
    process.on('SIGINT', () => natsWrapper.client.close())
    process.on('SIGTERM', () => natsWrapper.client.close())

    new OrderCreatedListner(natsWrapper.client).listen();

  } catch (err) {
    console.error(err)
  }



}



start();
