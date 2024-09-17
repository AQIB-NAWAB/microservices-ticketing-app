import mongoose from "mongoose";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedListener } from "../ticket-updated-listner";
import { Ticket } from "../../../models/ticket";
import { TicketUpdatedEvent } from "@aqibtickets/common";
import { Message } from "node-nats-streaming";

const setup = async () => {
  // Create an instance of the listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  // Create and save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();


  // Create a fake data object
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id, // Use the same ID as the created ticket
    version: ticket.version + 1, // Next version (Mongo versioning)
    title: 'new concert',
    price: 999,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // Create a fake msg object
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, ticket, msg };
};

it('finds, updates, and saves a ticket', async () => {
  const { listener, data, msg, ticket } = await setup();

  // Call the onMessage function with the data and message
  await listener.onMessage(data, msg);

  console.log('data', data);

  // Assertions to make sure the ticket was updated
  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket).toBeDefined();
  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  // Call the onMessage function with the data and message
  await listener.onMessage(data, msg);

  // Ensure ack was called
  expect(msg.ack).toHaveBeenCalled();
});


it("does not call ack if the event has been skipped", async () => {
  const { listener, data, msg } = await setup();

  // Set the version to a future version
  data.version = 10;

  try {
    await listener.onMessage(data, msg);
  } catch (err) {
    // Ensure ack was not called
    expect(msg.ack).not.toHaveBeenCalled();
  }
})