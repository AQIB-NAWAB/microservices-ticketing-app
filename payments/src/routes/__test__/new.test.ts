import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { OrderStatus } from "@aqibtickets/common";
import { Order } from "../../models/order";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payment";

jest.mock("../../stripe");

it("returns a 400  when purchasing a cancelled order", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    status: OrderStatus.Cancelled,
    version: 0,
    price: 10,
  });
  await order.save();
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(userId))
    .send({
      token: "tok_visa",
      orderId: order.id,
    })
    .expect(400);
});

it("returns a 201 with valid inputs", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    status: OrderStatus.Created,
    version: 0,
    price: 10,
  });
  await order.save();
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(userId))
    .send({
      token: "tok_visa",
      orderId: order.id,
    })
    .expect(201);

    const payments = await Payment.find({
        orderId: order.id
    });

    expect(payments).toHaveLength(1);
    expect(payments[0].stripeId).toBeDefined();

});

it("returns 204 with valid inputs", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    status: OrderStatus.Created,
    version: 0,
    price: 10,
  });
  await order.save();
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(userId))
    .send({
      token: "tok_visa",
      orderId: order.id,
    })
    .expect(201);

  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  expect(chargeOptions.source).toEqual("tok_visa");
  expect(chargeOptions.amount).toEqual(10 * 100);
  expect(chargeOptions.currency).toEqual("usd");
});
