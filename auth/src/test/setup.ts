import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';

import { app } from '../app';

let mongo:MongoMemoryServer;
beforeAll(async () => {
    mongo=await MongoMemoryServer.create();
    const mongoUri= mongo.getUri();
    await mongoose.connect(mongoUri);
})

declare global {
    var signin:()=>Promise<string[]|undefined>;
}


beforeEach(async () => {

process.env.JWT_SECRET='asdf';

    const collections=await mongoose.connection.db.collections();
    for(let collection of collections){
        await collection.deleteMany({});
    }
})


afterAll(async () => {  
    mongo.stop();
    await mongoose.connection.close();
})




global.signin=async()=> {
    const email='test@test.com'
    const password="password" 


    const response=await request(app)
        .post('/api/users/signup')
        .send({
            email,
            password
        })
        .expect(201);

      
    const cookie=response.get('Set-Cookie');
    return cookie;
}