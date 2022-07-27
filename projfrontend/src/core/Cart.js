import React , {useState,useEffect} from 'react'
import "../styles.css"
import {API} from "../backend"
import Base from './Base'
import Card from './Card'

import { loadCart } from './helper/CartHelper'
import StripeCheckout from './StripeCheckout'

const Cart =()=> {
    const [products, setProducts] = useState([])
    const [reload, setReload] = useState(false)
    
    useEffect(()=>{
        setProducts(loadCart())
    },[reload])
    
    const loadAllProducts  =  (products)=>{
        return(
            <div>
            <h2> This section is to load products in the cart</h2>
            <div>
            {products.map((product,index)=>(
                <Card
                key = {index}
                product ={product}
                addtoCart ={false}
                removeFromCart ={true}
                setReload = {setReload}
                reload = {reload}
                />)
                
            )}
            </div>
            
            </div>
        )
    }


    const loadCheckout  =  ()=>{
        return(
            <div>
            <h2> This section is for checkout </h2>
            
            </div>
        )
    }
    return (
        <Base title='Cart Page' description='Ready to Checkout'>
           
            <div className='row text-center'>
               <div className='col-6'>{products.length>0 ? loadAllProducts(products):
                (<h3>No products in cart</h3>)
            
            }</div>
               <div className='col-6'>
                <StripeCheckout
                products={products}
                setReload ={setReload}
                />

               </div>
            </div>
           
        </Base>
        
    )
}

export default Cart
