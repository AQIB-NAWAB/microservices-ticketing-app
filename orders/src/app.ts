import express from 'express'
import "express-async-errors"
import { json } from 'body-parser'
import mongoose from 'mongoose'
import cookieSession from 'cookie-session'

import { currentUser, errorHandler, NotFoundError } from '@aqibtickets/common'
import { newOrderRoutes } from './routes/new'
import { showOrderRouter } from './routes/show'
import { indexOrderRouter } from './routes/index'
import { deleteOrderRouter } from './routes/delete'






// Error handler
const app = express()

app.set('trust proxy', true)

app.use(json())
app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test'
}))

app.use(currentUser)


app.use(newOrderRoutes)
app.use(showOrderRouter)
app.use(indexOrderRouter)
app.use(deleteOrderRouter)


app.all("*",()=>{
  throw new NotFoundError()
})

app.use(errorHandler)



export {app}