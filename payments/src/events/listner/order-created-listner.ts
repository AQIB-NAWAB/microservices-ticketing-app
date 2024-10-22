import {Listener,OrderCreatedEvent,OrderStatus,Subjects} from '@aqibtickets/common'
import {Message} from 'node-nats-streaming'
import {queueGroupName} from './queue-group-name'
import {Order} from '../../models/order'


export class OrderCreatedListner extends Listener<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message){
        const {id, version,  userId, ticket} = data;
        const order = Order.build({
            version,
            status:OrderStatus.Created,
            userId,
            price: ticket.price,
            id
        });

        await order.save();

        msg.ack();
    }
}