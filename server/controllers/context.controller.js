import Context from "../models/context.model.js";
import errorHandler from "../helpers/dbErrorHandler.js";
import projectCtrl from "./project.controller.js";

const contextById = async (req, res, next, id) => {
  try {
    let context = await Context.findById(id);
    if (!context)
      return res.status(400).json({
        error: "Context not found",
      });
    req.context = context;
    next();
  } catch (err) {
    return res.status(400).json({
      error: "Could not retrieve Context",
    });
  }
};

const create = async (req, res) => {
  console.log("contextCtrl.create");
  let context = new Context({ ...req.body });
  try {
    await context.save();
    return res.status(200).json({
      message: "Succesfully created a new Context object.",
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const read = (req, res) => {
  return res.json(req.context);
};

const hasAuthorization = async (req, res, next) => {
  if (!req.context) {
    if (!req.body)
      return res.status(400).json({ error: "Provide a request body." });
    if (!req.body.project)
      return res
        .status(400)
        .json({ error: "Provide a project ID in the request body." });
    console.log("awaiting projectById");
    await projectCtrl.projectById(req, res, null, req.body.project);
  } else {
    console.log(req.context);
    await projectCtrl.projectById(req, res, null, req.context.project);
  }

  await projectCtrl.hasAuthorization(req, res, next);
};

const update = async (req, res) => {
  try {
    console.log(req.body);
    console.log("update context");
    let context = req.context;
    context.name = req.body.name ?? context.name;
    context.data = req.body.data ?? context.data;
    context.updated = Date.now();
    await context.save();
    res.json(context);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

// const remove = async (req, res) => {
//   try {
//     let user = req.profiles
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
  contextById,
  // remove,
  update,
  hasAuthorization,
};
