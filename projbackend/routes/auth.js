//creating routes 
var express = require('express')
var router = express.Router()
const { check, validationResult } = require('express-validator');
//controllers
const {signout,signup,signin,isSignedIn}  = require('../controllers/auth.js')


// router.post('/signup',[
//     check("name",'name should be atleast 3 characters').isLength({ min:3}),
//     check("email",'email is required').isEmail,
//     check("password",'password should be atleast 3 characters').isLength({ min:3})
// ],
// signup)
router.post(
    "/signup",
    [
      check("name", "Name should be atleast 3 Characters").isLength({ min: 3 }),
      check("email", "Email is required").isEmail(),
      check("password", "Password should be atleast 5 Characters").isLength({
        min: 5}),
    ],
    signup
  );

  router.post(
    "/signin",
    [
      check("email", "Email is required").isEmail(),
      check("password", "Password is required").isLength({
        min: 1}),
    ],
    signin
  );

router.get('/signout', signout)
router.get("/testroute", isSignedIn,(req,res)=>{
  res.json(req.auth);
})



//throwing the routes outside
module.exports = router;