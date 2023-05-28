import React, { useState, useEffect } from 'react'
import DeleteUser from './DeleteUser'
import auth from './../auth/auth-helper'
import {read} from './api-user.js'
import {Navigate, Link} from 'react-router-dom'

export default function Profile({ match }) {
  const [user, setUser] = useState({})
  const [redirectToSignin, setRedirectToSignin] = useState(false)
  const jwt = auth.isAuthenticated()

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    read({
      userId: match.params.userId
    }, {t: jwt.token}, signal).then((data) => {
      if (data && data.error) {
        setRedirectToSignin(true)
      } else {
        setUser(data)
      }
    })

    return function cleanup(){
      abortController.abort()
    }

  }, [match.params.userId])
  
    if (redirectToSignin) {
      return <Navigate to='/signin'/>
    }
    return (
      <div elevation={4}>
        <h6 variant="h6" >
          Profile
        </h6>
        <div dense>
          <div>
            <p primary={user.name} secondary={user.email}/> {
             auth.isAuthenticated().user && auth.isAuthenticated().user._id == user._id &&
              (<div>
                <Link to={"/user/edit/" + user._id}>
                  <button aria-label="Edit" color="primary">
                  </button>
                </Link>
                <DeleteUser userId={user._id}/>
              </div>)
            }
          </div>
          <div>
            <p primary={"Joined: " + (
              new Date(user.created)).toDateString()}>
          </p>
        </div>
      </div>
      </div>
    )
  }
  