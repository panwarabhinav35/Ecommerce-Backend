const express = require('express');
const cors = require('cors')
const  mongoose = require('mongoose');
const productsRouter = require('./Routes/Products');
const categoriesRouter = require('./Routes/Category')
const brandsRouter = require('./Routes/Brands')
const server  = express();

//middle-wares
server.use(cors())
server.use(express.json()); // to parse request body
server.use('/products', productsRouter.router)
server.use('/categories', categoriesRouter.router)
server.use('/brands', brandsRouter.router)

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce')
    console.log("database connected")
}

main().catch(err => console.log(err));

server.get('/',(req,res)=>{
    res.json({status : 'success'})
})




server.listen(8080,()=>{
    console.log("Server started")
})

