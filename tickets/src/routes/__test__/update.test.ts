import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';



it('returns a 404 if the ticket is not found', async () => {
    const id= new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .get(`/api/tickets/${id}`)
        .send()
        .expect(404);
    }
);


it('returns the ticket if the ticket is found', async () => {
    const title = 'concert';
    const price = 20;

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({ title, price })
        .expect(201);

    
    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()
        .expect(200);

    
    expect(ticketResponse.body.title).toEqual(title);
    expect(ticketResponse.body.price).toEqual(price);
})


it('returns a 404 if the ticket is not found', async () => {
    const id= new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'concert',
            price: 20
        })
        .expect(404);
    }
);

it('returns a 401 if the user is not authenticated', async () => {
    const id= new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: 'concert',
            price: 20
        })
        .expect(401);
    }
);


it('returns a 401 if the user does not own the ticket', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({ title: 'concert', price: 20 })
        .expect(201);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', global.signin())
        .send({ title: 'concert', price: 1000 })
        .expect(401);
    }
);

it('returns a 400 if the user provides an invalid title or price', async () => {
    const cookie = global.signin();

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({ title: 'concert', price: 20 })
        .expect(201);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({ title: '', price: 20 })
        .expect(400);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({ title: 'concert', price: -10 })
        .expect(400);
    }
);



it('updates the ticket provided valid inputs', async () => {
    const cookie = global.signin();

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({ title: 'concert', price: 20 })
        .expect(201);

    const updatedTitle = 'new concert';
    const updatedPrice = 100;

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({ title: updatedTitle, price: updatedPrice })
        .expect(200);

    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()
        .expect(200);

    expect(ticketResponse.body.title).toEqual(updatedTitle);
    expect(ticketResponse.body.price).toEqual(updatedPrice);
    }
);



it('publishes an event', async () => {
    const cookie = global.signin();

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({ title: 'concert', price: 20 })
        .expect(201);

    const updatedTitle = 'new concert';
    const updatedPrice = 100;

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({ title: updatedTitle, price: updatedPrice })
        .expect(200);

    }
);


it('publishes an event', async () => {
    const cookie = global.signin();

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({ title: 'concert', price: 20 })
        .expect(201);

    const updatedTitle = 'new concert';
    const updatedPrice = 100;

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({ title: updatedTitle, price: updatedPrice })
        .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
    });