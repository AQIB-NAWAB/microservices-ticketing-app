import mongoose from "mongoose"
import { app } from "./app"



const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!!)
    console.log('[AUTH]---> Connected to MongoDB')
    // console log the @aqibtickets/common package version
    console.log('[AUTH]---> @aqibtickets/common version: ', require('@aqibtickets/common/package.json').version)
  } catch (err) {
    console.error(err)
  }


  app.listen(3000, () => {
    console.log('[AUTH]---> Listening on port 3000')
  })

}



start();

