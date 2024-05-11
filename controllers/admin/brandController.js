const Brand=require('../../models/BrandSchema')
const Product=require('../../models/productSchema')
const flash=require('express-flash')

module.exports={

    getBrands: async(req,res)=>{
        const brand=await Brand.find()
        res.render('admin/brands',{brand,title:'Brands'})
    },

    postAddBrand: async(req,res)=>{
        const Name=req.body.Name.trim()
        const data=await Brand.findOne({Name:Name})
        if(data) res.json({success:true,msg:'Brand exist'})
        else {
            await Brand.insertMany({Name})
            res.json({success:true,msg:'Brand Added Successfully'})
        }
    },

    changeBrandStatus:async(req,res)=>{
        try{
            const {brandid,status}=req.body
            console.log(req.body)
            await Brand.updateOne({_id:brandid},{$set:{Status:status}})
            res.json({success:true,msg:`Category ${status}`})
        }catch(error){
            console.log(error)
        }
    },
}