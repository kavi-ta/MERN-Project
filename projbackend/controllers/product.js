const Product = require("../models/product")
const formidable = require('formidable')

// using a private variable '_' when we want to use a vraible but dont want to mention its name explicitly
const _ = require("lodash")
// calling the file system
const fs = require('fs')
const { sortBy } = require("lodash")

exports.getProductById = (req,res,next,id)=>{
    Product.findById(id)
    .populate("category")
    .exec((err,product)=>{
        if (err){
            return res.status(403).json({
                error:"Product does not exist"
            })
        }
        // if no error
        req.product = product;
        next()
    })

}

exports.createProduct = (req,res)=>{
    // create a form object
    let form = new formidable.IncomingForm
    // 3 paramteres expected by form
    
    form.keepExtensions = true
    form.parse(req,(err,fields,file)=>{
        if (err){
            
            return res.status(400).json({
                error:"Problem with image"
            })

        }
        // destructure the fields
     
        const {name,description,price,category,stock} = fields
        
        if (
            !name ||
            !description||
            !price||
            !category||
            !stock   
        ){
            
            return res.status(400).json({
                error:"Please include all fields"
            })
            
        }
       
        let product = new Product(fields)


        // handle file here
        // 1. check size
        if (file.photo){
            if(file.photo.size>3000000){
                return res.status(400).json({
                    error:"File size too big!"
                })
            }
            product.photo.data= fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        } 
        // save to the DB
        product.save((err,product)=>{
            if(err){
                return res.status(400).json({
                    error:"Saving product in DB failed"
                })
            } 
            res.json(product)
        })
    })
}

exports.getProduct = (req,res)=>{
    req.product.photo = undefined
    return res.json(req.product)
}

// middle ware to load photo in bg
exports.photo = (req,res,next)=>{
    if (req.product.photo.data){
        // return only if there is a photo
        res.set("Content-Type",req.product.photo.contentType)
        return res.send(req.product.photo.data)
        
    }
    next()

}

// update controllers
exports.updateProduct = (req,res)=>{
    let form = new formidable.IncomingForm
    // 3 paramteres expected by form
    
    form.keepExtensions = true
    form.parse(req,(err,fields,file)=>{
        if (err){
            return res.status(400).json({
                error:"Problem with image"
            })
        }
        // updation code
        let product = req.product;
        // fields is in the formidable
        product = _.extend(product,fields)
        // handle file here
        // 1. check size
        if (file.photo){
            if(file.photo.size>3000000){
                return res.status(400).json({
                    error:"File size too big!"
                })
            }
            product.photo.data= fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        } 
        // save to the DB
        product.save((err,product)=>{
            if(err){
                return res.status(400).json({
                    error:"Updation of product in DB failed"
                })
            } 
            res.json(product)
        })
    })
}   

// delete product
exports.deleteProduct = (req,res)=>{
    let product  = req.product
    product.remove((err,deletedProduct)=>{
        if (err){
            return res.status(400).json({
                error:"Failed to delete the product"
            })
        }
        res.json({
            message:"Deletion was successful",
            deletedProduct
        })
    })
}

// product listing
exports.getAllProducts = (req,res)=>{
    let limit = req.query.limit ? parseInt(req.query.limit) : 8 
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id" 
    Product.find()
    .select("-photo")//dont select photo
    .populate("category")
    .sort([[sortBy,"asc"]])
    .limit(limit)
    .exec((err,products)=>{
        if (err){
            return res.status(400).json({
                error:"No Product Found"
            })
        }
        res.json(products)
    })
}

exports.getAllUniqueCategories= (req,res)=>{
    Product.distinct("category",{},(err,category)=>{
        if(err){
            return res.status(400).json({
                error:"No category found"
            })

        }
        res.json(category)
    })    
}

exports.updateStock = (req,res,next)=>{
    let myOperations = req.body.order.products.map(prod=>{    
        return {
            updateOne:{
                filter : {_id: prod._id},
                update : {$inc:{stock:-prod.count, sold:+prod.count}}
            }
        }
    })
    Product.bulkWrite(myOperations,{},(err,products)=>{
        if(err){
            return res.status(400).json({
                error: "Bulk operation failed!"
            })
        }
        // if no error pass on to next middle ware
        next()

    })
}


