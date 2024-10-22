import { Subjects,Publisher,PaymentCreatedEvent } from "@aqibtickets/common";



export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}

