import React, { useState, useEffect } from "react";
import { createCheckoutSession, createPortalSession } from "./api-stripe.js";
import { useNavigate } from "react-router-dom";

export default function PLSubscribe() {
  let [message, setMessage] = useState("");
  let [success, setSuccess] = useState(false);
  let [sessionId, setSessionId] = useState("");
  let navigate = useNavigate();
  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);

    if (query.get("success")) {
      setSuccess(true);
      setSessionId(query.get("session_id"));
    }

    if (query.get("canceled")) {
      setSuccess(false);
      setMessage(
        "Order canceled -- continue to shop around and checkout when you're ready."
      );
    }
  }, [sessionId]);

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    let res = await createCheckoutSession();
    console.log(res.url);
    if (res.url) return window.location.replace(res.url);
  };

  const handlePortalSubmit = async (e) => {
    e.preventDefault();
    console.log(sessionId);
    let res = await createPortalSession(sessionId);
    console.log(res.url);
    if (res.url) return window.location.replace(res.url);
  };

  const ProductDisplay = () => (
    <section>
      <div className="product">
        <div className="description">
          <h3 className="text-white">PromptLab Pro</h3>
          <h5 className="text-white">$20.00 / month</h5>
        </div>
      </div>
      <form onSubmit={handleCheckoutSubmit}>
        {/* Add a hidden field with the lookup_key of your Price */}
        <input type="hidden" name="lookup_key" value="PRO" />
        <button
          className="text-white bg-indigo-600 px-2 py-1 my-2 rounded-md"
          id="checkout-and-portal-button"
          type="submit"
        >
          Checkout
        </button>
      </form>{" "}
    </section>
  );

  const SuccessDisplay = ({ sessionId }) => {
    return (
      <section>
        <div className="product Box-root">
          <Logo />
          <div className="description Box-root">
            <h3 className="text-white">
              Subscription to starter plan successful!
            </h3>
          </div>
        </div>
        <form onSubmit={handlePortalSubmit}>
          <input
            type="hidden"
            id="session-id"
            name="session_id"
            value={sessionId}
          />
          <button
            id="checkout-and-portal-button"
            type="submit"
            className="text-white bg-indigo-600 px-2 py-1 my-2 rounded-md"
          >
            Manage your billing information
          </button>
        </form>
      </section>
    );
  };

  const Message = ({ message }) => (
    <section>
      <p>{message}</p>
    </section>
  );
  if (!success && message === "") {
    return <ProductDisplay />;
  } else if (success && sessionId !== "") {
    return <SuccessDisplay sessionId={sessionId} />;
  } else {
    return <Message message={message} />;
  }
}

const Logo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width="14px"
    height="16px"
    viewBox="0 0 14 16"
    version="1.1"
  >
    <defs />
    <g id="Flow" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g
        id="0-Default"
        transform="translate(-121.000000, -40.000000)"
        fill="#E184DF"
      >
        <path
          d="M127,50 L126,50 C123.238576,50 121,47.7614237 121,45 C121,42.2385763 123.238576,40 126,40 L135,40 L135,56 L133,56 L133,42 L129,42 L129,56 L127,56 L127,50 Z M127,48 L127,42 L126,42 C124.343146,42 123,43.3431458 123,45 C123,46.6568542 124.343146,48 126,48 L127,48 Z"
          id="Pilcrow"
        />
      </g>
    </g>
  </svg>
);
