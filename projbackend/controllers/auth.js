// file name should be same as route file name
//all auth methods are in auth controllers
//export

// name:"XYZ" email:xyz@gmail.com pass:42422
const User = require('../models/user')
const { check, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken')
var expressJwt = require('express-jwt');

exports.signup = (req,res)=>{
   
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg
        })
    }
    const user = new User(req.body) //creating a user object
    user.save((err,user)=>{
        if(err){
            return res.status(400).json({
                err:'NOT able to save user in db'
            })
        }
        res.json({
            name:user.name,
            email:user.email,
            id:user._id
        });

    }) //saved the user in database


}

exports.signin = (req,res)=>{
    const {email,password} = req.body;
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        console.log('inside siging')
        return res.status(422).json({
            error: errors.array()[0].msg
        })
    }
    User.findOne({email},(err,user)=>{
        // if email doesnt exist
        if(err || !user
            ){
            return res.status(400).json({
                error:"User email does not exist"
            })
        }
        // if email found check for password
        if (!user.authenticate(password)){
            return res.status(401).json({
                error:"Email and password do not match"
            })

        }
        // create token
        const token = jwt.sign({_id:user._id},process.env.SECRET)
        // put token in cookie
        res.cookie("token",token,{expire:new Date()+9999})
        // send response to front end
        const {_id,name,email,role} = user;
        return res.json({token,user:{_id,name,email,role}})
    })
}

exports.signout = (req,res)=>{
    res.clearCookie("token")
    res.json({
        message:'User Signedout successfully'
    })
}

// protected routes
exports.isSignedIn = expressJwt({
    // create an object
    secret:process.env.SECRET,
    // set user property
    userProperty:"auth"
});

// custom middlewares
exports.isAuthenticated = (req,res,next)=>{
    // req.profile is set from frontend
    // req.auth is set from isSignedin middleware
    // req.profile._id is set from front end
    let checker = req.profile && req.auth && (req.profile._id == req.auth._id)
    if (!checker){
        // if checker is false
        return res.status(403).json({
            error:"ACCESS DENIED!"
        })
    }

    next();
}

exports.isAdmin = (req,res,next)=>{
    if (req.profile.role===0){
        // regular user
        return res.status(403).json({
            error:"You are not Admin! Access Denied!"
        })
    }
    next();
}





