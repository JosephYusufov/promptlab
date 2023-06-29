import User from "../models/user.model.js";
import { expressjwt } from "express-jwt";
import jwt from "jsonwebtoken";
import config from "../config.js";

/**
 * Handles signing in
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const signin = async (req, res) => {
  try { //Query the database for a user email
    let user = await User.findOne({
      email: req.body.email,
    });
    // console.log(user)
    if (!user) //if not found, return error
      return res.status(401).json({
        error: "User not found",
      });

    if (!user.authenticate(req.body.password)) { //if wrong password typed in, send error
      return res.status(401).send({
        error: "Email and password don't match.",
      });
    }

    //if user found and authenticated, continue below

    const token = jwt.sign( //create jwt sign in token with user's id
      {
        _id: user._id,
      },
      config.jwtSecret
    );

    res.cookie("t", token, { //create cookie named "t" with the jwt.sign() token
      expire: new Date() + 9999, //create Expiration date of now + 9999
    });

    return res.json({ //return json response if all above is successful
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
      },
    });
  } catch (err) { //catch all errors and send a json response
    console.log(err);
    return res.status(401).json({
      error: "Could not sign in",
    });
  }
};

/**
 * Handles a user sign-out by deleting cookies and resetting sessions
 * @param req
 * @param res
 * @returns {*}
 */
const signout = (req, res) => {

  res.clearCookie("t");//clear cookie "t" defined in signin function

  return res.status("200").json({ //return success message
    message: "signed out",
  });
};

//use the express.jwt() function to check if the user is signed in
const requireSignin = expressjwt({
  secret: config.jwtSecret,
  userProperty: "auth",
  algorithms: ["sha1", "RS256", "HS256"],
});

/**
 * Ensure a user has the authorization to access requested resources
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
const hasAuthorization = (req, res, next) => {

  //check that request has a profile and is authorized, then make sure that the profile's id == the authorization id
  const authorized = req.profile && req.auth && req.profile._id == req.auth._id;

  //return error if unauthorized
  if (!authorized) {
    return res.status(403).json({
      error: "User is not authorized",
    });
  }

  //if authorized, call next
  next();
};

export default {
  signin,
  signout,
  requireSignin,
  hasAuthorization,
};
