import express, {Request,Response} from 'express';
import { currentUser, requireAuth } from '@aqibtickets/common';
const router = express.Router();
import { Order } from '../models/order';


// get specific order

router.get('/api/orders/:orderId',
    requireAuth,
    async (req: Request, res: Response) =>
{
    const order = await Order.findById(req.params.orderId).populate('ticket');
    if(!order){
        throw new Error('Order not found');
    }

    if(order.userId !== req.currentUser!.id){
        throw new Error('Not authorized');
    }

    res.send(order);
});














export {router as showOrderRouter}