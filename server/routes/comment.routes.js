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

router
    .route("/api/:intentId/:parentId/reply")
    .post(authCtrl.requireSignin, intentCtrl.hasAuthorization, commentCtrl.createReply)

router.param("intentId", intentCtrl.intentById);
router.param("parentId", commentCtrl.commentById);

export default router