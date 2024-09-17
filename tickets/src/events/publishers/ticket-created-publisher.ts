import {Publisher, Subjects, TicketCreatedEvent} from '@aqibtickets/common';
import {natsWrapper} from '../../nats-wrapper';
import { TicketUpdatedPublisher } from './ticket-updated-publisher';
export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}