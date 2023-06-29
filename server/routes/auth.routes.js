import express from 'express'
import authCtrl from '../controllers/auth.controller.js'

//create Router object
const router = express.Router()

//create post and get options for when a user signs in
router.route('/auth/signin')
  .post(authCtrl.signin)
router.route('/auth/signout')
  .get(authCtrl.signout)

export default router
