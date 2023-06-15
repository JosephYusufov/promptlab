import Project from "../models/project.model.js";
import Intent from "../models/intent.model.js";
import User from "../models/user.model.js";
import errorHandler from "../helpers/dbErrorHandler.js";

const projectById = async (req, res, next, id) => {
  console.log(id);
  try {
    let project = await Project.findById(id).populate("intents");
    if (!project)
      return res.status(400).json({
        error: "Project not found",
      });
    // console.log(intent);
    req.project = project;
    if (next) next();
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: "Could not retrieve project",
    });
  }
};
const hasAuthorization = async (req, res, next) => {
  const authorized =
    req.project && req.auth && req.auth._id == req.project.owner;
  // TODO: Authorize users who are members or admins as well.
  //   || req.auth._id
  if (!authorized) {
    return res.status(403).json({
      error: "User is not authorized",
    });
  }
  next();
};

const create = async (req, res) => {
  let user = req.auth;
  let project = new Project({ ...req.body, owner: user._id });
  try {
    await project.save();
    return res.status(200).json({
      message: "Succesfully created a new Project.",
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const read = (req, res) => {
  return res.json(req.project);
};

const createIntent = async (req, res, next) => {
  let user = req.auth;
  let project = req.project;
  let intent = new Intent({
    ...req.body,
    user: user._id,
    project: project._id,
  });
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

const update = async (req, res) => {
  try {
    let project = req.project;
    project.name = req.body.name ? req.body.name : project.name;
    project.updated = Date.now();
    await project.save();
    await updateIntents(req, res);
    res.json(req.project);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const updateIntents = async (req, res) => {
  try {
    let project = req.project;
    if (req.body.intents && req.body.intents.add)
      await Intent.updateMany(
        { _id: { $in: req.body.intents.add } },
        { project: project._id }
      );
    if (req.body.intents && req.body.intents.remove)
      await Intent.deleteMany({ _id: { $in: req.body.intents.remove } });
    await projectById(req, res, null, project.id);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

// const updateMembers = async (req, res) => {
//   try {
//     let project = req.project;
//     if (req.body.members && req.body.members.add)
//       await req.body.members.add.map((memberId) => {
//         User.findByIdAndUpdate(memberId, { project: project._id });
//       });
//     if (req.body.members && req.body.members.remove)
//       await req.body.intents.remove.map((intentId) => {
//         Intent.findByIdAndRemove(intentId);
//       });
//   } catch (err) {
//     return res.status(400).json({
//       error: errorHandler.getErrorMessage(err),
//     });
//   }
// };

const list = async (req, res) => {
  let user = req.profile;
  try {
    let projects = await Project.find({ owner: user._id }).exec();
    res.json(projects);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

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
  createIntent,
  hasAuthorization,
  // remove,
  update,
  projectById,
};
