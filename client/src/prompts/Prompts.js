import React, { useState, useEffect } from 'react'
import auth from './../auth/auth-helper'
import {Navigate, Link} from 'react-router-dom'

export default function Prompts({ match }) {
  const [prompts, setPrompts] = useState({})
  const [redirectToSignin, setRedirectToSignin] = useState(false)
  const jwt = auth.isAuthenticated()

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

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
          Create a Prompt
        </h6>
        <div dense>
          
        </div>
      </div>
    )
  }