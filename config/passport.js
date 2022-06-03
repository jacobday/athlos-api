const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')        
const User = require('../models/User')
const GoogleUser = require("../models/GoogleUser")

module.exports=function(passport){
    passport.use(
        new GoogleStrategy(
        {
        clientID:process.env.GOOGLE_CLIENT_ID,
        clientSecret:process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'
        },
        async(accessToken,refreshToken,profile,done)=>{
            //console.log(profile)
            var googleUser = {
                googleId:profile.id,
                firstName:profile.name.givenName,
                lastName:profile.name.familyName,
                displayName:profile.displayName,
                email:profile.emails[0].value,
                image:profile.photos[0].value,
                profileType:profile.provider
                
            }
            try{
                console.log(googleUser)
                let user = await GoogleUser.findOne({googleId:profile.id})
                if (user){
                    done(null,googleUser)
                }
                else{
                    googleUser = await GoogleUser.create(googleUser)
                    done(null,googleUser)
                }
            }
            catch(err){
                console.log(err)
            }
        }
    ))
    passport.serializeUser((googleUser,done) => {
        done(null,googleUser.id)
    })
    passport.deserializeUser((id,done)=>{
        GoogleUser.findById(id,(err,googleUser) => done(err,googleUser))
    })
}