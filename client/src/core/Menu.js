import React from 'react'
import auth from './../auth/auth-helper'
import {Link, useLocation, useNavigate} from 'react-router-dom'

const Menu = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const isActive = (location, path) => {
    if (location.pathname == path)
      return {color: '#ff4081'}
    else
      return {color: '#ffffff'}
  }
  
  return (
    
  <div position="static">
    <div>
      <h6 variant="h6" color="inherit">
        MERN Skeleton
      </h6>
      <Link to="/">
        <button aria-label="Home" style={isActive(location, "/")}>
          home
        </button>
      </Link>
      <Link to="/users">
        <button style={isActive(location, "/users")}>Users</button>
      </Link>
      {
        !auth.isAuthenticated() && (<span>
          <Link to="/signup">
            <button style={isActive(location, "/signup")}>Sign up
            </button>
          </Link>
          <Link to="/signin">
            <button style={isActive(location, "/signin")}>Sign In
            </button>
          </Link>
        </span>)
      }
      {
        auth.isAuthenticated() && (<span>
          <Link to={"/user/" + auth.isAuthenticated().user._id}>
            <button style={isActive(location, "/user/" + auth.isAuthenticated().user._id)}>My Profile</button>
          </Link>
          <Link to={"/prompts/" + auth.isAuthenticated().user._id}>
            <button style={isActive(location, "/user/" + auth.isAuthenticated().user._id)}>Prompts</button>
          </Link>
          <button color="inherit" onClick={() => {
              auth.clearJWT(() => location('/'))
            }}>Sign out</button>
        </span>)
      }
    </div>
  </div>
)
    }
// )

export default Menu
