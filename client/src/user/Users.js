import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import {list} from './api-user.js'

export default function Users() { 
  const [users, setUsers] = useState([])

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    list(signal).then((data) => {
      if (data && data.error) {
        console.log(data.error)
      } else {
        console.log(data)
        setUsers(data)
      }
    })

    return function cleanup(){
      abortController.abort()
    }
  }, [])


    return (
      <div elevation={4}>
        <h6 variant="h6">
          All Users
        </h6>
        <div>
         {users.map((item, i) => {
          return <Link to={"/user/" + item._id} key={i}>
                    <button>
                      <p>{item.name}</p>
                    </button>
                 </Link>
               })
             }
        </div>
      </div>
    )
}
