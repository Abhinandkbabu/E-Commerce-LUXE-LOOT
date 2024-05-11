const Banner = require('../../models/bannerSchema')

module.exports = {
    getBanner: async(req,res)=>{
        const banner = await Banner.find()
        res.render('admin/Banner',{title:"Banner",banner})
    },

    postAddBanner: async(req,res)=>{
        try{
            const images = req.files.map(file => file.filename);
            const banner = await Banner.create({
                bannerType:req.body.bannerType,
                image:images[0]
            }) 
            if(banner){
                res.json({icon:'success',msg:'Banner added Successfully'})
            }else{
                res.json({icon:'error',msg:'Error Occured while adding Banner'})
            }
        }catch(err){
            console.log(err)
        }

    },

    updateBannerStatus: async(req,res)=>{
        try{
            const{bannerid,status}=req.body
            let check = await Banner.updateOne({_id:bannerid},{$set:{status:status}})
            if(check) res.json({icon:'success',msg:`Banner ${status} successfully`})
            else res.json({icon:'error',msg:'Oops...! Error Occured'})
        }catch(err){
            console.log(err)
        }
    },

    deleteBanner: async(req,res)=>{
        try{
            const {bannerid} = req.body
            let check = await Banner.deleteOne({_id:bannerid})
            if(check) res.json({icon:'success',msg:`Banner deleted successfully`})
            else res.json({icon:'error',msg:'Oops...! Error Occured'})
        }catch(err){
            console.log(err)
        }
    }

}


