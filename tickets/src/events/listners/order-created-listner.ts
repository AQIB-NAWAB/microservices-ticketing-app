import { Listener, OrderCreatedEvent, Subjects } from "@aqibtickets/common";
import { queueGroupName } from "./queue-group-name";
import {Message} from 'node-nats-streaming';
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";
import { natsWrapper } from "../../nats-wrapper";

export class OrderCreatedListner extends Listener<OrderCreatedEvent>{
    subject: Subjects.OrderCreated= Subjects.OrderCreated;
    queueGroupName = queueGroupName;

   async onMessage(data: any, msg: Message) {
        // find the ticket that the order is reserving
        const ticket = await Ticket.findById(data.ticket.id);

        // if no ticket, throw error
        if(!ticket){
            throw new Error('Ticket not found');
        }


        // mark the ticket as being reserved by setting its orderId property

        ticket.set({orderId: data.id});

        // save the ticket
        await ticket.save();

        // publish the ticket updated event
        await new TicketUpdatedPublisher(natsWrapper.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            orderId: ticket.orderId,
            version: ticket.version
        });




        // ack the message
        msg.ack();


    }
}

