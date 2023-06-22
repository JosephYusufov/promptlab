import express from "express";
import authCtrl from "../controllers/auth.controller.js";
import contextCtrl from "../controllers/context.controller.js";

const router = express.Router();

router
  .route("/api/context/")
  .post(
    authCtrl.requireSignin,
    contextCtrl.hasAuthorization,
    contextCtrl.create
  );

router
  .route("/api/context/:contextId/")
  .get(authCtrl.requireSignin, contextCtrl.hasAuthorization, contextCtrl.read);

router.param("contextId", contextCtrl.contextById);

export default router;
