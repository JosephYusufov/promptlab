import express from "express";
import stripeCtrl from "../controllers/stripe.controller.js";
import bodyParser from "body-parser";
import authCtrl from "../controllers/auth.controller.js";

const router = express.Router();

// router.route("/api/create-payment-intent").post(stripeCtrl.createPaymentIntent);
router
  .route("/api/create-checkout-session")
  .post(authCtrl.requireSignin, stripeCtrl.createCheckoutSession);

router
  .route("/api/create-portal-session")
  .post(authCtrl.requireSignin, stripeCtrl.createPortalSession);
router
  .route("/api/webhook")
  .post(express.raw({ type: "application/json" }), stripeCtrl.webhook);

export default router;
