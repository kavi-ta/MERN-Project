import React from 'react'
import Menu from './Menu';

const Base 
=({
    title="My title",
    description = "My description",
    className = "bg-dark text-white p-4",
    children
})=> ( 
    <div>
        <Menu/>
        <div className='container-fluid'>
            <div className="jumbotron bg-dark text-white text-center">
                <h2 className='display-4'>{title}</h2>
                <p className='lead'>{description}</p>
            </div>
            <div className={className}>{children}</div>
        </div>
        <footer className='footer position-fixed bg-dark mt-auto py-1'>
            <div className='container-fluid bg-success text-white text-center py-1 '>
                <h7>If you got any questions, feel free to reach out</h7>
                <button className='btn btn-warning btn-sm'>Contact Us</button>
            </div>
            <div className='container'>
                <span className='text-muted'>
                    An amazing <span className='text-white'>MERN</span> bootcamp
                </span>
            </div>
        </footer>
    </div>
)

export default Base;