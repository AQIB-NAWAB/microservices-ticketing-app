import { Listener,OrderCancelledEvent,Subjects } from "@aqibtickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";
import { natsWrapper } from "../../nats-wrapper";


export class OrderCancelledListner extends Listener<OrderCancelledEvent>{
    subject: Subjects.OrderCancelled= Subjects.OrderCancelled;
    queueGroupName=queueGroupName;

    async onMessage(data: OrderCancelledEvent["data"], msg: Message) {

        const ticket = await Ticket.findById(data.ticket.id);

        if(!ticket){
            throw new Error('Ticket not found');
        }

        ticket.set({orderId:undefined});

        await ticket.save();

        await new TicketUpdatedPublisher(natsWrapper.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            orderId: ticket.orderId,
            version: ticket.version
        });

        msg.ack();


    }

}