import Prompt from '../models/prompt.model'
import extend from 'lodash/extend'
import errorHandler from '../helpers/dbErrorHandler'

const create = async (req, res) => {
  let user = req.profile
  let prompt = new Prompt({...req.body, user: user._id})
  try {
    await prompt.save()
    return res.status(200).json({
      message: "Succesfully created a new prompt."
    })
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}


// const read = (req, res) => {
//   req.profile.hashed_password = undefined
//   req.profile.salt = undefined
//   return res.json(req.profile)
// }

// const list = async (req, res) => {
//   let user = req.profile
//   console.log(user)
//   try {
//     let prompts = await Prompt.find().select('name email updated created')
//     res.json(users)
//   } catch (err) {
//     return res.status(400).json({
//       error: errorHandler.getErrorMessage(err)
//     })
//   }
// }

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
  // list,
  // remove,
  // update
}
