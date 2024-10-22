import mongoose from "mongoose";
import { Order } from "../../../models/order";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListner } from "../order-cancelled-listner";
import { OrderCancelledEvent, OrderStatus } from "@aqibtickets/common";

const setup=async()=>{
    const listner=new OrderCancelledListner(natsWrapper.client);
    const order=Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        price: 10,
        userId: "asd",
        version: 0
    });
    await order.save();
    const data: OrderCancelledEvent['data']={
        id: order.id,
        version: 1,
        ticket:{
            id: "asd"
        }
    }

    //@ts-ignore
    const msg: Message={
        ack: jest.fn()
    }
    return {listner, order, data, msg};
}

it('updates the status of the order', async()=>{
    const {listner, order, data, msg}=await setup();

    await listner.onMessage(data, msg);
    const updatedOrder=await Order.findById(order.id);
    
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
})


it('acks the message', async()=>{
    const {listner, order, data, msg}=await setup();
    await listner.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
})




