import Intent from "../models/intent.model.js";
import Prompt from "../models/prompt.model.js";
import errorHandler from "../helpers/dbErrorHandler.js";
import { generateResponse, generatePrompt, getPriceCompletion } from "../vendors/openAI/index.js";
import projectCtrl from "./project.controller.js";

/**
 * Retrieve an intent by its ID and append it to the req
 * @param req
 * @param res
 * @param next
 * @param id
 * @returns {Promise<*>}
 */
const intentById = async (req, res, next, id) => {
  try {

    //query the database for prompts associated with intent ID
    let intent = await Intent.findById(id).populate("prompts");

    //if there are no prompts, then send error
    if (!intent)
      return res.status(400).json({
        error: "Intent not found",
      });
    // console.log(intent);

    //append intent to request and go to next
    req.intent = intent;
    next();
  } catch (err) { //handle errors with database
    console.log(err)
    return res.status(400).json({
      error: "Could not retrieve intent",
    });
  }
};

/**
 * create intent based on req information
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const create = async (req, res) => {

  //specify user object
  let user = req.auth;

  //create intent object
  let intent = new Intent({ ...req.body, user: user._id });

  try { //try saving intent object to database
    await intent.save();
    return res.status(200).json({
      message: "Succesfully created a new Intent.",
    });
  } catch (err) { //handle save errors
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

/**
 * read an intent
 * @param req
 * @param res
 * @returns {*}
 */
const read = (req, res) => {
  // console.log(req.intent);
  return res.json(req.intent);
};

