import express from "express";
import authCtrl from "../controllers/auth.controller.js";
import userCtrl from "../controllers/user.controller.js";
import commentCtrl from "../controllers/comment.controller.js";
import intentCtrl from "../controllers/intent.controller.js"

//create Router Object
const router = express.Router();

router
    .route("/api/:intentId/comments")
    .get(authCtrl.requireSignin, intentCtrl.hasAuthorization, commentCtrl.list)

router
    .route("/api/:intentId/createcomment")
    .post(authCtrl.requireSignin, intentCtrl.hasAuthorization, commentCtrl.create)

router.param("intentId", intentCtrl.intentById);

export default router