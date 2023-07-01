import React, { useState, useEffect, useContext } from "react";
import { createCheckoutSession, createPortalSession } from "./api-stripe.js";
import { useNavigate } from "react-router-dom";
import auth from "./../auth/auth-helper";
import { CurrentUserContext } from "../App.js";
import { read } from "./../user/api-user.js";

export default function PLSubscribe() {
  let [message, setMessage] = useState("");
  let [success, setSuccess] = useState(false);
  // let [sessionId, setSessionId] = useState("");
  let navigate = useNavigate();
  let { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const jwt = auth.isAuthenticated();

  useEffect(() => {
    (async () => {
      // Check to see if this is a redirect back from Checkout
      const query = new URLSearchParams(window.location.search);

      if (query.get("success")) {
        setSuccess(true);
      }

      if (query.get("canceled")) {
        setSuccess(false);
        setMessage(
          "Order canceled -- continue to shop around and checkout when you're ready."
        );
      }
      let user = await read({ userId: jwt.user._id }, { t: jwt.token }, null);
      setCurrentUser(user);
    })();
  }, []);

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    let res = await createCheckoutSession(
      { lookup_key: "PRO" },
      { t: jwt.token }
    );
    console.log(res);
    if (res.url) return window.location.replace(res.url);
    if (res.message) setMessage(res.message);
  };

  const handlePortalSubmit = async (e) => {
    e.preventDefault();
    let res = await createPortalSession({ t: jwt.token });
    console.log(res);
    if (res.url) return window.location.replace(res.url);
    if (res.message) setMessage(res.message);
  };

  return (
    <div>
      {currentUser && !currentUser.is_pro && (
        <section>
          <div className="product">
            <div className="description">
              <h3 className="text-white">PromptLab Pro</h3>
              <h5 className="text-white">$10.00 / month</h5>
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
      )}

      {currentUser && currentUser.is_pro && (
        <section>
          <div className="product Box-root">
            <div className="description Box-root">
              <h3 className="text-white">
                Subscription to starter plan successful!
              </h3>
            </div>
          </div>
          <form onSubmit={handlePortalSubmit}>
            <button
              id="checkout-and-portal-button"
              type="submit"
              className="text-white bg-indigo-600 px-2 py-1 my-2 rounded-md"
            >
              Manage your billing information
            </button>
          </form>
        </section>
      )}

      {message && (
        <section>
          <p className="text-white">{message}</p>
        </section>
      )}
    </div>
  );
}
