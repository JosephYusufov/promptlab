import express from "express";
import authCtrl from "../controllers/auth.controller.js";
import userCtrl from "../controllers/user.controller.js";
import intentCtrl from "../controllers/intent.controller.js";

//create Router Object
const router = express.Router();

//create intents and view all intents
router
  .route("/api/intent")
  .get(authCtrl.requireSignin, intentCtrl.list) //view intents after signed in
  .post(authCtrl.requireSignin, intentCtrl.hasAuthorization, intentCtrl.create); //make sure use has authorization and creates intent

// .put(authCtrl.requireSignin, authCtrl.hasAuthorization, promptCtrl.update)
// .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, promptCtrl.remove)

//view specific intents and create prompts inside of them
router
  .route("/api/intent/:intentId")
  .get(authCtrl.requireSignin, intentCtrl.hasAuthorization, intentCtrl.read) //view specific intent
  .post(//create a Prompt inside an intent if a user is authorized to do so
    authCtrl.requireSignin,
    intentCtrl.hasAuthorization,
    intentCtrl.createPrompt
  );


//create a completion for an intent
router
  .route("/api/intent/:intentId/completion")

  .post( //get completion on an intent if a user is authorized to do so
    authCtrl.requireSignin,
    intentCtrl.hasAuthorization,
    intentCtrl.getCompletion
  );


//create a prompt for an intent based off of an LLM
router
  .route("/api/intent/:intentId/generate")
  .post( //Get the prompt if the user is authorized to access the intent
    authCtrl.requireSignin,
    intentCtrl.hasAuthorization,
    intentCtrl.getPrompt
  );

router.param("userId", userCtrl.userByID); //define the userId parameter
router.param("intentId", intentCtrl.intentById); //define the intentId parameter

export default router;
