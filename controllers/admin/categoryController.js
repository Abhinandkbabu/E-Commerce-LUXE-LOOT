const Category=require('../../models/catagorySchema')
const Brand=require('../../models/BrandSchema')

module.exports={
    
    getcategory: async(req,res)=>{
       try{
        let category=await Category.find()
        res.render('admin/catagories',{category ,title:'Category'})
       }catch(error){
        console.log(error)
       }
    },
    
    postAddCategory: async(req,res)=>{
        try{
            const Name=req.body.Name.trim()
        const data= await Category.findOne({Name:Name})
        if(data) res.json({success:true,msg:'Category exist'})
        else await Category.insertMany({Name})
        res.json({success:true,msg:'Category Added Successfully'})
        }catch(error){
            
        }
    },

    changeCategoryStatus:async(req,res)=>{
        try{
            const {categoryid,status}=req.body
            await Category.updateOne({_id:categoryid},{$set:{Status:status}})
            res.json({success:true,msg:`Category ${status}`})
        }catch(error){
            console.log(error)
        }
    },
    

}