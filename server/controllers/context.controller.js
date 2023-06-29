import Context from "../models/context.model.js";
import errorHandler from "../helpers/dbErrorHandler.js";
import projectCtrl from "./project.controller.js";

/**
 * Retrieve a context object by its ID and append it to the request object
 * @param req
 * @param res
 * @param next
 * @param id
 * @returns {Promise<*>}
 */
const contextById = async (req, res, next, id) => {
  try {

    //Query the database by id
    let context = await Context.findById(id);

    if (!context) //if no context found, then throw error
      return res.status(400).json({
        error: "Context not found",
      });

    //else, append context object to the request and call next
    req.context = context;
    next();

  } catch (err) { //if database error, throw an error
    return res.status(400).json({
      error: "Could not retrieve Context",
    });
  }
};

/**
 * Create a context object
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const create = async (req, res) => {
  console.log("contextCtrl.create");

  //create a new context object based on the request body's information
  let context = new Context({ ...req.body });
  try {

    await context.save(); //save context to the database and return success message
    return res.status(200).json({
      message: "Succesfully created a new Context object.",
    });

  } catch (err) { //return an errorHandler with the error message otherwise
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

/**
 * Read a context object
 * @param req
 * @param res
 * @returns {*}
 */
const read = (req, res) => {
  return res.json(req.context); //return a json response of the request's context
};

/**
 * check if a user has authorization to view a context object - based on a user's authorization to view the project
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const hasAuthorization = async (req, res, next) => {

  //handle request context and body missing information
  if (!req.context) {
    if (!req.body)
      return res.status(400).json({ error: "Provide a request body." });
    if (!req.body.project)
      return res
        .status(400)
        .json({ error: "Provide a project ID in the request body." });
    console.log("awaiting projectById");

    //get and append to req Project by ID if there is no context in request (ID is in body)
    await projectCtrl.projectById(req, res, null, req.body.project);
  } else {
    console.log(req.context);

    //get and append to req Project by ID if the ID is in the context object
    await projectCtrl.projectById(req, res, null, req.context.project);
  }

  //Check if there's authorization to view the project based on user id
  await projectCtrl.hasAuthorization(req, res, next);
};

/**
 * Update a context object
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const update = async (req, res) => {

  try { //try to update context object, located in req as req.context
    console.log(req.body);
    console.log("update context");

    let context = req.context; //context object

    context.name = req.body.name ?? context.name; //get name from the body or the context object
    context.data = req.body.data ?? context.data; //get data from the body or the context object
    context.updated = Date.now(); //reset updated date to now

    await context.save(); //save updated object to database

    res.json(context); //send new object as json response


  } catch (err) { //handle errors
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
