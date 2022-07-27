
require('dotenv').config()
const mongoose = require('mongoose');
const express = require('express');
const app = express();
//middle wares
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')


// my routes
const authRoutes = require('./routes/auth.js')
const userRoutes = require('./routes/user.js')
const categoryRoutes = require('./routes/category.js')
const productRoutes = require('./routes/product.js')
const orderRoutes = require('./routes/order.js')
const stripeRoutes = require("./routes/stripepayment.js")




//DB connection
mongoose.connect(process.env.DATABASE,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
}).then(()=> {
    console.log("DB CONNECTED")
})

//adding middle ware
//since we are using expresswe use app.use()
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())

//ROUTER
app.use('/api',authRoutes)
app.use('/api',userRoutes);
app.use('/api',categoryRoutes);
app.use('/api',productRoutes);
app.use('/api',orderRoutes);
app.use('/api',stripeRoutes)


//PORT
const port = process.env.PORT || 8000;
//STARTING a server
app.listen(port,()=>{
    console.log(`app is running at ${port}`);
})
