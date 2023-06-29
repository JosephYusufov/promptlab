import express from "express";
import authCtrl from "../controllers/auth.controller.js";
import contextCtrl from "../controllers/context.controller.js";

//create router object
const router = express.Router();

//route to create a context object
router
  .route("/api/context/")
  .post(
    authCtrl.requireSignin,
    contextCtrl.hasAuthorization, //make sure the user is authorized to access the context
    contextCtrl.create //create context object
  );

//route to view or update an existing context
router
  .route("/api/context/:contextId/")
  .get(authCtrl.requireSignin, contextCtrl.hasAuthorization, contextCtrl.read) //authorize user and call read context object
  .put(
    authCtrl.requireSignin,
    contextCtrl.hasAuthorization,
    contextCtrl.update //update an existing context
  );

//create parameter contextId and assign it
router.param("contextId", contextCtrl.contextById);

export default router;
