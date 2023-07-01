import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { createPaymentIntent } from "./api-stripe.js";
import CheckoutForm from "./CheckoutForm";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(
  "pk_test_51NMtbwHSOMSiIegDG8VOHkv0bHx0dPAlzUB9cCIyGFGFfFuCX1OHeLSlbUf5r55c5FJ6FG8GRf1iM5X8tgR88GDJ00O7hgMFET"
);

export default function PLStripe() {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    createPaymentIntent().then((data) => setClientSecret(data.clientSecret));
  }, []);

  const appearance = {
    theme: "night",
    variables: {
      colorPrimary: "#4f46e5",
    },
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="pl-stripe-container flex justify-center">
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm className="max-w-md grow" />
        </Elements>
      )}
    </div>
  );
}
