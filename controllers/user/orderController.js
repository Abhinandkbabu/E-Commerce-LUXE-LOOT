const Order = require("../../models/orderSchema");
const Cart = require("../../models/cartSchema");
const User = require("../../models/userSchema");
const mongoose = require("mongoose");
const moment = require("moment-timezone");
const Product = require("../../models/productSchema");
const createRazorpayOrder = require('../../controllers/user/razorPayController');
const Wallet = require('../../controllers/user/WalletController')
const {generateInvoice} = require('../../utility/generateInvoice')


module.exports = {
  placeOrder: async (req, res) => {
    try {
      const addressId = new mongoose.Types.ObjectId(req.body.selectedAddress);
      const userid = new mongoose.Types.ObjectId(req.session.user._id);
      const user = await User.aggregate([
        { $unwind: "$Address" },
        { $match: { "Address._id": addressId } },
      ]);
      const address = user[0].Address;
      const cart = await Cart.findOne({ UserId: userid }).populate('Items.ProductId');
      
      const updatedProducts = cart.Items.map(item => {
        return {
            ...item,
            price: item.ProductId.discountPrice 
        };
    });
   
      for (let i = 0; i < cart.Items.length; i++) {
        await Product.updateOne(
          { _id: cart.Items[i].ProductId },
          { $inc: { stock: -cart.Items[i].quantity } },
          { new: true }
        );
      }
      const totelAmount = req.session.CartPrice.totalprice;
      const discountAmount = req.session.CartPrice.totaldiscount;
      const subTotal=req.session.CartPrice.subtotal

      // date setting------------------------------------------
      const currentDate = moment().tz("Asia/Kolkata").format("L LT");

      // delivery date ----------------------------------------
      const deliveryDate = moment()
        .add(4, "days")
        .tz("Asia/Kolkata")
        .format("L LT");

        const couponCode = req.session.couponCode ? req.session.couponCode : "";
        const coupondiscount = req.session.couponDiscount ? req.session.couponDiscount : 0
        

        const order = await Order.create({ 
          userid: userid,
          products: updatedProducts,
          address: address,
          orderDate: currentDate,
          expectedDeliveryDate: deliveryDate,
          paymentMethod: req.body.paymentMethod,
          PaymentStatus: "Pending",
          orderStatus: "Order Processing",
          totalAmount: totelAmount,
          discountAmount:subTotal ,
          subTotal: discountAmount,
          couponCode: couponCode,
          couponDiscount: coupondiscount
        });
        
        // start cash on delivery
      if(req.body.paymentMethod== 'Cash on Delivery'&&order){
        if(req.session.walletDiscount){
          await WalletController.RemoveWalletAmount(userid,amount,'Product Purchase','Debit',order._id)
        }
        res.json({ success: true,paymentMethod:'Cash on Delivery'});
        await Cart.deleteOne({UserId:userid})
    }//end cash on delivery..........................
    else if(req.body.paymentMethod== 'RazorPay'&&order){
      if(req.session.walletDiscount){
        await WalletController.RemoveWalletAmount(userid,amount,'Product Purchase','Debit',order._id)
      }
      await Cart.deleteOne({UserId:userid})
        createRazorpayOrder(order._id+'',discountAmount).then(oorder=>{
          res.json({success:true,order:oorder,paymentMethod:'Online',address,name:req.session.user.Email,orderid:order._id})
        }).catch(err=>{
          res.json({success:false,err:err,paymentMethod:'Online'})
        })
    }else if(req.body.paymentMethod=='Wallet'){
      await Cart.deleteOne({UserId:userid})
      await Order.updateOne({_id:order._id},{$set:{PaymentStatus:'Payment Successful'}})
      Wallet.RemoveWalletAmount(userid,discountAmount,'Purchase','Debit',order._id).then(wallet=>{
        res.json({ success: true,paymentMethod:'Cash on Delivery'});
      }).catch(err=>{
        res.json({success:false,err:err,paymentMethod:'Cash on Delivery'})
      })
        
      
    }


    } catch (err) {
      console.log(err);
    }
  },

  getOrders: async (req, res) => {
    try {
      const userid = new mongoose.Types.ObjectId(req.session.user._id);
      const order = await Order.find({ userid: userid }).populate(
        "products.ProductId"
      ).sort({orderDate:-1})
      
      res.render("user/orders", {title:'Orders', order });
    } catch (err) {
      console.log(err);
    }
  },

  getViewOrder: async (req, res) => { 
    try {
      const orderid = new mongoose.Types.ObjectId(req.params.id);

      const order = await Order.findOne({ _id: orderid }).populate(
        "products.ProductId"
      );
      res.render("user/viewOrder", {title:order._id, order });
    } catch (err) {
      console.log(err);
    }
  },

  cancelOrder: async (req, res) => {
    try {
      const id = req.params.id;
      const canceledOrder = await Order.findById(id);
      if (!canceledOrder) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }
      
      // Update order status
      canceledOrder.orderStatus = 'Canceled';
      canceledOrder.products.forEach(product => {
        product.OrderStatus = 'Canceled';
      });
      await canceledOrder.save();
  
      // Increment stock for each product in the canceled order
      for (const productInfo of canceledOrder.products) {
        const productId = productInfo.ProductId;
        const quantity = productInfo.quantity;
        // Find the product and update its stock
        await Product.updateOne(
          { _id: productId },
          { $inc: { stock: quantity } } // Increment stock by the quantity of the canceled order
        );
      }
  
      res.json({ success: true, message: 'Order canceled successfully' });
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  },

  singleOrderCancel: async (req, res) => {
    try {
      const orderId = req.params.orderid;
      const productId = req.params.productid;
     
      const cancel = await Order.updateOne(
        { _id: orderId, "products.ProductId": productId },
        { $set: { "products.$.OrderStatus": "Canceled" } },
        { new: true }
      );

      // Find the canceled order
      const order = await Order.findById(orderId);
        let price=0
      order.products.forEach(product=>{
        console.log(product)
        if(String(product.ProductId) === productId) price=product.price
      })
      //wallet
      if(order.PaymentStatus=='Payment Successful') await Wallet.AddWalletAmount(req.session.user._id,price,"Order Canceld",'Credit',order._id)
      
      // Get the canceled product's quantity
      const canceledProduct = order.products.find(product => String(product.ProductId) === productId);
      const canceledQuantity = canceledProduct.quantity;

      // Increment the stock of the canceled product
      await Product.updateOne(
        { _id: productId },
        { $inc: { stock: canceledQuantity } } // Increment stock by the canceled quantity
      );
    
      // Check if all products in the order are canceled
      const allCanceled = order.products.every(product => product.OrderStatus === "Canceled");
      if (allCanceled) {
        // Update total order status to "Canceled"
        await Order.findByIdAndUpdate(orderId, { orderStatus: "Canceled" }, { new: true });
      }
    
      res.json({ success: true });
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  },

  getSingleOrder:async(req,res)=>{
    try{
      if(req.session.user){
        res.json({success:true})
      }else{
        res.json({success:false})
      }
    }catch(err){
      console.log(err)
    }
  },

  postSingleOrder:async(req,res)=>{
    try{
        const addressId = new mongoose.Types.ObjectId(req.body.addressid); 
        const productid=new mongoose.Types.ObjectId(req.body.productid);
        const userid = new mongoose.Types.ObjectId(req.session.user._id);
        const quantity=req.body.quantity

      const user = await User.aggregate([
        { $unwind: "$Address" },
        { $match: { "Address._id": addressId } },
      ]);
      const address = user[0].Address;
      const product=[{
        ProductId:productid,
        quantity:req.body.quantity
      }]
      
        await Product.updateOne(
          { _id: productid },
          { $inc: { stock: -quantity } },
          { new: true }
        );
      
      const totelAmount = req.body.totalPrice
      const discountAmount = req.body.discountPrice
      const subTotal= req.body.subtotal

      // date setting------------------------------------------
      const currentDate = moment().tz("Asia/Kolkata").format("L LT");

      // delivery date ----------------------------------------
      const deliveryDate = moment()
        .add(4, "days")
        .tz("Asia/Kolkata")
        .format("L LT");  

      const order = await Order.create({ 
        userid: userid,
        products: product,
        address: address,
        orderDate: currentDate,
        expectedDeliveryDate: deliveryDate,
        paymentMethod: req.body.paymentMethod,
        PaymentStatus: "Pending",
        orderStatus: "Order Processing",
        totalAmount: totelAmount,
        discountAmount: discountAmount,
        subTotal: subTotal
      });

      
      if (order&&req.body.paymentMethod=='Cash on Delivery') {
        res.json({ success: true,paymentMethod:'Cash on Delivery'});
      }else if(req.body.paymentMethod == 'RazorPay'&&order){
        createRazorpayOrder(order._id+'',discountAmount).then(order=>{
          res.json({success:true,order:order,paymentMethod:'Online',address,name:req.session.user.Email})
        }).catch(err=>{
          res.json({success:false,err:err,paymentMethod:'Online'})
        })
    }
      
    }catch(err){
      console.log(err)
    }
  },

  postReturnOrder: async(req,res)=>{
    const {returnReason,orderId,productId} = req.body
    try {
      const order = await Order.findById(orderId);
      if (!order) {
          throw new Error("Order not found");
      }

      const productIndex = order.products.findIndex(product => product.ProductId.toString() === productId);
      let price=0
      if (productIndex === -1) {
          throw new Error("Product not found in the order");
      }

      order.products[productIndex].returnReason = returnReason;
      order.products[productIndex].OrderStatus='Requested Return'
      order.returnRequest = "Yes";
      price=order.products[productIndex].price
      if(order.PaymentStatus=='Payment Successful') await Wallet.AddWalletAmount(req.session.user._id,price,"Product Canceld",'Credit',order._id)
      const cancel=await order.save();
      if(cancel){
        res.json({success:true,msg:'Return Request Submited'})
      }
  } catch (error) {
      console.error("Error updating return reason:", error);
  }
  },

  getSuccess: async(req,res)=>{
    try{
      res.render('user/paymentSuccess',{title:'Success'})
    }catch(err){
      console.log(err)
    }
  },

verifyPayment: async(req,res)=>{
  const Crypto = require('crypto')
  try{
    let hmac = Crypto.createHmac('sha256',process.env.RZRP_SECRET)
    hmac.update(req.body.response.razorpay_order_id + "|" + req.body.response.razorpay_payment_id)
    hmac=hmac.digest('hex')
    if(hmac==req.body.response.razorpay_signature){
      await Promise.all([
          Order.updateOne({_id:req.body.order.receipt},{$set:{PaymentStatus:'Payment Successful'}}),
          Cart.deleteOne({UserId:new mongoose.Types.ObjectId(req.session.user._id)})
      ]) 
      res.json({success:true,paymentMethod:'Online'})
    }
    else res.json({success:false,paymentMethod:'Online'})
  }catch(err){
    console.log(err)
  }
  
},

getRepayment: async(req,res)=>{
  try{
    const PreOrder = await Order.findOne({_id:req.params.orderid})
    createRazorpayOrder(PreOrder._id+'',PreOrder.subTotal).then(order=>{
      res.json({success:true,order:order,paymentMethod:'Online',address:PreOrder.address,name:req.session.user.Email})
    }).catch(err=>{
      res.json({success:false,err:err,paymentMethod:'Online'})
    })
  }catch(err){
    console.log(err)
  }
  
},

generateInvoice: async(req,res)=>{
  try{
    const {orderid,index }= req.params
    console.log(orderid,index)  
    const orderDeatails = await Order.findOne({_id : orderid}).populate('products.ProductId')
    const deliveriedProducts = orderDeatails.products.filter(product => product.OrderStatus === 'Order Delivered')

    if(orderDeatails){
       const invoicePath = await generateInvoice(orderDeatails,index,deliveriedProducts)
       res.json({
          success : true,
          message : "Invoice genrated successfully"
       })
    }else{
       res.status(500).json({ 
          success: false, 
          message: "Invoice generation failed" 
       });
    }
  }catch(err){
    console.log(err)
  }
},

downloadInvoice : async(req,res)=>{
  try{
    const id = req.params.orderid
         const filepath = `public/invoice/${id}.pdf`
         res.download(filepath,`invoice_${id}.pdf`)
  }catch(err){
    console.log(err)
  }
}

}; 
