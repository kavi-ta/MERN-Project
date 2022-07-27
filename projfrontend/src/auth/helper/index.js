import {API} from "../../backend"

export const signup = (user)=>{
    return fetch(`${API}/signup`,{
        method:"POST",
        headers:{
            Accept:"application/json",
            "Content-Type":"application/json"
        },
        body: JSON.stringify(user)
    })
    .then( response=>{
        // if the request is a success, whatever response we get 
        // convert it to json and give to frontend
        return response.json();
    })
    .catch(err=>{
        // if there is error console log the error
        console.log(err)
    })
}

export const signin = (user)=>{
    return fetch(`${API}/signin`,{
        method:"POST",
        headers:{
            Accept:"application/json",
            "Content-Type":"application/json"
        },
        body: JSON.stringify(user)
    })
    .then( response=>{
        // if the request is a success, whatever response we get 
        // convert it to json and give to frontend
        return response.json();
    })
    .catch(err=>console.log(err))
    // if there is error console log the error   
}

// method
export const authenticate = (data,next)=>{
    if (typeof window != "undefined"){
        // set the jwt token in localstorage if the user is signedin 
        localStorage.setItem("jwt",JSON.stringify(data))
        next();
    }
}

export const signout = (next)=>{
    if (typeof window != "undefined"){
        // set the jwt token in localstorage if the user is signedin 
        localStorage.removeItem("jwt")
        next();

        return fetch(`${API}/signout`,{
            method:"GET"
        })
        .then(respone =>console.log("Signout Success"))
        .catch(err=> console.log("Error dude! kya karti hai tu!"))
        
    } 
}

// validate if user is signed in  or not

export const isAuthenticated = ()=>{
    if (typeof window == "undefined"){
        return false
    }
    if (localStorage.getItem("jwt")){
        return JSON.parse(localStorage.getItem("jwt"))
    }else{
        return false
    }

}