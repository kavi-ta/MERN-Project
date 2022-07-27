import React ,{useState,useEffect }from 'react'
import { Link } from 'react-router-dom'
import { isAuthenticated } from '../auth/helper'
import Base from '../core/Base'
import { getCategory, updateCategory } from './helper/adminapicall'

const UpdateCategory=({match,history})=> {
    // useState
    const [name, setName] = useState("")
    const [error, setError] = useState(false)
    const [success,setSuccess]= useState(false)
    
   

    const {user, token} = isAuthenticated()


    // preloading

    const preload = (categoryId)=>{
        getCategory(categoryId)
        .then(data=>{
            if(data.error){
                setError(data.error)
            }
            else{
                setName(data.name)
            }
        })
    }
    useEffect(() => {
    preload(match.params.categoryId);
    }, [])

    const goBack = ()=>{
       return( <div className='mt-5'>
        <Link className='btn btn-sm btn-success mb-3' to="/admin/dashboard">
        Admin Home</Link> 
        </div>)


    }

    

    const onSubmit = (event)=>{
        // 
        event.preventDefault()
        
        setError("")
        setSuccess(false)
        updateCategory(match.params.categoryId,user._id,token,{name})
        .then(data=>{
            if (data.error){
                setError(true)
                console.log(data.error)
            }
            else{
                setError(false)
                setSuccess(true)
                setName("")
            }

            setTimeout(()=>(
                history.push('/admin/categories')
            ),5000)
                
            
        })

    }

    const handleChange =(event)=>{
        // 
        setName(event.target.value)
        setError("")
    }

    const successMessage= ()=>{
        // 
        if(success){
            return <div class="alert alert-primary" role="alert">
            Category Updated Successfully , Redirecting....
          </div>
        }
        
    }
   
    const warningMessage =()=>{
        if (error){
            return (
                <h4 className='alert alert-success mt-3'>
                    Failed to update product
                </h4>
            )
        }
    }
    // create a form
    const myCategoryForm = ()=>(
        <form>
            <div className='form-group'>
                <p className='lead'>Enter the category</p>
                <input type = "text" 
                className='form-control my-3'
                onChange={handleChange}
                value= {name}
                autoFocus
                required
                placeholder='For Ex. Summer'/>
                <button 
                onClick={onSubmit}
                className='btn btn-outline-info'>Update Category</button>

            </div>
        </form>
    )

    
    return (
    <Base title="Update a category here" 
    description='Update category for new tshirts'
    className='container bg-info p-4'
    >
    <div className='row bg-white rounded'>
        <div className=' col-md-8 offset-md-2'>
        {successMessage()}
        
        {warningMessage()}
        {myCategoryForm()}
        {goBack()}
        </div>
    </div>
    
    </Base> 
  )
  
}
export default UpdateCategory