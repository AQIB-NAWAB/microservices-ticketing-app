import { Listener, OrderCreatedEvent, Subjects } from "@aqibtickets/common";
import queueGroupName from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListner extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated= Subjects.OrderCreated;
    queueGroupName: string=queueGroupName;

    async onMessage(data:OrderCreatedEvent['data'],msg:Message){
        // put a delay for 30s

        const delay=new Date(data.expiresAt).getTime()-new Date().getTime();


        await expirationQueue.add({orderId:data.id},{
            delay:60000
        });

        msg.ack();
    }

}


