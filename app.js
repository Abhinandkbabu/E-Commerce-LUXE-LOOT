const { Console } = require('console');
const express = require('express');
const app=express();
const path = require('path');
const nocache = require('nocache');
const userRouter=require("./routers/user");
const adminRouter=require("./routers/admin")
const connectDB=require('./config/dB')
const session = require('express-session');
const multer = require('multer');
const flash = require('express-flash');
const cookieparser = require('cookie-parser');
const morgan = require('morgan')

require('dotenv').config()
connectDB()

app.use(nocache())
app.use(express.static('public'))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(session({
    secret: process.env.SECRET,
    resave: false, 
    saveUninitialized: false,
})) 


app.set('views',path.join(__dirname,'views')) 
app.set('view engine','ejs')

app.use(flash())

app.use(morgan("tiny"))

app.use('/',userRouter) 
app.use("/admin",adminRouter) 


 
 
const PORT=process.env.PORT||7000 
app.listen(PORT,()=> console.log(`Successfully Connected on Port : https://localhost:${PORT}`)) 