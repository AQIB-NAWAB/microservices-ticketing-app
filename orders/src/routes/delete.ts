import express, {Request,Response} from 'express';

const router = express.Router();
import { OrderStatus, requireAuth } from '@aqibtickets/common';
import { Order } from '../models/order';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';


router.delete('/api/orders/:orderId',async (req: Request, res: Response) =>
{

    const order = await Order.findById(req.params.orderId);
    if(!order){
        throw new Error('Order not found');
    }
    if(order.userId !== req.currentUser!.id){
        throw new Error('Not authorized');
    }
    order.status = OrderStatus.Cancelled;
    await order.save();

    new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        ticket:{
            id: order.ticket.id
        }
    });

    


    res.status(204).send(order);

});











export {router as deleteOrderRouter}