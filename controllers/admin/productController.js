const Brand=require('../../models/BrandSchema')
const Category=require('../../models/catagorySchema')
const Products=require('../../models/productSchema')
const flash=require('express-flash')
const User = require('../../models/userSchema')
const Wishlist = require('../../models/wishlistSchema')

module.exports={

    getProducts: async(req,res)=>{
        try{
            const data=await Products.find().populate('brand').populate('category')
        res.render('admin/products',{data,title:'Products'}) 
        }
        catch(err){
            console.log("getProduct: "+err);
        }
    },

    getAddProducts:async(req,res)=>{
        try{
            const brand =await Brand.find()
        const category=await Category.find()
        res.render('admin/addProducts',{brand,category,title:'Products'})
        }catch(err){
            console.log("getaddproduct: "+err)
        }
    },

    postAddProduct:async(req,res)=>{
        try{
            const files=req?.files
            console.log(req)
            const images = req.files.map(file => file.filename);
        
        const data={
            productName:req.body.productName,
            brand:req.body.brand,
            price:req.body.price,
            discountPrice:req.body.discountPrice,
            category:req.body.category,
            description:req.body.description,
            specification: req.body.specification,
            stock: req.body.stock,
            color: req.body.color,
            images:images
        }
        await Products.insertMany(data)
        req.flash('msg',`${data.productName} added`)
        req.flash('type','success')
        res.redirect('/admin/addProduct')
        }catch(err){
            console.log(err)
        }
    },

    getEditProduct: async(req,res)=>{
       try{
        const id=req.params.id;
        const data = await Products.findOne({_id:id}).populate('brand').populate('category')
        const brand = await Brand.find()
        const category = await Category.find()
        res.render('admin/editProduct',{data,brand,category,title:'Product'})
       }catch(err){
        console.log(err)
       }
    },

    postEditProduct: async(req,res)=>{
       try{
        const id = req.params.id
        const images=[];
        const proImg=await Products.findOne({_id:id})
        if(proImg){
          images.push(...proImg.images)
        }
      for(let i=0;i<5;i++){
          if(req.files[i]){
             let position=req.files[i].fieldname.split('')
             images[position[5]-1]=req.files[i].filename
          }
      }

      let UpdatedProducts=req.body
      UpdatedProducts.images=images;
      console.log(UpdatedProducts)
      
      const uploaded =await Products.updateOne({_id:id},{$set:{...UpdatedProducts}})

        if (uploaded) {
          res.redirect("/admin/product");
        }


       }catch(err){
        console.log(err)
       }
    },

    getBlockProduct:async(req,res)=>{
        try{
            let id=req.params.id
        await Products.updateOne({_id:id},{$set:{status:'Blocked'}})
        res.json({success:true,msg:"Product has been Blocked"})
        }catch(err){
            console.log("getblockproduct: "+err)
        }
    }, 

    getUnblockProduct:async(req,res)=>{
        try{
            let id=req.params.id
        await Products.updateOne({_id:id},{$set:{status:'Active'}})
        res.json({success:true,msg:"Product has been Unblocked"})
        }catch(err){
            console.log("getunblockproduct :"+err)
        }
    },

    getProductList:async(req,res)=>{
        try{
            
            let page=1
            if(req.params.page!=NaN) page = req.params.page

            const limit = 8 * parseInt(page)
            const start = limit-8
            const length = await Products.countDocuments()
            const totalPages = Math.ceil(length/ 8);
            let wishlist =[]
            if(req.session.user){
                 const wishlistuser= await Wishlist.findOne({userid:req.session.user._id})
                 if(wishlistuser) wishlist = wishlistuser.products.map(obj => obj.productid.toString())
            }
            const [categories,brands,data ] = await Promise.all([
                Category.find({}),
                Brand.find({}),
                Products.aggregate([
                    {
                        $match: { status: 'Active' }
                    },
                    {
                        $lookup: {
                            from: 'brands', // Assuming the name of your brand collection is 'brands'
                            localField: 'brand',
                            foreignField: '_id',
                            as: 'brand'
                        }
                    },
                    {
                        $lookup: {
                            from: 'categories', // Assuming the name of your category collection is 'categories'
                            localField: 'category',
                            foreignField: '_id',
                            as: 'category'
                        }
                    },
                    {
                        $match: {
                            'brand.Status': 'Active',
                            'category.Status': 'Active'
                        }
                    },
                    {$skip:start},
                    {$limit:limit}
                ]),
            ])

            console.log(wishlist)
        res.render('user/productList',{title:'Products',data,totalPages,categories,brands,wishlist})
        }catch(err){
            console.log("getproductlist: "+err)
        } 
    },

    getProductView:async(req,res)=>{
       try{
        const id=req.params.id
        let Address
        if(req.session.user){
            const user= await User.findOne({Email:req.session.user.Email})
            Address=user.Address
        }else{
            Address=[{
                name:"",
         address:"",
      city:"",
      pincode:"",
      state:"",
      mobile:""
            }]
        }
        let product= await Products.findOne({_id:id}).populate('brand')
        res.render('user/productDetails',{title:product.productName,product,Address})
       }catch(err){
        console.log("getproductview: "+err)
       }
    },

    deleteProductImage : async(req,res)=>{
        try{
            const {imageid,productid} = req.body
            await Products.updateOne({_id:productid},{$pull:{images:imageid}})
            res.json({success: true})
        }catch(err){
            console.log(err)
        }
    }

}