
import { Publisher, TicketCreatedEvent } from "@aqibtickets/common";
import { Subjects } from "@aqibtickets/common";

class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
}


export default TicketCreatedPublisher;




