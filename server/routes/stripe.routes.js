import express from "express";
import stripeCtrl from "../controllers/stripe.controller.js";
import bodyParser from "body-parser";

const router = express.Router();

router.route("/api/create-payment-intent").post(stripeCtrl.createPaymentIntent);
router
  .route("/api/create-checkout-session")
  .post(stripeCtrl.createCheckoutSession);

router.route("/api/create-portal-session").post(stripeCtrl.createPortalSession);
router
  .route("/api/webhook")
  .post(express.raw({ type: "application/json" }), stripeCtrl.webhook);

export default router;
