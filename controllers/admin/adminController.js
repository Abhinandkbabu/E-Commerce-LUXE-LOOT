const session=require('express-session')
const User=require('../../models/userSchema')
const Category=require('../../models/catagorySchema')
const Brand=require('../../models/BrandSchema')
require('dotenv').config()
const flash = require('express-flash');


module.exports={

    

    getSignIn: async(req,res)=>{
        try{
            res.render('admin/signIn')
        }catch (error){
            console.log(error)
        }
    },

    postSignIn: async(req,res)=>{
        const Email=req.body.Username
        const Password=req.body.Password
        console.log(Email,Password)
        if(Email==process.env.ADMIN_MAIL&&Password==process.env.ADMIN_LOGIN_PASSWORD){
             req.session.adminloged=true
            res.redirect('/admin')
        }else{
            req.flash('error','Incorrect Username or Password')
            res.redirect('/admin/signin')
        }
    },

    getCostomer:async (req,res)=>{
        await User.find().exec()
       .then((data)=>{
        res.render('admin/customer',{data,title:'Customer'})
       })
       .catch((err)=> console.log(err))
        
    },

    blockUser: async (req,res)=>{
        const id=req.params.id
        await User.updateOne({_id:id},{$set:{Status:'Blocked'}})
        res.json({success:true,msg:'User has been Blocked'})
        
    },

    unBlockUser: async (req,res)=>{
        const id=req.params.id
        await User.updateOne({_id:id},{$set:{Status:'Active'}})
        res.json({success:true,msg:'user has been UnBlocked'})
    },


}