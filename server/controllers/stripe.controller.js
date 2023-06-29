import errorHandler from "../helpers/dbErrorHandler.js";
import Stripe from "stripe";
import config from "../config.js";
import User from "../models/user.model.js";

const stripe = new Stripe(
  "sk_test_51NMtbwHSOMSiIegDG6ASNuLydA3BcIX4V1S2yUUdFSEHBfvKJw1HNdmbsqdbjJRM9bQSg3VAxuphjEuk5gqf517Y00LYx8turx"
);

const createCheckoutSession = async (req, res, next) => {
  console.log(req.auth);

  // find user and get customerId. If it is not null,
  // append it to the stripe create checkout session request options.
  let user = await User.findById(req.auth._id);
  console.log(user);

  // If user is already subscribed then redirect.
  if (user.is_pro)
    res.json({ message: "You are already a PromptLab pro user." });
  else {
    // get pro subscription price
    const prices = await stripe.prices.list({
      lookup_keys: [req.body.lookup_key],
      expand: ["data.product"],
    });

    let createCheckoutSessionOptions = {
      billing_address_collection: "auto",
      line_items: [
        {
          price: prices.data[0].id,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${config.frontendUri}/subscribe/?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${config.frontendUri}/subscribe/?canceled=true`,
    };

    if (user.stripe_customer_id)
      createCheckoutSessionOptions["customer"] = user.stripe_customer_id;

    // create checkout session
    const session = await stripe.checkout.sessions.create(
      createCheckoutSessionOptions
    );

    res.json({ url: session.url });
  }
};

const createPortalSession = async (req, res, next) => {
  // For demonstration purposes, we're using the Checkout session to retrieve the customer ID.
  // Typically this is stored alongside the authenticated user in your database.
  const { session_id } = req.body;
  const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);

  // This is the url to which the customer will be redirected when they are done
  // managing their billing with the portal.
  const returnUrl = config.frontendUri + "/subscribe/";

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: checkoutSession.customer,
    return_url: returnUrl,
  });

  res.json({ url: portalSession.url });
};

// Events that need to be handled:
// customer is created: Append stripe customer_id to database
// subscription changes: update user in db with is_pro or not

const webhook = async (req, res, next) => {
  let event = req.rawBody;
  // Replace this endpoint secret with your endpoint's unique secret
  // If you are testing with the CLI, find the secret by running 'stripe listen'
  // If you are using an endpoint defined with the API or dashboard, look in your webhook settings
  // at https://dashboard.stripe.com/webhooks
  const endpointSecret =
    "whsec_45812811e24dd3c7115092e1cdcb5888494133a0b8997d187f1e5a46c094b3ba";
  // Only verify the event if you have an endpoint secret defined.
  // Otherwise use the basic event deserialized with JSON.parse
  if (endpointSecret) {
    // Get the signature sent by Stripe
    const signature = req.headers["stripe-signature"];
    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        endpointSecret
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return res.sendStatus(400);
    }
  }
  let subscription;
  let status;
  // Handle the event
  console.log(event.type);
  switch (event.type) {
    case "customer.subscription.trial_will_end":
      subscription = event.data.object;
      status = subscription.status;
      console.log(`Subscription status is ${status}.`);
      // Then define and call a method to handle the subscription trial ending.
      // handleSubscriptionTrialEnding(subscription);
      break;
    case "customer.subscription.deleted":
      subscription = event.data.object;
      status = subscription.status;
      console.log(`Subscription status is ${status}.`);
      // Then define and call a method to handle the subscription deleted.
      // handleSubscriptionDeleted(subscriptionDeleted);
      break;
    case "customer.subscription.created":
      subscription = event.data.object;
      status = subscription.status;
      console.log(`Subscription status is ${status}.`);
      // Then define and call a method to handle the subscription created.
      // handleSubscriptionCreated(subscription);
      break;
    case "customer.subscription.updated":
      subscription = event.data.object;
      status = subscription.status;
      console.log(`Subscription status is ${status}.`);
      // Then define and call a method to handle the subscription update.
      // handleSubscriptionUpdated(subscription);
      break;
    case "invoice.paid":
      handleInvoicePaid(event);
      break;

    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
  }
  // Return a 200 response to acknowledge receipt of the event
  res.send();
};

const handleInvoicePaid = async (event) => {
  let invoice = event.data.object;
  let subscription = await stripe.subscriptions.retrieve(invoice.subscription);
  if (invoice.paid && subscription.status == "active") {
    let user = await User.findOne({ stripe_customer_id: invoice.customer });
    console.log(user);
    console.log(invoice.customer);
    if (user) user.is_pro = true;
    await user.save();
  }
};

export default {
  createCheckoutSession,
  createPortalSession,
  webhook,
};
