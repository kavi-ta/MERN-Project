import React,{useState, useEffect} from 'react'
import { isAuthenticated } from '../auth/helper'
import { cartEmpty, loadCart } from './helper/CartHelper'
import {Link} from "react-router-dom"
import StripeCheckoutButton from 'react-stripe-checkout'
import { API } from '../backend'
import {createOrder} from "./helper/OrderHelper"

const StripeCheckout = ({products,
    setReload= f=>f , 
    reload=undefined
})=> {
    const [data, setData] = useState({
        loading:false,
        success:false,
        error:"",
        address:""
    })

    const token = isAuthenticated() && isAuthenticated().token
    const userId = isAuthenticated() && isAuthenticated().user._id

    const getFinalPrice = ()=>{
        let amount = 0
        products.map(p=>{
            amount = amount+ p.price
        })
        return amount;
    }

    const makePayment= token =>{
        console.log("didnt execute")
        const body={
            token,
            products
        }
        const headers = {
            "Content-Type": "application/json"
        }
        return fetch(`${API}/stripepayment`,{
            method:"POST",
            headers:headers,
            body:JSON.stringify(body)
        }).then(response=> {
            console.log(response)
            // calll further methods
            const {status} = response
            console.log("STATUS", status)
            const orderData = {
                products:products,
                transaction_id: response.transaction.id,
                amount:response.transaction.amount
            }
            createOrder(userId, token, orderData)
            cartEmpty(()=>{
                console.log("Did we got a crash?")
            })
            setReload(!reload)
        }).catch(error=> console.log(error))
    }

    
    const showStripeButton = ()=>{
        return isAuthenticated()?  
        (
            <StripeCheckoutButton
            stripeKey="pk_test_51LJMTWSFz3Eb75LpGSyAb9WCLFmvCdUjkakUjrap8yPqHaT3QInWoHKdpxPGU4AMsZO4EPVPdbxGKvsv5VL9QUZV00tr512VKH"
            token={makePayment}
            amount={getFinalPrice()*100}
            name = "Buy Tshirts"
            shippingAddress
            billingAddress
            >
            <button className='btn btn-success'>Pay with Stripe</button>
            </StripeCheckoutButton>
            )
        :
        (
            <Link to="/signin">
                <button className='btn btn-warning'>Signin
                </button>
            </Link>
        )
    }

    return (
    <div>
        <h3 className="text-white">Stripe Checkout {getFinalPrice()}
        </h3>
        {showStripeButton()}
    </div>
  )
}

export default StripeCheckout