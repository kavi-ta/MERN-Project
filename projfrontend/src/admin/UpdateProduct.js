import React, {useState , useEffect } from 'react'
import { Link } from 'react-router-dom'
import { isAuthenticated } from '../auth/helper'
import Base from '../core/Base'
import {updateProduct,getProduct, getCategories } from './helper/adminapicall'

const UpdateProduct = ({match,history})=>{
    const {user, token} = isAuthenticated()
    const [values, setValues] = useState({
        name:"",
        description:"",
        price:"",
        stock:"",
        photo:"",
        categories:[],
        category:"",
        loading:false,
        error:"",
        createdProduct:"",
        getaRedirect:false,
        formData:""

    });

    const {name,
        description,
        price,
        stock,
        categories,
        category,
        loading,
        error,
        createdProduct,
        getaRedirect,
        formData
        
    } = values

    const preload = (productId)=>{
        // use the get all categories from helper
        getProduct(productId).then(data=>{
            console.log(data)
           
            if (data.error){
                setValues({...values,error:data.error})
            }
            else{
                preloadCategories();
                setValues({
                    ...values,
                    name:data.name,
                    description:data.description,
                    price:data.price,
                    category:data.category,
                    stock:data.stock,
                    formData:new FormData()
                    

                },
               )
               
                // console.log("CATE:",categories)

            }
        })
    }

    const preloadCategories = ()=>{
        getCategories()
        .then(data=>{
            if(data.error){
                setValues({...values,error:data.error})
            }
            else{
                setValues({
                    categories:data,
                    formData: new FormData()
                })
            }
        })
    }
    useEffect(() => {
    preload(match.params.productId);
    }, [])
    
    
    // todo
    const onSubmit = (event)=>{
        // 
        event.preventDefault()
        setValues({...values,error:"",loading:true})

        updateProduct(match.params.productId,user._id,token,formData)
        .then(data=>{
            if (data.error){
                setValues({...values,error:data.error})
            }
            else{
                setValues({
                    ...values,
                    name:"",
                    description:"",
                    price:"",
                    photo:"",
                    stock:"",
                    loading:false,
                    createdProduct:data.name,
                                })
            }
            setTimeout(()=>(
              history.push('/admin/products')
          ),5000)
        })

    }
    const handleChange = (name)=>(event)=>{
        // 
        const value = name==="photo"? event.target.files[0]: event.target.value
        formData.set(name,value)
        setValues({...values,[name]:value})
    }
    
    const successMessage= ()=>{
        // 
        return(
            <div className='alert alert-success mt-3'
            style={{display : createdProduct? "":"none"}}>
            <h4>{createdProduct} Updated successfully</h4>
            </div>
        )
    }
    const errorMessage =()=>{
        if (error){
            return (
                <h4 className='alert alert-success mt-3'>
                    Failed to update product
                </h4>
            )
        }
    }
    const createProductForm = () => (
        <form >
          <span className="p-2">Post photo</span>
          <div className="form-group ">
            <label className="btn btn-block btn-success m-2">
              <input
                onChange={handleChange("photo")}
                type="file"
                name="photo"
                accept="image"
                placeholder="choose a file"
              />
            </label>
          </div>
          <div className="form-group p-2">
            <input
              onChange={handleChange("name")}
              name="photo"
              className="form-control"
              placeholder="Name"
              value={name}
            />
          </div>
          <div className="form-group p-2">
            <textarea
              onChange={handleChange("description")}
              name="photo"
              className="form-control"
              placeholder="Description"
              value={description}
            />
          </div>
          <div className="form-group p-2">
            <input
              onChange={handleChange("price")}
              type="number"
              className="form-control"
              placeholder="Price"
              value={price}
            />
          </div>
          <div className="form-group p-2">
            <select
              onChange={handleChange("category")}
              className="form-control"
              placeholder="Category"
            >
              <option>Select</option>
              {categories &&  categories.map((cate,index)=>(
                  <option key = {index} value={cate._id}>{cate.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group p-2">
            <input
              onChange={handleChange("stock")}
              type="number"
              className="form-control"
              placeholder="Stock"
              value={stock}
            />
          </div>
          
          <button type="submit" onClick={onSubmit} className="btn btn-outline-success m-2">
            Update Product
          </button>
        </form>
      );

    return (
        <Base
        title="Add a product here!"
        description='Welcome to product creation section'
        className='container bg-info p-4'>
        <Link to ="/admin/dashboard" className='btn btn-md btn-dark mb-3'>Admin Home</Link>

        <div className='row bg-dark text-white rounded'>
            <div className='col-md-8 offset-md-2'>
            {successMessage()}
            {errorMessage()}    
            {createProductForm()}
            
            </div>
        </div>
        </Base>
    )
}

export default UpdateProduct;
