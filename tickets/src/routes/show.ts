
import express from 'express';
import { Ticket } from '../models/ticket';
import { NotFoundError } from '@aqibtickets/common';

const router = express.Router();



router.get('/api/tickets/:id', async(req, res) => {
    const {id}=req.params;

    const ticket=await Ticket.findById(id);

    if(!ticket){
      throw new NotFoundError();
    }

    res.send(ticket);
});


export {router as showTicketRouter};