/**
 * list intents belonging to a user
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const list = async (req, res) => {

  //get user object
  let user = req.auth;
  // console.log(user);
  try { //try finding and sending intent responses based on user id
    let intents = await Intent.find({ user: user._id });
    // console.log(intents);
    res.json(intents);

  } catch (err) { //catch finding errors
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

/**
 * check for user authorization to view intents
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const hasAuthorization = async (req, res, next) => {
  if (!req.intent) { //if there's no intent attached to the request, find project ID in request

    if (!req.body) //require req.body
      return res.status(400).json({ error: "Provide a request body." });

    if (!req.body.project) //require req.body.project
      return res
        .status(400)
        .json({ error: "Provide a project ID in the request body." });

    console.log(req.body.project);

    //attach project to request
    await projectCtrl.projectById(req, res, null, req.body.project);
  } else {
    console.log(req.intent);

    //attach project to request from intent
    await projectCtrl.projectById(req, res, null, req.intent.project);
  }

  //check for authorization to view the project
  await projectCtrl.hasAuthorization(req, res, next);
  // const authorized = req.intent && req.auth && req.auth._id == req.intent.user;
  // // TODO: Authorize users who are members or admins as well.
  // //   || req.auth._id
  // if (!authorized) {
  //   return res.status(403).json({
  //     error: "User is not authorized",
  //   });
  // }
  // next();
};

// const update = async (req, res) => {
//   try {
//     let user = req.profile
//     user = extend(user, req.body)
//     user.updated = Date.now()
//     await user.save()
//     user.hashed_password = undefined
//     user.salt = undefined
//     res.json(user)
//   } catch (err) {
//     return res.status(400).json({
//       error: errorHandler.getErrorMessage(err)
//     })
//   }
// }

// const remove = async (req, res) => {
//   try {
//     let user = req.profile
//     let deletedUser = await user.remove()
//     deletedUser.hashed_password = undefined
//     deletedUser.salt = undefined
//     res.json(deletedUser)
//   } catch (err) {
//     return res.status(400).json({
//       error: errorHandler.getErrorMessage(err)
//     })
//   }
// }

/**
 * create prompt object
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const createPrompt = async (req, res) => {

  //find user and intent from request
  let user = req.auth;
  let intent = req.intent;

  //create new prompt with request body attached to intent, user, and a specific model
  let prompt = new Prompt({
    ...req.body,
    user: user._id,
    intent: intent._id,
    model: intent.model,
  });

  //Save prompt to database, and throw an error if there is one
  try {
    await prompt.save();
    return res.status(200).json({
      message: "Succesfully created a new Prompt.",
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};


/**
 * Get a completion given an intent
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const getCompletion = async (req, res) => {

  //require context in body
  if (!req.body.context) {
    return res.status(400).json({
      error: "No Context Provided",
    });
  }
  console.log("getCompletion");
  const context = req.body.context;
  console.log("context");
  console.log(context);

  //get intent object and select most recent prompt
  const intent = req.intent;
  console.log(intent);
  const promptText = intent.prompts.slice(-1)[0].text;

  //select and replace context placeholders with context
  const exp = /{{.+?}}/gm;
  const matches = promptText.match(exp);
  let editedPrompt = promptText;
  const len = Object.keys(context).length;

  //require that contexts match
  if (len !== matches.length) {
    return res.status(400).json({
      error: "Mismatch between context length and variable length in prompt.",
    });
  }

  //replace contexts if the names match
  if (len !== 0) {
    for (let i = 0; i < len; i++) {
      const cont_braces = "{{" + Object.keys(context)[i] + "}}";
      const cur_match = matches[i];

      if (cont_braces !== cur_match) {
        return res.status(400).json({
          error: "Variable in context does not match variable in prompt!",
        });
      } else {
        editedPrompt = editedPrompt.replace(
          editedPrompt.match(cur_match),
          context[Object.keys(context)[i]]
        );
      }
    }
  }

  //generate response from the new edited prompt
  const resp = await generateResponse(editedPrompt);

  //send prompt generation as response
  res.json(resp.data);
};

// const getPrompt = async (req, res) => {
//   if (
//     !req.intent ||
//     !req.body.context ||
//     !req.body.uresponse ||
//     !req.body.airesponse
//   ) {
//     res.status(400).json({
//       error:
//         "Key variable missing! Must include prompt, context, userresponse (uresponse), and airesponse  in body",
//     });
//   }

//   const intent = req.intent;
//   const promptText = intent.prompts.slice(-1)[0].text;

//   const context = req.body.context;
//   const uresponse = req.body.uresponse;
//   const airesponse = req.body.airesponse;

//   const exp = /{{.+?}}/gm;

//   const matches = promptText.match(exp);

//   let editedPrompt = promptText;

//   const len = Object.keys(context).length;

//   if (len !== matches.length) {
//     return res.status(400).json({
//       error: "Mismatch between context length and variable length in prompt.",
//     });
//   }

//   if (len !== 0) {
//     for (let i = 0; i < len; i++) {
//       const cont_braces = "{{" + Object.keys(context)[i] + "}}";
//       const cur_match = matches[i];

//       if (cont_braces !== cur_match) {
//         return res.status(400).json({
//           error: "Variable in context does not match variable in prompt!",
//         });
//       } else {
//         editedPrompt = editedPrompt.replace(
//           editedPrompt.match(cur_match),
//           "{{" + context[Object.keys(context)[i]] + "}}"
//         );
//       }
//     }
//   }

//   const resp = await generatePrompt(editedPrompt, airesponse, uresponse);

//   res.json(resp.data);
// };


/**
 * Get a corrected prompt from a previously generated response and feedback
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const getPrompt = async (req, res) => {

  //require an intent object, context, edited response, and original response
  if (
    !req.intent ||
    !req.body.context ||
    !req.body.uresponse ||
    !req.body.airesponse
  ) {
    res.status(400).json({
      error:
        "Key variable missing! Must include prompt, context, userresponse (uresponse), and airesponse  in body",
    });
  }
  const intent = req.intent;
  const promptText = intent.prompts.slice(-1)[0].text; //get most recent iteration of prompt
  const context = req.body.context;
  const uresponse = req.body.uresponse;
  const airesponse = req.body.airesponse;

  const exp = /{{.+?}}/gm;

  const matches = promptText.match(exp);

  // let editedPrompt = promptText;

  const len = Object.keys(context).length;

  //ensure that length of context matches placeholders
  if (len !== matches.length) {
    return res.status(400).json({
      error: "Mismatch between context length and variable length in prompt.",
    });
  }


  //iteratively replace context placeholders with variables
  if (len !== 0) {
    for (let i = 0; i < len; i++) {
      const cont_braces = "{{" + Object.keys(context)[i] + "}}";
      const cur_match = matches[i];

      if (cont_braces !== cur_match) {
        return res.status(400).json({
          error: "Variable in context does not match variable in prompt!",
        });
      }
      // else {
      //   editedPrompt = editedPrompt.replace(
      //     editedPrompt.match(cur_match),
      //     "{{" + context[Object.keys(context)[i]] + "}}"
      //   );
      // }
    }
  }

  //get prompt from index.js
  const resp = await generatePrompt(promptText, airesponse, uresponse, context);
  if (resp.error)
    return res.status(500).json({
      error: resp.error,
    });
  else res.json(resp);
};

const getPrice = (req, res) => {

  if (!req.body.context) {
    return res.status(400).json({
      error: "No Context Provided",
    });
  }
  const context = req.body.context;


  //get intent object and select most recent prompt
  const intent = req.intent;

  const promptText = intent.prompts.slice(-1)[0].text;

  //select and replace context placeholders with context
  const exp = /{{.+?}}/gm;
  const matches = promptText.match(exp);
  let editedPrompt = promptText;
  const len = Object.keys(context).length;

  //require that contexts match
  if (len !== matches.length) {
    return res.status(400).json({
      error: "Mismatch between context length and variable length in prompt.",
    });
  }

  //replace contexts if the names match
  if (len !== 0) {
    for (let i = 0; i < len; i++) {
      const cont_braces = "{{" + Object.keys(context)[i] + "}}";
      const cur_match = matches[i];

      if (cont_braces !== cur_match) {
        return res.status(400).json({
          error: "Variable in context does not match variable in prompt!",
        });
      } else {
        editedPrompt = editedPrompt.replace(
            editedPrompt.match(cur_match),
            context[Object.keys(context)[i]]
        );
      }
    }
  }

  if (!req.intent || !req.body.type) {
    res.status(400).json({
      error: "Type of Completion not provided"
    })
  }

  const type = req.body.type;
  const prompt = req.intent;

  if (type === 'completion') {


    const price = getPriceCompletion(editedPrompt);
    console.log(price)
    res.json(price);
  } else if (type === 'prompt') {
    res.json('Placeholder for prompt')
  } else {
    res.status(400).json({
      error: "Type invalid! Options are: completion, prompt"
    })
  }

}

export default {
  create,
  read,
  list,
  // remove,
  // update,
  intentById,
  getCompletion,
  getPrompt,
  createPrompt,
  hasAuthorization,
  getPrice,
};
