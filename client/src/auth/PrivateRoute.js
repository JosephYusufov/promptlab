import React, { Component } from 'react'
import { Route, Navigate } from 'react-router-dom'
import auth from './auth-helper'

// const PrivateRoute = ({ component: Component, ...rest }) => {
  const PrivateRoute = ({ children }) => {
  //  if(auth.isAuthenticated){
  //   return <Route {...rest} render={props => {<Component {...props}/>}}/> 
  //  } else {
  //   return <Route {...rest} render={props => {<Navigate to={{
  //     pathname: '/signin',
  //     state: { from: props.location }
  //   }}/>
  //   }} />
  // }
  auth.isAuthenticated? <> {children} </> : <Navigate to={{pathname: '/signin', state: { /*from: props.location*/ }}}/>
  //  <Route {...rest} 
  //  render={props => (
  //   auth.isAuthenticated() ? (
  //     <Component {...props}/>
  //   ) : (
  //     <Navigate to={{
  //       pathname: '/signin',
  //       state: { from: props.location }
  //     }}/>
  //   )
  // )}
  // />
}

export default PrivateRoute
