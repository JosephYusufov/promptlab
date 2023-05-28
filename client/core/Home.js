import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import unicornbikeImg from './../assets/images/unicornbike.jpg'
import './../index.css'

export default function Home(){
    return (
        <div className={"text-sm font-medium text-gray-900 fart"}>
          <h6 variant="h6">Home Page</h6>
          <CardMedia image={unicornbikeImg} title="Unicorn Bicycle"/>
          <Typography variant="body2" component="p" color="textSecondary">Photo by <a href="https://unsplash.com/@boudewijn_huysmans" target="_blank" rel="noopener noreferrer">Boudewijn Huysmans</a> on Unsplash</Typography>
          <CardContent>
            <Typography variant="body1" component="p">
              Welcome to the MERN Skeleton home page.
            </Typography>
          </CardContent>
        </div>
    )
}

