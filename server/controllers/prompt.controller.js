import Prompt from "../models/prompt.model.js";
import errorHandler from "../helpers/dbErrorHandler.js";

/**
 * Create a new prompt object based on req
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const create = async (req, res) => {
  let user = req.profile;
  let prompt = new Prompt({ ...req.body, user: user._id });

  // fetch and update intent
  // try {
  //   let intent = await Intent.findById(prompt.intent);
  //   console.log(intent);
  //   prompt.generation = intent.version + 1;
  //   console.log(prompt.generation);
  //   intent.version += 1;
  //   intent.save();
  // } catch (err) {
  //   return res.status(400).json({
  //     error: errorHandler.getErrorMessage(err),
  //   });
  // }

  // save prompt
  // console.log(prompt);
  try { //Try saving and handle errors
    await prompt.save();
    return res.status(200).json({
      message: "Succesfully created a new prompt.",
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

// const read = (req, res) => {
//   req.profile.hashed_password = undefined
//   req.profile.salt = undefined
//   return res.json(req.profile)
// }

/**
 * List all prompts belonging to a user
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const list = async (req, res) => {
  let user = req.profile; //retrieve user
  // console.log(user)
  try { //find and display prompts
    let prompts = await Prompt.find({ user: user._id }).exec();
    // console.log(prompts);
    res.json(prompts);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
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


export default {
  create,
  // userByID,
  // read,
  list,
  // remove,
  // update
};
