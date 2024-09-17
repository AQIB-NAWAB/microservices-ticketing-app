import mongoose from "mongoose";
import { app } from "../../app";
import  request  from "supertest";
import { Ticket } from "../../models/ticket";
import { Order } from "../../models/order";
import { OrderStatus } from "@aqibtickets/common";


it('fetches a particular order', async () => {
    // Create a ticket

    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        id: new mongoose.Types.ObjectId().toHexString()
    
    });

    await ticket.save();

    // Create an order

    const user = global.signin();

    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);


    // Make request to fetch the order

    const { body: fetchedOrder } = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(200);


    expect(fetchedOrder.id).toEqual(order.id);


})





it('returns an error if one user tries to fetch another users order', async () => {
    // Create a ticket

    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        id: new mongoose.Types.ObjectId().toHexString()
    });

    await ticket.save();

    // Create an order

    const user = global.signin();

    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);
    
    // Make request to fetch the order


    await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', global.signin())
        .send()
        .expect(400);

})