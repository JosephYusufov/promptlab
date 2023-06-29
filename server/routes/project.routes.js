import express from "express";
import authCtrl from "../controllers/auth.controller.js";
import userCtrl from "../controllers/user.controller.js";
import projectCtrl from "../controllers/project.controller.js";

//create router object
const router = express.Router();

//list all projects based on a user ID
router
  .route("/api/project/user/:userId")
  .get(authCtrl.requireSignin, authCtrl.hasAuthorization, projectCtrl.list); //if user is authorized, view requisite projects

//view a specific project and update it
router
  .route("/api/project/:projectId")
  .get(authCtrl.requireSignin, projectCtrl.hasAuthorization, projectCtrl.read) //view project if user is authorized
  .put( //update a project if a user is authorized to
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

router.route("/api/project").post(authCtrl.requireSignin, projectCtrl.create); //create a new project if a user is signed in

router.param("userId", userCtrl.userByID); //define the userId parameter
router.param("projectId", projectCtrl.projectById); //define the projectId parameter

export default router;
