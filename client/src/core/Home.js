import React from 'react'
import unicornbikeImg from './../assets/images/unicornbike.jpg'
import './../index.css'

export default function Home(){
    return (
        <div className={"text-sm font-medium text-gray-900 fart"}>
          <h6 variant="h6">Home Page</h6>
          <div image={unicornbikeImg} title="Unicorn Bicycle"/>
          <p variant="body2" component="p" color="textSecondary">Photo by <a href="https://unsplash.com/@boudewijn_huysmans" target="_blank" rel="noopener noreferrer">Boudewijn Huysmans</a> on Unsplash</p>
          <div>
            <p variant="body1" component="p">
              Welcome to the MERN Skeleton home page.
            </p>
          </div>
        </div>
    )
}

