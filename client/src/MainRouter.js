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
import TwNav from './core/TwNav'

const MainRouter = () => {
    return (<div>
      {/* <Menu /> */}
      <TwNav />
      <Routes>
        <Route exact path="/" element={<Home/>}/>
        <Route path="/users" element={<Users/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/signin" element={<Signin/>}/>
        <Route path="/user/edit/:userId" element={
          <PrivateRoute element={<EditProfile/>}/>
        }/>
        <Route path="/user/:userId" element={<Profile/>}/>
        <Route path="/prompts/:userId" element={<Prompts/>}/>
      </Routes>
    </div>)
}

export default MainRouter
