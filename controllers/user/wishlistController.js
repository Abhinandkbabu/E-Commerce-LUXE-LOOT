const Wishlist = require('../../models/wishlistSchema')

module.exports={

    getWishlist: async(req,res)=>{
        try{
            const userid=req.session.user._id
            const data = await Wishlist.findOne({ userid: userid })
                .populate({
                    path: 'products.productid',
                    populate: {
                        path: 'brand',
                        model: 'Brands'
                    }
                });
            res.render('user/wishlist',{title:'Wishlist', data})
        }catch(err){
            console.log(err)
        }

    },

    addToWishlist: async(req,res)=>{
        try{
            if(!req.session.user._id){
                res.json({msg:'Please Login',exist:true ,user:false})
                return 
            }
            const userid=req.session.user._id
            const productid=req.body.productid
            const wishlist = await Wishlist.findOne({userid:userid})
            if(wishlist){
                const product = await Wishlist.findOne({userid:userid,'products.productid':productid})
                if(product){
                    res.json({msg:'Product Exist in Wishlist',exist:true});
                    return
                } 
                else{
                   const p = await Wishlist.updateOne({userid:userid},{$push:{products:{productid:productid}}})
                    if(p){
                        res.json({msg:'Product added to Wishlist',exist:false});
                        return 
                    } 
                    else res.json({msg:'An error occured'})
            } 
            }else{
                const status = await Wishlist.create({
                    userid:userid,
                    products:[{
                        productid:productid
                    }]
                })

                if(status) res.json({msg:'Product added to Wishlist'})
                else res.json({msg:'An error occured'})
            }
        }catch(err){
            console.log(err)
        }
    },

    removeitem: async(req,res)=>{
        try{
            const id=req.session.user._id
            const productid=req.body.productid

            await Wishlist.updateOne({userid:id},{$pull:{products:{productid:productid}}})
            res.json({msg:'Removed from wishlist'})
        }catch(err){
            console.log(err)
        }
    }

}