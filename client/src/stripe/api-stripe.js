const backendUri =
  window.location.protocol +
  "//" +
  (window.location.hostname == "localhost"
    ? "localhost:3001"
    : `api.${window.location.hostname.replace("www.", "")}`);

const createPaymentIntent = async () => {
  // console.log(credentials);
  try {
    let response = await fetch(backendUri + "/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [{ id: "xl-tshirt" }] }),
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const createCheckoutSession = async () => {
  console.log("hello");
  try {
    let response = await fetch(backendUri + "/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lookup_key: "PRO" }),
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const createPortalSession = async (sessionId) => {
  // console.log(credentials);
  try {
    let response = await fetch(backendUri + "/api/create-portal-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId }),
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

export { createPaymentIntent, createCheckoutSession, createPortalSession };
