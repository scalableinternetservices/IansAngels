import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React, { useEffect, useState, useRef, useImperativeHandle } from "react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

function MyApp({ Component, pageProps }) {

  // const [clientSecret, setClientSecret] = React.useState("");

  // const appearance = {
  //   theme: 'stripe',
  // };
  // const options = {
  //   clientSecret,
  //   appearance,
  // };

  // React.useEffect(() => {
  //   // Create PaymentIntent as soon as the page loads
  //   fetch("/api/create-payment-intent", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ items: [{ id: "xl-tshirt" }] }),
  //   })
  //     .then((res) => res.json())
  //     .then((data) => setClientSecret(data.clientSecret));
  //     console.log("Client Secret Key: " + clientSecret);
  // }, []);

  // return <Elements options={options} stripe={stripePromise}><Component {...pageProps} /> </Elements>
  return <Component {...pageProps} /> 

}

export default MyApp
