const express = require('express')
const router = express.Router();

const { getAllProducts,
        getProductById,
        createProduct,
        getProduct,
        photo,
        deleteProduct,
        updateProduct,
        getAllUniqueCategories} = require('../controllers/product')
const {isAdmin,isAuthenticated,isSignedIn} = require('../controllers/auth')
const {getUserById} = require('../controllers/user')
const {} = require('../controllers/category')

// all of params
router.param("userId",getUserById)
router.param("productId",getProductById)

// all of actual routes
// create
router.post('/product/create/:userId' ,isSignedIn,isAuthenticated,isAdmin,createProduct)
// read
router.get("/product/:productId",getProduct)
router.get('/product/photo/:productId',photo)

// update
router.put('/product/:productId/:userId',isSignedIn,isAuthenticated,isAdmin,updateProduct)

// delete
router.delete('/product/:productId/:userId',isSignedIn,isAuthenticated,isAdmin,deleteProduct)

// listing route
// use limit
router.get("/products",getAllProducts)

// get all categories
router.get("/products/categories",getAllUniqueCategories)

module.exports = router;