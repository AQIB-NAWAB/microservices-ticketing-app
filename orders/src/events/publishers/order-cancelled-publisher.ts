import { Publisher, OrderCancelledEvent , Subjects } from "@aqibtickets/common";


export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}