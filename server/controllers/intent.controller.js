import Intent from "../models/intent.model.js";
import errorHandler from "../helpers/dbErrorHandler.js";

const intentById = async (req, res, next, id) => {
  try {
    let intent = await Intent.findById(id).populate("prompts");
    if (!intent)
      return res.status(400).json({
        error: "Intent not found",
      });
    // console.log(intent);
    req.intent = intent;
    next();
  } catch (err) {
    return res.status(400).json({
      error: "Could not retrieve intent",
    });
  }
};

const create = async (req, res) => {
  let user = req.profile;
  let intent = new Intent({ ...req.body, user: user._id });
  try {
    await intent.save();
    return res.status(200).json({
      message: "Succesfully created a new Intent.",
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const read = (req, res) => {
  // console.log(req.intent);
  return res.json(req.intent);
};

const list = async (req, res) => {
  let user = req.profile;
  // console.log(user);
  try {
    let intents = await Intent.find({ user: user._id });
    // console.log(intents);
    res.json(intents);
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
  read,
  list,
  // remove,
  // update,
  intentById,
};
