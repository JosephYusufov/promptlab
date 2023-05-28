import React, {useState} from 'react'
import auth from './../auth/auth-helper'
import {Navigate} from 'react-router-dom'
import {signin} from './api-auth.js'

export default function Signin(props) {
  const [values, setValues] = useState({
      email: '',
      password: '',
      error: '',
      redirectToReferrer: false
  })

  const clickSubmit = () => {
    const user = {
      email: values.email || undefined,
      password: values.password || undefined
    }

    signin(user).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error})
      } else {
        auth.authenticate(data, () => {
          setValues({ ...values, error: '',redirectToReferrer: true})
        })
      }
    })
  }

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value })
  }

  const {from} = props.location.state || {
      from: {
        pathname: '/'
      }
  }
  const {redirectToReferrer} = values
  if (redirectToReferrer) {
      return (<Navigate to={from}/>)
  }

  return (
      <div>
        <div>
          <h6 variant="h6">
            Sign In
          </h6>
          <input id="email" type="email" label="Email" value={values.email} onChange={handleChange('email')} margin="normal"/><br/>
          <input id="password" type="password" label="Password" value={values.password} onChange={handleChange('password')} margin="normal"/>
          <br/> {
            values.error && (<p component="p" color="error">
              {/* <Icon color="error" className={classes.error}>error</Icon> */}
              {values.error}
            </p>)
          }
        </div>
        <div>
          <button color="primary" variant="contained" onClick={clickSubmit} >Submit</button>
        </div>
      </div>
    )
}
