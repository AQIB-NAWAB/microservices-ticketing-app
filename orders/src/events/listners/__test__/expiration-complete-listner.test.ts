import { natsWrapper } from "../../../nats-wrapper";
import { ExpirationCompleteListener } from "../expiration-complete-listner";
import { Order } from "../../../models/order";
import { Ticket } from "../../../models/ticket";
import mongoose from "mongoose";
import { OrderStatus, ExpirationCompleteEvent } from "@aqibtickets/common";
import { Message } from "node-nats-streaming";

const setup=async()=>{
    const listner=new ExpirationCompleteListener(natsWrapper.client);

    const ticket=Ticket.build({
        id:new mongoose.Types.ObjectId().toHexString(),
        title:'concert',
        price:20
    });

    await ticket.save();


    const order=Order.build({
        userId:'asdasd',
        expiresAt:new Date(),
        ticket,
        status:OrderStatus.Created
    });

    await order.save();

    const data:ExpirationCompleteEvent['data']={
        orderId:order.id
    };


    //@ts-ignore
    const msg:Message={
        ack:jest.fn()
    };

    return {listner,order,ticket,data,msg};

}


it('updates the order status to cancelled',async()=>{
    const {listner,order,ticket,data,msg}=await setup();

    await listner.onMessage(data,msg);

    const updatedOrder=await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});


it('emit an OrderCancelled event',async()=>{
    const {listner,order,ticket,data,msg}=await setup();

    await listner.onMessage(data,msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});






it('ack the message',async()=>{
    const {listner,order,ticket,data,msg}=await setup();

    await listner.onMessage(data,msg);

    expect(msg.ack).toHaveBeenCalled();
});
