import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { BadRequestError, OrderStatus, requireAuth, validateRequest } from '@aqibtickets/common';
import { Order } from '../models/order';
import { stripe } from '../stripe';
import { Payment } from '../models/payment';
import { PaymentCreatedPublisher } from '../events/publisher/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router= express.Router();



router.post('/api/payments', requireAuth, 
[
    body('token').not().isEmpty(),
    body('orderId').not().isEmpty()
],
validateRequest,
async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
        throw new Error('Order not found');
    }

    if(order.userId!= req.currentUser!.id){
        throw new Error('Not authorized');
    }


    if(order.status===OrderStatus.Cancelled){
        throw new BadRequestError('Cannot pay for an cancelled order');
    }

    const response= await stripe.charges.create({
        currency: 'usd',
        amount: order.price * 100,
        source: token
    });




    const payment= Payment.build({
        orderId,
        stripeId: response.id || Math.random().toString()
    });

    await payment.save();

    new PaymentCreatedPublisher(natsWrapper.client).publish({
        id:payment.id,
        orderId:payment.orderId,
        stripeId:payment.stripeId
    });


    res.status(201).send({id:payment.id});
});


export { router as createChargeRouter };

