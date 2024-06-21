import React, { useState } from 'react';
import axios from 'axios';

const PaymentComponent = () => {
  const [amount, setAmount] = useState('');

  const handlePayment = async () => {
    try {
      // Create order on the server
      const orderResponse = await axios.get(`https://diagonistic-backend.vercel.app/api/pay/checkout?amount=${amount}`);
      const { order } = orderResponse.data;

      // Options for Razorpay payment
      const options = {
        key: order.key, // Replace with your Razorpay key ID
        amount: order.amount,
        currency: order.currency,
        name: 'DiagnoWeb.com',
        description: 'Test Transaction',
        image: 'https://your-logo-url.com/logo.png',
        order_id: order.id,
        handler: async (response) => {
          try {
            // Verify payment on the server
            await axios.post('https://diagonistic-backend.vercel.app/api/pay/paymentVerification', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              amount: order.amount / 100,
            });
            alert('Payment Successful');
          } catch (error) {
            alert('Payment Verification Failed');
          }
        },
        prefill: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          contact: '9999999999'
        },
        notes: {
          address: 'Razorpay Corporate Office'
        },
        theme: {
          color: '#3399cc'
        }
      };

      // Check if Razorpay script is loaded
      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        console.error('Razorpay SDK is not loaded');
      }
    } catch (error) {
      console.error('Error during payment process:', error);
    }
  };

  return (
    <div>
      <h2>Razorpay Payment</h2>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
      />
      <button onClick={handlePayment}>Pay Now</button>
    </div>
  );
};

export default PaymentComponent;
