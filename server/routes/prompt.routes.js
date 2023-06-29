import express from 'express'
import authCtrl from '../controllers/auth.controller.js'
import userCtrl from '../controllers/user.controller.js'
import promptCtrl from '../controllers/prompt.controller.js'

//create router object
const router = express.Router()

//view prompts belonging to a user given a userId
router.route('/api/prompts/user/:userId')
    .get(authCtrl.requireSignin, authCtrl.hasAuthorization, promptCtrl.list) //list all prompts if a user is signed in and has authorization
    .post(authCtrl.requireSignin, authCtrl.hasAuthorization, promptCtrl.create) //create a prompt if a user is authorized
// .put(authCtrl.requireSignin, authCtrl.hasAuthorization, promptCtrl.update)
// .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, promptCtrl.remove)

router.param('userId', userCtrl.userByID) //define userId parameter

export default router
