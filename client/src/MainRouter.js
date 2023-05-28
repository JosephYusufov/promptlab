import React from 'react'
import {Route, Routes} from 'react-router-dom'
import Home from './core/Home'
import Users from './user/Users'
import Signup from './user/Signup'
import Signin from './auth/Signin'
import EditProfile from './user/EditProfile'
import Profile from './user/Profile'
import Prompts from './prompts/Prompts'
import PrivateRoute from './auth/PrivateRoute'
import Menu from './core/Menu'

const MainRouter = () => {
    return (<div>
      <Menu/>
      <Routes>
        <Route exact path="/" component={Home}/>
        <Route path="/users" component={Users}/>
        <Route path="/signup" component={Signup}/>
        <Route path="/signin" component={Signin}/>
        <Route path="/user/edit/:userId" element={
          <PrivateRoute element={<EditProfile/>}/>
        }/>
        <Route path="/user/:userId" component={Profile}/>
        <Route path="/prompts/:userId" component={Prompts}/>
      </Routes>
    </div>)
}

export default MainRouter
