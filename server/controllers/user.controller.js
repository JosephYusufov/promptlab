import User from '../models/user.model.js'
import {extend} from 'lodash-es'
import errorHandler from './../helpers/dbErrorHandler.js'

/**
 * Create User
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const create = async (req, res) => {

  //create user based on body information
  const user = new User(req.body)
  try { //try and handle saving user to database
    await user.save()
    return res.status(200).json({
      message: "Successfully signed up!"
    })
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

/**
 * Load user and append to req.
 */
const userByID = async (req, res, next, id) => {
  try {
    let user = await User.findById(id)
    if (!user)
      return res.status(400).json({
        error: "User not found"
      })
    req.profile = user
    next()
  } catch (err) {

    return res.status(400).json({
      error: "Could not retrieve user"
    })
  }
}

/**
 * Read a user's information, replacing their hashed password and salt
 * @param req
 * @param res
 * @returns {*}
 */
const read = (req, res) => {
  req.profile.hashed_password = undefined
  req.profile.salt = undefined
  return res.json(req.profile)
}

/**
 * List users names, emails, updated time, and created time
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const list = async (req, res) => {
  try {
    let users = await User.find().select('name email updated created')
    res.json(users)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

/**
 * Update a user's information
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const update = async (req, res) => {
  try {


    let user = req.profile
    user = extend(user, req.body)

    user.updated = Date.now()
    await user.save()
    user.hashed_password = undefined
    user.salt = undefined

    res.json(user)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

/**
 * Deletes user from database
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const remove = async (req, res) => {
  try {
    let user = req.profile
    let deletedUser = await user.remove()
    deletedUser.hashed_password = undefined
    deletedUser.salt = undefined
    res.json(deletedUser)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

export default {
  create,
  userByID,
  read,
  list,
  remove,
  update
}
