const Coupon = require('../../models/couponSchema')

module.exports ={

    getCoupons: async(req,res)=>{
        try{

            const coupons = await Coupon.find({})

            res.render('admin/coupon',{title:'Coupons',coupons})
        }catch(err){
            cosnole.log(err)
        }
    },

    postAddCoupons : async(req,res)=>{
        try{
            const {couponCode,minPurchaseAmount,discountAmount,description,expiryDate,discountPercentage} = req.body
            const Couponcode = couponCode.toUpperCase()
            if(couponCode===''||minPurchaseAmount===null||discountAmount===null||description===''||expiryDate===null){
                res.json({incorrect:true})
                return
            }
            const check = await Coupon.findOne({couponCode:Couponcode})
            if(check) {
                res.json({exists: true})
                return 
            }
            const coupon = await Coupon.create({
                couponCode:couponCode.toUpperCase(),
                minPurchaseAmount,
                discountAmount,
                description,
                expiryDate,
                discountPercentage

            })
            if(coupon) res.json({exists:false, msg:'Coupon Added Successfully'})
        }catch(err){
            console.log(err)
        }
    },

    getEditCoupon : async(req,res)=>{
        try{
            const couponid = req.params.couponid
            const coupon = await Coupon.findOne({_id:couponid})
            res.json(coupon)

        }catch(err){
            console.log(err)
        }
        
    },

    postEditCoupon : async(req,res)=>{
        try{
            const {couponCode,minPurchaseAmount,discountAmount,description,coupnid,expiryDate,discountPercentage} = req.body
            const coupon = couponCode.toUpperCase()
            const expiry = new Date(expiryDate)
            const currentDate = new Date();
            console.log(currentDate)
            if(currentDate>expiry){
                res.json({msg: 'Plese select a future date', icon:'error'})
                return 
            }
            let check = await Coupon.findOne({couponCode: coupon})
            if(check._id != coupnid){
                res.json({msg:'Coupon Code Exist', icon:'warning'})
                return
            }
            await Coupon.updateOne({_id:coupnid},{$set:{couponCode:coupon,minPurchaseAmount,discountAmount,expiryDate,description,discountPercentage}})
            res.json({msg:'Coupon Updated Successfully', icon:'success'})
            
        }catch(err){
            console.log(err)
        }
        
    },

    postDeleteCoupon: async(req,res)=>{
        try{
            await Coupon.deleteOne({_id:req.body.couponid})
            res.json({msg:'Coupon Deleted'})
        }catch(err){
            console.log(err)
        }
    },

    postApplyCoupon : async(req,res)=>{
        try {
            // chekcing the coupon already applied
            if(req.session.couponCode==req.body.CouponCode){
                res.json({appied:true})
                return
            }
            const coupon = await Coupon.findOne({ couponCode: req.body.CouponCode });
            if (coupon) {
      
                // Coupon exists, now check if it has expired
                const currentDate = new Date();
                const expiryDate = new Date(coupon.expiryDate);
                
                if (expiryDate < currentDate) {
                    // Coupon has expired
                    res.json({ exist: true, expired: true, msg: 'Coupon has expired' });
                } else {
                    let cartPricing = req.session.CartPrice

                    if(cartPricing.totalprice>=coupon.minPurchaseAmount){

                        const value = cartPricing.totaldiscount;
                        const percentage = coupon.discountPercentage / 100; // Convert percentage to decimal (20% = 0.20)
                        let discount = value * percentage;
                        if(discount>coupon.discountAmount) discount = coupon.discountAmount
                        let total = cartPricing.totaldiscount - discount;
                        cartPricing.totaldiscount = total
                        req.session.couponDiscount=discount;
                   
                        req.session.couponCode=coupon.couponCode
                        res.json({couponApplied : true, totaldiscount: total,coupondiscount : discount, msg:'Coupon Applied',couponcode:coupon.couponCode})
                    }else{
                        res.json({ exist: true, expired: false, msg: 'Min Purchase Amount not Reached' });
                    }
                    
                }
            } else {
                // Coupon does not exist
                res.json({ exist: false, msg: 'Coupon does not exist' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    getAvailableCoupon : async(req,res)=>{
        try{
            const coupons = await Coupon.find({})
            res.json({coupons})
        }catch(err){
            console.log(err)
        }

    },

    postRemoveCoupon: async(req,res)=>{
        try{
            console.log("remove coupon")
            const{couponCode} = req.body
            const coupon = await Coupon.findOne({couponCode})
            const cartpricing = req.session.CartPrice
            

            let total = cartpricing.totaldiscount + req.session.couponDiscount
            cartpricing.totaldiscount = total
            req.session.couponDiscount=0;
            req.session.couponCode=null
            res.json({couponremoved : true, totaldiscount: total,coupondiscount : 0, msg:'Coupon removed'})
            

        }catch(err){
            console.log(err)
        }
    }

}