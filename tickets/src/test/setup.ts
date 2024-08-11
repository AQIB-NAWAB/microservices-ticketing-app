import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import jwt from 'jsonwebtoken';

import { app } from '../app';

let mongo:MongoMemoryServer;
beforeAll(async () => {
    mongo=await MongoMemoryServer.create();
    const mongoUri= mongo.getUri();
    await mongoose.connect(mongoUri);
})

jest.mock('../nats-wrapper');


declare global {
    var signin: () => string[];
  }


beforeEach(async () => {
    jest.clearAllMocks();

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




global.signin= ()=> {
   
    const payload={
        id:new mongoose.Types.ObjectId().toHexString(),
        email:'test@test.com'
    }

    const token=jwt.sign(payload,process.env.JWT_SECRET!);


    const session={jwt:token};

    const sessionJson=JSON.stringify(session);



    const base64=Buffer.from(sessionJson).toString('base64');


    return [`session=${base64}`];
}