import express from "express";
import authCtrl from "../controllers/auth.controller.js";
import userCtrl from "../controllers/user.controller.js";
import projectCtrl from "../controllers/project.controller.js";

const router = express.Router();

router
  .route("/api/project/user/:userId")
  .get(authCtrl.requireSignin, authCtrl.hasAuthorization, projectCtrl.list);

router
  .route("/api/project/:projectId")
  .get(authCtrl.requireSignin, projectCtrl.hasAuthorization, projectCtrl.read)
  .put(
    authCtrl.requireSignin,
    projectCtrl.hasAuthorization,
    projectCtrl.update
  );
// .post(
//   authCtrl.requireSignin,
//   projectCtrl.hasAuthorization,
//   projectCtrl.createIntent
// );
// .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, projectCtrl.delete)

router.route("/api/project").post(authCtrl.requireSignin, projectCtrl.create);

router.param("userId", userCtrl.userByID);
router.param("projectId", projectCtrl.projectById);

export default router;
