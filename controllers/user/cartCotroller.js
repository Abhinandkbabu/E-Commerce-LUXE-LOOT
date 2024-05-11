const Cart=require('../../models/cartSchema')
const Product=require('../../models/productSchema')
const User = require('../../models/userSchema')
const WalletController = require('../../controllers/user/WalletController')
const Wallet = require('../../models/walletSchema')
const mongoose = require('mongoose')

module.exports={

    getCart: async(req,res)=>{
        try{

            const userid = req.session.user._id
            req.session.couponCode=null

            const check = await Cart.findOne({ UserId: new mongoose.Types.ObjectId(userid) })
           
            if(check){
                const updatedCart = await Cart.aggregate([
                    { $match: { UserId: new mongoose.Types.ObjectId(userid) } },
                    {
                        $lookup: {
                            from: "products",
                            localField: "Items.ProductId",
                            foreignField: "_id",
                            as: "product"
                        }
                    },
                    {
                        $addFields: {
                            Items: {
                                $filter: {
                                    input: "$Items",
                                    as: "item",
                                    cond: {
                                        $and: [
                                            { $eq: [{ $arrayElemAt: ["$product.status", { $indexOfArray: ["$product._id", "$$item.ProductId"] }] }, "Active"] }, // Only consider products with status "Active"
                                            { $lte: ["$$item.quantity", { $arrayElemAt: ["$product.stock", { $indexOfArray: ["$product._id", "$$item.ProductId"] }] }] } // Quantity should be less than or equal to stock
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    { $project: { product: 0 } } // Remove the 'product' field from the output
                ]);
                
                // Save the updated cart back to the database 
                await Cart.updateOne({ UserId: new mongoose.Types.ObjectId(userid) }, { $set: { Items: updatedCart[0].Items } });                
            }
          

            
        // const user =await User.findOne({Email:userid})
        
        
        const cart = await Cart.aggregate([
            {
                $match: { UserId: new mongoose.Types.ObjectId(userid) }
            },
            {
                $unwind:'$Items'
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'Items.ProductId',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            {
                $project : {
                    productid: '$Items.ProductId',
                    quantity: '$Items.quantity',
                    product: {$arrayElemAt: ['$product',0]}
                }
            }
        ]);
        
        
        //---------Calculating amount-----------------------
        
       let cartPricing={
        subtotal:0,
        totaldiscount:0,
        totalprice:0,
        totalquantity:0,
       }
        if(cart!=null){
            cart.forEach((item)=>{
                cartPricing.totalprice+=item.product.price*item.quantity;
                cartPricing.totaldiscount+= item.product.discountPrice*item.quantity;
                cartPricing.subtotal=cartPricing.totalprice - cartPricing.totaldiscount;
                cartPricing.totalquantity+=item.quantity
            })
        }
        req.session.CartPrice=cartPricing
        res.render('user/cartPage',{title:'Cart',cart,cartPricing})
        }catch(err){console.log(err)}
    },

    postAddToCart : async(req,res)=>{
        try{
            if(req.session.user.Email){
            const userid=req.session.user;
            const productid= req.params.id
            let product=await Product.findOne({_id:productid})
           
           
            if(product&&product.stock>=1){ //checking the product availability
                const cart= await Cart.findOne({UserId:userid})
                if(cart){//if User already have a cart
            
                    const existingProduct = cart.Items.find(item => item.ProductId.toString() === productid)                                                                                                                 

                    if(existingProduct){ //if the product already in the cart
                        if(existingProduct.quantity < product.stock&&existingProduct.quantity <5){// increase the quantity in the cart
                            await Cart.updateOne(
                                { UserId : userid, 'Items.ProductId' : productid},
                                { $inc: { 'Items.$.quantity' : 1}}
                            );
                            res.json({response:true,user:true,msg:"added",exist:true})
                        }else{
                            res.json({response:false,user:true ,msg:"quatity exeeded " })
                        }
                    }else{
                        await Cart.updateOne(
                            { UserId: userid },
                            {
                                $push: {
                                    Items: {
                                        ProductId: productid,
                                        quantity: 1
                                    }
                                }
                            }
                            )
                            res.json({response:true,user:true,msg:"added",exist:false })
                    }

                }else{//if user dont have a cart

               const firstCart = {
                UserId : userid,
                Items : [
                    {
                        ProductId : req.params.id,
                        quantity : 1
                    }
                ]
                }

               await Cart.create(firstCart)
               res.json({response:true ,user:true ,msg:"Product Added To Cart" })
                }

            }else{
                res.json({response:true ,user:true ,msg:"Out of Stock...!",exist:true })
            }
        }else{
            res.json({response:false,user:false,msg:"login please" })
        }

        }catch (error){
            console.log(error)
        }
    },

    changeQuantity: async(req,res)=>{
        try{
            const{cart,product,count,newQuantity}=req.body
            const userid=req.session.user.Email;
            const user =await User.findOne({Email:userid})
            const checkProduct = await Product.findOne({_id: new mongoose.Types.ObjectId(product)})
            console.log("ahkflahg"+newQuantity)
            if(checkProduct.stock>=newQuantity){

                await Cart.updateOne(
                    { _id : cart, 'Items.ProductId' : product},
                    { $inc: { 'Items.$.quantity' : count}}
                );
                const cartt = await Cart.aggregate([
                    {
                        $match: { UserId: user._id  }
                    },
                    {
                        $unwind:'$Items'  
                    },
                    {
                        $lookup: {
                            from: 'products',
                            localField: 'Items.ProductId',
                            foreignField: '_id',
                            as: 'product'
                        }
                    },
                    {
                        $project : {
                            productid: '$Items.ProductId',
                            quantity: '$Items.quantity',
                            product: {$arrayElemAt: ['$product',0]}
                        }
                    }
                ]);
                
                //---------Calculating amount-----------------------
               
               let cartPricing={
                subtotal:0,
                totaldiscount:0, 
                totalprice:0,
                totalquantity:0,
               }
               console.log(cartPricing)
                if(cartt!=null){
                   
                    cartt.forEach((item)=>{
                        cartPricing.totalprice+=item.product.price*item.quantity;
                    cartPricing.totaldiscount+= item.product.discountPrice*item.quantity;
                    cartPricing.subtotal=cartPricing.totalprice - cartPricing.totaldiscount;
                    cartPricing.totalquantity+=item.quantity
                    })
                }
                req.session.CartPrice=cartPricing
                res.json({success: true ,cartPricing:cartPricing})
            }else{
                res.json({success:false , msg:'Out of Stock...!'})
            }
        }catch(err){
            console.log(err)
        }
    },

    removeCartItem: async(req,res)=>{
       const Id= req.params.id
       const productId=req.params.proId
       try{
            await Cart.updateOne(
                {_id:Id},
                { $pull:{Items:{ProductId: productId} }}
            )
            res.json({success:true})
       }catch(err){
        console.log(err)
       }
    },

    applayWalletAmount: async(req,res)=>{
        try{
    
            const userid = new mongoose.Types.ObjectId(req.session.user._id)
            let { amount } = req.body;
            const walletamount = await Wallet.findOne({userId:userid})
            
            if (walletamount.walletAmount > amount){
                let cartPricing = req.session.CartPrice;
                let total = cartPricing.totaldiscount - amount;
                let discountTotal = cartPricing.subtotal + parseInt(amount)
                cartPricing.subtotal = discountTotal;
                cartPricing.totaldiscount = total;
                req.session.CartPrice=cartPricing
                cartPricing = req.session.CartPrice
                const walletAmount= walletamount.walletAmount-amount
                req.session.walletDiscount = amount
                res.json({success: true ,amount,cartPricing:cartPricing,walletAmount})
                // let wallet = await WalletController.RemoveWalletAmount(userid,amount,'Product Purchase','Debit')
                
                   
                
            }else{
                res.json({success: false, msg:'sorry..! Dont have Enough Money'})
            }
        }catch(err){

        }


    },

    postRemoveWalletAmount: async(req,res)=>{
        try{
            const userid = new mongoose.Types.ObjectId(req.session.user._id)
            let { amount } = req.body;
            const walletamount = await Wallet.findOne({userId:userid})
            
            if (walletamount.walletAmount > amount){
                let cartPricing = req.session.CartPrice;
                let total = cartPricing.totaldiscount + parseInt(amount);
                let discountTotal = cartPricing.subtotal - parseInt(amount)
                cartPricing.subtotal = discountTotal;
                cartPricing.totaldiscount = total;
                req.session.CartPrice=cartPricing
                cartPricing = req.session.CartPrice
                const walletAmount= walletamount.walletAmount 
                req.session.walletDiscount = false
                res.json({success: true ,amount,cartPricing:cartPricing,walletAmount})
            }
        }catch(err){
            console.log(err)
        }
    }
}

