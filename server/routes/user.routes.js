import express from 'express'
import userCtrl from '../controllers/user.controller.js'
import authCtrl from '../controllers/auth.controller.js'

//create router object
const router = express.Router()

//list or create users
router.route('/api/users')
  .get(userCtrl.list) //list all users
  .post(userCtrl.create) //create a user

//view a user, update, or delete their information
router.route('/api/users/:userId')
  .get(authCtrl.requireSignin, userCtrl.read) //see a user's profile if they're signed in
  .put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.update) //update user profile
  .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.remove) //delete a user profile


router.param('userId', userCtrl.userByID) //define parameter userId

export default router
