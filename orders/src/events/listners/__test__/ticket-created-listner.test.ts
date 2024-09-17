import { TicketCreatedEvent } from "@aqibtickets/common";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedListener } from "../ticket-created-listner";
import {Message} from 'node-nats-streaming';
import mongoose from "mongoose";

const setup=async()=>{
    const listner = new TicketCreatedListener(natsWrapper.client);

    const data: TicketCreatedEvent["data"] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        title: "concert",
        price: 10,
        userId: new mongoose.Types.ObjectId().toHexString(),
    };

    //@ts-ignore

    const msg: Message = {
        ack: jest.fn(),
    };

    return {listner, data, msg};
    

}






it("creates and saves a ticket ", async () => {
    const {listner, data, msg} = await setup();

    await listner.onMessage(data, msg);


    const ticket = await Ticket.findById(data.id);

    expect(ticket).toBeDefined();
    expect(ticket!.title).toEqual(data.title);
    expect(ticket!.price).toEqual(data.price);
    
});

it("acks the message", async () => {
  // call onMessage function with the data object + message object
  const { listner, data, msg } = await setup();

    await listner.onMessage(data, msg);

  // write assertions to make sure ack function is called

    expect(msg.ack).toHaveBeenCalled();
});
