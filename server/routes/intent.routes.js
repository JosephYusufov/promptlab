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

router
  .route("/api/intents/user/:userId/intent/:intentId")
  .get(authCtrl.requireSignin, authCtrl.hasAuthorization, intentCtrl.read);

router
  .route("/api/intents/:intentId/completion")
  .get(
    authCtrl.requireSignin,
    intentCtrl.hasAuthorization,
    intentCtrl.getCompletion
  );

router.param("userId", userCtrl.userByID);
router.param("intentId", intentCtrl.intentById);

export default router;
