const Order=require('../../models/orderSchema')
const mongoose=require('mongoose')
const Product=require('../../models/productSchema')
const Wallet = require('../../models/walletSchema')
const walletHistory = require('../../models/walletHistorySchema')
const walletUpdate = require('../../controllers/user/WalletController')

module.exports={

    showOrderList: async(req,res)=>{
        const orders=await Order.find({}).sort({orderDate:-1})
        res.render('admin/orders',{title:'Orders',orders:orders})
    },

    getViewOrder: async(req,res)=>{
        try{
            const orderid = req.params.id;
            const order=await Order.findOne({_id:orderid}).populate("products.ProductId")
            res.render('admin/OrderDetails',{title:'Orders',order:order})

        }catch(err){
            console.log(err)
        }
    },

    postApproveRequest : async(req,res)=>{

        const orderId = req.body.orderid;
        const productId = req.body.productid;
         const newOrderStatus = "Return Approved";
        try{
          const [count,product,update,order]= await Promise.all([
              await Order.aggregate([{$unwind:'$products'},{$match:{"products.ProductId": new mongoose.Types.ObjectId(productId)}}]),
              await Product.findOne({_id:new mongoose.Types.ObjectId(productId)}),
              await Order.findOneAndUpdate(
                            { _id: orderId, "products.ProductId": new mongoose.Types.ObjectId(productId) },
                            { $set: { "products.$.OrderStatus": newOrderStatus, returnRequest:'Done' } },
                            { new: true }),
              await Order.findOne({_id:orderId})
              
          ]) 
             
            const quantity= count[0].products.quantity
            product.stock+=quantity
            await product.save()
            const check = order.products.every(item=> item.OrderStatus=='Canceled'|| item.OrderStatus=='Return Approved')
            if(check) order.orderStatus='Order Canceled'
            await order.save() 
            if(order.PaymentStatus=='Payment Successful') await walletUpdate.AddWalletAmount(order.userid,product.price,"Order Returned",'Credit',order._id)
         
            
            if(update&&product){
                res.json({success:true,msg:'order Return accepted'})
            }
        }catch(err){
            console.log(err)
        }
    },

    rejectReturn: async(req,res)=>{
        try{
            const orderId = req.body.orderid;
            const productId = req.body.productid;
            const newOrderStatus = "Return Rejected";
            const rejectreason=req.body.rejectReason

            const update=await Order.findOneAndUpdate(
                { _id: orderId, "products.ProductId": new mongoose.Types.ObjectId(productId) },
                { $set: { "products.$.OrderStatus": newOrderStatus ,"products.$.rejectReason": rejectreason, returnRequest:'Done'} },
                { new: true }) 

            if(update){
                res.json({success:true})
            }

        }catch(err){
            console.log(err)
        }
    },

    postChangeOrderStatus: async (req, res) => {
        try {
        
          const order = await Order.findOne(
            { _id: req.body.orderId }
          );

          order.products.forEach((product)=>{
            if(product.OrderStatus!='Canceled'){
              product.OrderStatus=req.body.newStatus
            }
          })
          order.orderStatus=req.body.newStatus

          if(req.body.newStatus=='Order Delivered'){
            order.PaymentStatus = 'Payment Successful',
            order.deliveryDate = new Date()
          } 
          await order.save()
    
          if (order) {
            res.json({ success: true });
          } else {
            res.json({ success: false });
          }
        } catch (err) {
          console.log(err);
        }
      },

      getReturnRequestedProducts: async(req,res)=>{
        try{
            const order= await Order.aggregate([{$unwind:'$products'},{$match:{'products.OrderStatus':'Requested Return'}},{$lookup:{from:'products', localField:'ProductId',foreignField:'_id',as:'productt'}}])
            console.log(order)
            res.render('admin/viewOrder',{title:'Orders',order:order})
        }catch(err){
            console.log(err)
        }
      }
    

}