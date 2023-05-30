import express from "express";
import authCtrl from "../controllers/auth.controller.js";
import userCtrl from "../controllers/user.controller.js";
import intentCtrl from "../controllers/intent.controller.js";

const router = express.Router();

router
  .route("/api/intents/user/:userId")
  .get(authCtrl.requireSignin, authCtrl.hasAuthorization, intentCtrl.list)
  .post(authCtrl.requireSignin, authCtrl.hasAuthorization, intentCtrl.create);
// .put(authCtrl.requireSignin, authCtrl.hasAuthorization, promptCtrl.update)
// .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, promptCtrl.remove)

router.param("userId", userCtrl.userByID);

export default router;
