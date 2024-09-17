import mongoose from "mongoose";
import { app } from "../../app";
import  request  from "supertest";
import { Ticket } from "../../models/ticket";
import { Order } from "../../models/order";
import { OrderStatus } from "@aqibtickets/common";


const buildTicket = async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        id: new mongoose.Types.ObjectId().toHexString()
    });
    await ticket.save();
    return ticket;
};


it('fetches orders for a particular user', async () => {
    // Create three tickets

    const ticket1 = await buildTicket();

    const ticket2 = await buildTicket();

    const ticket3 = await buildTicket();


    const user1 = global.signin();

    const user2 = global.signin();

    // Create one order as User #1

    await request(app)
        .post('/api/orders')
        .set('Cookie', user1)
        .send({ ticketId: ticket1.id })
        .expect(201);


    // Create two orders as User #2

    const { body: orderOne } = await request(app)
        .post('/api/orders')
        .set('Cookie', user2)
        .send({ ticketId: ticket2.id })
        .expect(201);


    const { body: orderTwo } = await request(app)

        .post('/api/orders')
        .set('Cookie', user2)
        .send({ ticketId: ticket3.id })
        .expect(201);

    // Make request to get orders for User #2

    const response = await request(app)
        .get('/api/orders')
        .set('Cookie', user2)
        .expect(200);

    // Make sure we only got the orders for User #2

    expect(response.body.length).toEqual(2);

    expect(response.body[0].id).toEqual(orderOne.id);

    expect(response.body[1].id).toEqual(orderTwo.id);

    expect(response.body[0].ticket.id).toEqual(ticket2.id);

    expect(response.body[1].ticket.id).toEqual(ticket3.id);


});








    





