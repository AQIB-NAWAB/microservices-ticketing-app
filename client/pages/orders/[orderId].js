import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../../hooks/use-request";

const OrderShow = ({ order }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const {doRequest, errors} = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
        orderId: order.id,
    },
    onSuccess: () => Router.push("/orders")
    });




  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };
    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);
    return () => {
      clearInterval(timerId);
    };
  }, []);

  return (
    <>
      {timeLeft > 0 ? (
        <>
          <h1>Time left to pay: {timeLeft} seconds</h1>
          <StripeCheckout
            token={(token) => doRequest({token:token.id})} 
            stripeKey="pk_test_51OaAD3FCTbeSmREUWmUSluaYtjtFsOx6zFhBCrQvw5buPyUDUshCYpLGNfBRkVoeJnm3WHKJ4PdmhGH8JBnltvTO00aE9Qz4SG"
            amount={order.ticket.price * 100}
          />
          {errors}
        </>
      ) : (
        <h1>Order Expired</h1>
      )}
    </>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data };
};

export default OrderShow;
