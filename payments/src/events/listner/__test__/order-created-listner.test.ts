import mongoose from "mongoose"
import { Order } from "../../../models/order"
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCreatedListner } from "../order-created-listner"
import { OrderCreatedEvent, OrderStatus, Subjects } from "@aqibtickets/common"
import { Message } from "node-nats-streaming"
const setup=async()=>{
    const listner=new OrderCreatedListner(natsWrapper.client);
    const data: OrderCreatedEvent['data']={
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: new mongoose.Types.ObjectId().toHexString() ,
        expiresAt: '123',
        ticket:{
            id: new mongoose.Types.ObjectId().toHexString(),
            price: 10
        }
    }

    //@ts-ignore
    const msg: Message={
        ack: jest.fn()
    }

    return {listner, data, msg};
}


it('replicates the order info', async()=>{
    const {listner, data, msg}=await setup();
    await listner.onMessage(data, msg);
    const order=await Order.findById(data.id);
    expect(order!.price).toEqual(data.ticket.price);
})


it('acks the message', async()=>{
    const {listner, data, msg}=await setup();
    await listner.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
})