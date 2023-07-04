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
  // console.log(id);
  try {
    //attempt database query to project and populate intents and contexts in specified project
    let project = await Project.findById(id)
      .populate([
        {
          path: "intents",
          options: { sort: { created: -1 } },
        },
        {
          path: "contexts",
          options: { sort: { created: -1 } },
        },
      ])
      .exec();

    //throw error if project id doesn't locate a project
    if (!project)
      return res.status(400).json({
        error: "Project not found",
      });
    // console.log(intent);

    //append project object to request and go to next
    req.project = project;
    if (next) next();
  } catch (err) {
    //handle database querying errors
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
    req.project &&
    req.auth &&
    (req.auth._id == req.project.owner ||
      req.project.members.includes(req.auth._id));
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

  try {
    //attempt to save to database
    await project.save();
    return res.status(200).json({
      message: "Succesfully created a new Project.",
    });
  } catch (err) {
    //handle error if save fails
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
const read = async (req, res) => {
  await req.project.populate("members");
  return res.json({
    ...req.project.toJSON(),
    is_pro: await req.project.isPro(),
    owner_username: await req.project.getOwnerUsername(),
  });
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

    await updateIntents(req, res, project); //cascade and update intents
    await updateMembers(req, res, project); //cascade and update members

    //reset updated time
    project.updated = Date.now();
    // console.log(project);
    try {
      await project.save(); //save project
    } catch (e) {
      console.log(e);
    }

    //respond with updated project
    try {
      res.json(project);
    } catch (e) {
      console.log(e);
    }
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
 * @param project
 * @returns {Promise<*>}
 */
const updateIntents = async (req, res, project) => {
  try {
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

/**
 * update members of a given project: pro feature.
 * @param req
 * @param res
 * @param project
 * @returns {Promise<*>}
 */
const updateMembers = async (req, res, project) => {
  if (!(await project.isPro()))
    return res.status(403).json({
      error:
        "The owner of this project must be a PromptLab Pro member to use this feature.",
    });
  try {
    if (req.body.members) {
      if (req.body.members.add) {
        await Promise.all(
          req.body.members.add.map(async (newMemberEmail) => {
            let newMember = await User.findOne({ email: newMemberEmail });
            if (
              newMember &&
              !project.members.includes(newMember._id) &&
              newMember.id != project.owner
            ) {
              project.members.push(newMember._id);
            }
          })
        );
      }
      if (req.body.members.remove) {
        await Promise.all(
          req.body.members.remove.map(async (removedMemberEmail) => {
            let removedMember = await User.findOne({
              email: removedMemberEmail,
            });
            if (removedMember) {
              // console.log("removedMember");
              project.members = project.members.filter(
                (member) => member != removedMember.id
              );
              // console.log(project.members);
            }
          })
        );
      }
      // console.log(project);
    }
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

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
    let ownedProjects = await Project.find({ owner: user._id }).exec();
    ownedProjects = await Promise.all(
      ownedProjects.map(async (p) => {
        if (p)
          return {
            ...p.toJSON(),
            is_pro: await p.isPro(),
            owner_username: await p.getOwnerUsername(),
          };
        else return p;
      })
    );
    let sharedProjects = await Project.find({ members: user._id }).exec();
    sharedProjects = await Promise.all(
      sharedProjects.map(async (p) => {
        if (p)
          return {
            ...p.toObject(),
            is_pro: await p.isPro(),
            owner_username: await p.getOwnerUsername(),
          };
        else return p;
      })
    );
    res.json({ owned: ownedProjects, shared: sharedProjects }); //return projects
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const requiresPro = async (req, res, next) => {
  let isPro = await req.project.isPro();
  if (!isPro) {
    return res.status(403).json({
      error:
        "The owner of this project must be a PromptLab Pro member to use this feature.",
    });
  } else next();
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
  requiresPro,
  projectById,
};
