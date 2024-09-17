import { Publisher, OrderCreatedEvent , Subjects } from "@aqibtickets/common";


export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}