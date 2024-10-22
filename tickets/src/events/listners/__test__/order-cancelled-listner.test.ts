import { natsWrapper } from "../../../nats-wrapper"
import { OrderCancelledEvent } from "@aqibtickets/common"
import { OrderCancelledListner } from "../order-cancelled-listner"
import { Ticket } from "../../../models/ticket"
import { Message } from "node-nats-streaming"
import mongoose from "mongoose"

const setup = async () => {
    const listner = new OrderCancelledListner(natsWrapper.client);

    const orderId = new mongoose.Types.ObjectId().toHexString();

    const ticket = Ticket.build({
        title: 'concert',
        price: 99,
        userId: 'asd'
    })

    ticket.set({ orderId });

    await ticket.save();

    const data: OrderCancelledEvent['data'] = {
       id:orderId,
       version:0,
       ticket:{
        id:ticket.id
       }
    }

    // @ts-ignore
    const msg:Message ={
        ack:jest.fn()
    }

    return {listner,ticket,orderId,data,msg}

}


it('updates the ticket, publish the event, and acks the message ',async()=>{
    const {msg , data , ticket  ,orderId , listner }=await setup();

    await listner.onMessage(data,msg);

    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket!.orderId).not.toBeDefined();
    expect(msg.ack).toHaveBeenCalled();
    expect(natsWrapper.client.publish).toHaveBeenCalled();

})


    