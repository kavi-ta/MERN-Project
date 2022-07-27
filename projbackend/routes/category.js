const express = require("express")
const router = express.Router()

// controllers
const {updateCategory,createCategory,getCategoryById,getAllCategory,getCategory,removeCategory} = require("../controllers/category")
const {isSignedIn,isAdmin,isAuthenticated} = require("../controllers/auth")
const {getUserById} = require("../controllers/user")

// params
router.param("userId",getUserById);
router.param("categoryId",getCategoryById);

// actual routes goes here


// post=>create
router.post("/category/create/:userId",isSignedIn,isAuthenticated,isAdmin,createCategory)

// get=>read
router.get("/category/:categoryId",getCategory)
router.get("/categories/",getAllCategory)

// put=>update
router.put("/category/:categoryId/:userId",isSignedIn,isAuthenticated,isAdmin,updateCategory)

// delete
router.delete("/category/:categoryId/:userId",isSignedIn,isAuthenticated,isAdmin,removeCategory)




module.exports = router;
