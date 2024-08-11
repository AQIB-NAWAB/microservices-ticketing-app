
import { Subjects, TicketCreatedEvent } from "@aqibtickets/common";
import Listener from "@aqibtickets/common/build/events/base-listener";
import { Message } from "node-nats-streaming";



class TicketCreatedListener extends Listener< TicketCreatedEvent> {
   readonly subject : Subjects.TicketCreated =Subjects.TicketCreated;
    queueGroupName = "payments-service";

    onMessage(data: TicketCreatedEvent["data"], msg: Message){
        console.log("Event data!", data); 
        msg.ack();

    }

}


export default TicketCreatedListener;