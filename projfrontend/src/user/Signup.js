import React, {useState} from "react"
import Base from "../core/Base"
import {Link} from "react-router-dom"
import { signup } from "../auth/helper"

// user name:Danny emial:h@hitesh.com password:abcdefg
const Signup = ()=>{
    const [values, setValues] = useState({
        name:"",
        email:"",
        password:"",
        error:"",
        success:false
    })
    // destructure the values.
    const {name,email,password,error,success} = values

    const handleChange = (name)=>(event)=>{
        setValues({...values,error:false, [name]:event.target.value})
    }

    const onSubmit = event =>{
        event.preventDefault()
        setValues({...values,error:false})
        // signup comes from auth helper file
        signup({name,email,password})
        .then(data => {
            // data has either value or error
            if(data.error){
                setValues({...values,error:data.error,success:false})
            }
            else{
                setValues({
                    ...values, 
                    name:"",
                    email:"",
                    password:"",
                    error:"",
                    success:true
                })
            }
        })
        .catch(console.log("Error in signup"))
    }
    // reusable
    const signUpForm = ()=>{
        return (

            <div className="row">
                <div className="col-md-6 offset-sm-3 text-left">
                    <form >
                        <div className="form-group">
                            <label className="text-light">
                            Name
                            <input className= "form-control" 
                            onChange={handleChange("name")} 
                            type="text"
                            value={name}/>
                            </label>
                        </div>
                        <div className="form-group">
                            <label className="text-light">
                            Email
                            <input className= "form-control" 
                            onChange={handleChange("email")}
                            type="text"
                            value={email}/>
                            </label>
                        </div>
                        <div className="form-group">
                            <label className="text-light">
                            Password
                            <input className= "form-control" 
                            onChange={handleChange("password")}
                            type="password"
                            value={password}/>
                            </label>
                        </div>
                        <button 
                        onClick={onSubmit}
                        className="btn btn-success btn-block">
                        Submit
                        </button>
                    </form>
                </div>
            </div>
        )

    }

    const successMessage = ()=>{
        return (
        <div className="row">
            <div className="col-md-6 offset-sm-3 text-left">
                <div 
                className="alert alert-success"
                style={{display:success ? "":"none"}}>
                New Account was Created successfully.
                Please <Link to="/signin">Login here</Link>
                </div>
            </div>
        </div>
        )
    }

    const errorMessage = ()=>{
        return (
            <div className="row">
                <div className="col-md-6 offset-sm-3 text-left">
                    <div 
                    className="alert alert-danger"
                    style={{display:error ? "":"none"}}>
                    {error}
                    </div>
                </div>
            </div>
        )
        
        
    }

    return (
        <Base title="Signup Page" description="A page for user to signup!">   
            {successMessage()}
            {errorMessage()}
            {signUpForm()}
            <p className="text-white text-center">{JSON.stringify(values)}</p>
        </Base>
    )
}

export default Signup
