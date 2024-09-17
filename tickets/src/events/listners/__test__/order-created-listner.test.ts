import { OrderCreatedListner } from "../order-created-listner";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";
import { OrderCreatedEvent, OrderStatus } from "@aqibtickets/common";
import mongoose from "mongoose";
import {Message} from  "node-nats-streaming"

const setup=async()=>{

    const listner=new OrderCreatedListner(natsWrapper.client);

    const ticket=Ticket.build({
        title:"concert",
        price:99,
        userId:"asd"
    })

    await ticket.save();

    const data:OrderCreatedEvent['data']={
        id:new mongoose.Types.ObjectId().toHexString(),
        version:0,
        status:OrderStatus.Created,
        userId:"asd",
        expiresAt:"123",
        ticket:{
            id:ticket.id,
            price:ticket.price
        }
    }

    // @ts-ignore
    const msg:Message={
        ack:jest.fn()
    }


    return {listner,ticket,msg,data}

}


it('sets userid of the ticket ',async()=>{
    const {listner,ticket,data,msg}=await setup();

    await listner.onMessage(data,msg);

    const updatedTicket=await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).toEqual(data.id);
})

it('acks the message',async()=>{
    const {listner,ticket,data,msg}=await setup();

    await listner.onMessage(data,msg);

    expect(msg.ack).toHaveBeenCalled();

    const ticketUpdatedData=JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);

    expect(data.id).toEqual(ticketUpdatedData.orderId);
})

