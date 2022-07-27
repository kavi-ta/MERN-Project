import React, {useState,useEffect} from 'react'
import { Redirect } from 'react-router-dom';

import { addItemtoCard, removeItemFromCart } from './helper/CartHelper';
import ImageHelper from './helper/ImageHelper';


const Card = ({
    product,
    addtoCart =true,
    removeFromCart = false,
    // anonymous function called setReload
    setReload = f=>f,
    reload =undefined
    
    }) => {

    const [count, setCount] = useState(product.count)
    const [redirect, setRedirect] = useState(false)
    const cardTitle = product ? product.name:"A photo from pexels"
    const cardDescription = product ? product.description:"Default description"
    const cardPrice = product ? product.price:"DEFAULT"


    const getARedirect = (redirect)=>{
        if(redirect){
            return <Redirect to ="/cart"/>

        }
    }
    const addToCart = ()=>{
        addItemtoCard(product, ()=> setRedirect(true))
        
    }
    const showAddToCard = (addtoCart)=>{
        return (
            addtoCart && (
                <button
                onClick={addToCart}
                className='btn btn-block btn-outline-success mt-2 mb-2'
                >
                Add to Cart
                </button>
            )
        )
    }

    const showRemoveFromCart = (removeFromCart)=>{
        return (
            removeFromCart && (
                <button
                onClick={()=>{removeItemFromCart(product._id)
                    setReload(!reload)
                }}
                className ='btn btn-block btn-outline-success mt-2 mb-2'
                >
                Remove from cart
                </button>
            )
                
            
        )
    }
    return (
      <div className="card text-white bg-dark border border-info ">
      {getARedirect(redirect)}  
      <div className="card-header lead">{cardTitle}</div>
        <div className="card-body">
          <ImageHelper product = {product}/>
          <p className="lead bg-success font-weight-normal text-wrap">
            {cardDescription}
          </p>
          <p className="btn btn-success rounded  btn-sm px-4">$ {cardPrice}</p>
          <div className="row">
            <div className="col-12">
              {showAddToCard(addtoCart)}
            </div>
            <div className="col-12">
              {showRemoveFromCart(removeFromCart)}
            </div>
          </div>
        </div>
      </div>
    );
  };



  export default Card