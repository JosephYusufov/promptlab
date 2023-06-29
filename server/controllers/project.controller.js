import Project from "../models/project.model.js";
import Intent from "../models/intent.model.js";
import User from "../models/user.model.js";
import errorHandler from "../helpers/dbErrorHandler.js";


/**
 * get project object from database based on project id
 * @param req
 * @param res
 * @param next
 * @param id
 * @returns {Promise<*>}
 */
const projectById = async (req, res, next, id) => {
  console.log(id);
  try { //attempt database query to project and populate intents and contexts in specified project
    let project = await Project.findById(id).populate([
      {
        path: "intents",
        options: { sort: { created: -1 } },
      },
      {
        path: "contexts",
        options: { sort: { created: -1 } },
      },
    ]);

    //throw error if project id doesn't locate a project
    if (!project)
      return res.status(400).json({
        error: "Project not found",
      });
    // console.log(intent);

    //append project object to request and go to next
    req.project = project;
    if (next) next();
  } catch (err) { //handle database querying errors
    console.log(err);
    return res.status(400).json({
      error: "Could not retrieve project",
    });
  }
};

/**
 * check that a user has authorization to view a particular project (and all intents/prompts/contexts with it)
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const hasAuthorization = async (req, res, next) => {

  //require that a project and user exist and the project owner matches the requester's id
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


/**
 * Create a new project
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const create = async (req, res) => {

  //define user and create project based on body parameters, specifying the owner as the user
  let user = req.auth;
  let project = new Project({ ...req.body, owner: user._id });

  try { //attempt to save to database
    await project.save();
    return res.status(200).json({
      message: "Succesfully created a new Project.",
    });
  } catch (err) { //handle error if save fails
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};


/**
 * Read a new project
 * @param req
 * @param res
 * @returns {*}
 */
const read = (req, res) => {
  return res.json(req.project);
};

// const createIntent = async (req, res, next) => {
//   let user = req.auth;
//   let project = req.project;
//   let intent = new Intent({
//     ...req.body,
//     user: user._id,
//     project: project._id,
//   });
//   try {
//     await intent.save();
//     return res.status(200).json({
//       message: "Succesfully created a new Intent.",
//     });
//   } catch (err) {
//     return res.status(400).json({
//       error: errorHandler.getErrorMessage(err),
//     });
//   }
// };

/**
 * Update a project's information
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const update = async (req, res) => {
  try {

    let project = req.project;

    //update project name to the request body name if exists, otherwise keep the same
    project.name = req.body.name ? req.body.name : project.name;

    //reset updated time
    project.updated = Date.now();
    await project.save(); //save project
    await updateIntents(req, res); //cascade and update intents

    //respond with updated project
    res.json(req.project);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

/**
 * update intents of a given project
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const updateIntents = async (req, res) => {
  try {

    let project = req.project;

    //if there are intents and adding is true, update all intents
    if (req.body.intents && req.body.intents.add)
      await Intent.updateMany(
        { _id: { $in: req.body.intents.add } },
        { project: project._id }
      );

    //if there are intents and removing is true, remove the filtered intents
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

/**
 * List projects associated with a given user
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const list = async (req, res) => {

  //get user profile
  let user = req.profile;

  try {
    let projects = await Project.find({ owner: user._id }).exec(); //find all projects belonging to user
    res.json(projects); //return projects
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
  // createIntent,
  hasAuthorization,
  // remove,
  update,
  projectById,
};
