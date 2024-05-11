const Cart = require('../models/cartSchema')
const wishlist=require('../models/wishlistSchema')

module.exports= async (req,res,next)=>{
    try{
        if(req.session.user){
            const [cart,Wishlist]=await Promise.all([
                Cart.findOne({UserId:req.session.user._id}),
                wishlist.findOne({userid:req.session.user._id})
            ])
            
           if(cart) res.locals.cartCount=cart.Items.length
           else res.locals.cartCount=0

           if(Wishlist) res.locals.wishlistCount=Wishlist. products.length
           else res.locals.wishlistCount=0

            
            res.locals.username=req.session.user.Name
           
            
        }else{
            res.locals.cartCount=0
            res.locals.wishlistCount=0
            res.locals.username='Gust'
        }
        next()
    }catch(err){
        console.log(err)
    }

}