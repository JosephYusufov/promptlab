import React, {useState} from 'react'
import {create} from './api-user.js'
import {Link} from 'react-router-dom'

export default function Signup() {
  const [values, setValues] = useState({
    name: '',
    password: '',
    email: '',
    open: false,
    error: ''
  })

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value })
  }

  const clickSubmit = () => {
    const user = {
      name: values.name || undefined,
      email: values.email || undefined,
      password: values.password || undefined
    }
    create(user).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error})
      } else {
        setValues({ ...values, error: '', open: true})
      }
    })
  }

    return (<div>
      <div>
        <div>
          <h6 variant="h6">
            Sign Up
          </h6>
          <input id="name" label="Name" value={values.name} onChange={handleChange('name')} margin="normal"/><br/>
          <input id="email" type="email" label="Email" value={values.email} onChange={handleChange('email')} margin="normal"/><br/>
          <input id="password" type="password" label="Password" value={values.password} onChange={handleChange('password')} margin="normal"/>
          <br/> {
            values.error && (<p component="p" color="error">
              <div color="error">error</div>
              {values.error}</p>)
          }
        </div>
        <div>
          <button color="primary" variant="contained" onClick={clickSubmit}>Submit</button>
        </div>
      </div>
      <div open={values.open} disableBackdropClick={true}>
        <div>New Account</div>
        <div>
          <div>
            New account successfully created.
          </div>
        </div>
        <div>
          <Link to="/signin">
            <button color="primary" autoFocus="autoFocus" variant="contained">
              Sign In
            </button>
          </Link>
        </div>
      </div>
    </div>
    )
}