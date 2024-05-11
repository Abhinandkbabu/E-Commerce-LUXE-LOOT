const Offer = require('../../models/offerSchema')
const Category = require('../../models/catagorySchema')
const Product = require('../../models/productSchema')
const Referal = require('../../models/referalSchema')

module.exports = {

getOffers : async(req,res)=>{

    const [offers,categories,referal] = await Promise.all([
        Offer.find().populate('category_id'),
        Category.find({}),
        Referal.find({})
    ])
   
    res.render('admin/offers',{categories,offers,referal})
},

addOffer : async(req,res)=>{
    try {
    const {category_id,offerPercentage, expiryDate} = req.body
    if(category_id==''||offerPercentage==''||expiryDate==''){
        res.json({success:false,msg:'Plese Fill the Form'})
        return 
    }
       
    const offerExist = await Offer.findOne({category_id:category_id})

    if(!offerExist){
        await Offer.create(req.body)

        const catgryPrdkt = await Product.find({category:category_id})
            const offerMultiplier = 1 - offerPercentage/100
            
            for(const prdkt of catgryPrdkt){
                const discountPrice = prdkt.discountPrice
                const newPrice = Math.floor(prdkt.discountPrice * offerMultiplier)

                await Product.updateOne(
                    {_id:prdkt._id},
                    {$set:{inCategoryOffer: true, beforeOffer: discountPrice, discountPrice: newPrice,categoryoffer:offerPercentage}},{upsert:true})
            }

            res.json({success:true, msg:'Offer Applied'})

        }else{
            res.json({success:false,msg:'Offer Exist'})
        }

        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
},

getEditOffer : async(req,res)=>{
    try{
        const offerid = req.params.offerid
        const offer= await Offer.findOne({_id:offerid}).populate('category_id')
        res.json(offer)
    }catch(err){
        console.log(err)
    }
},

postEditOffer : async(req,res)=>{
    try{
        const {category_id,offerPercentage,expiryDate,offerid,oldCategory} = req.body

        const check = await Offer.findOne({category_id:category_id})

        if(check&& check.category_id == oldCategory){
            res.json({success:false,msg:'Offer on this category already Exists'})
            return 
        }

        await OfflineAudioContextffer.findByIdAndUpdate(
            offerid,
            {category_id, offerPercentage, expiryDate},
            {new:true}
        )

         // resetting the offer details for the old offer products
         const oldPrdkts = await Product.find({category:oldCategory})
         for(const data of oldPrdkts){
             const beforeOffer = data.beforeOffer
             await Product.findByIdAndUpdate(
                 data._id,
                 {$set:{DiscountAmount:beforeOffer, beforeOffer: 0, inCategoryOffer: true,categoryoffer:offerPercentage}},
                 {new:true}
             )
         }

         //updating offer details on the new offer products
         const newPrdkts = await Product.find({category:category_id})
         const offerMultiplier = 1 - offerPercentage/100
         
         for(const prdkt of newPrdkts){
             const discountPrice = prdkt.discountPrice
             const newPrice = Math.floor(prdkt.discountPrice * offerMultiplier)

             await Product.updateOne(
                 {_id:prdkt._id},
                 {$set:{inCategoryOffer: true, beforeOffer: discountPrice, discountPrice: newPrice}})
         }

         res.json({success:true,msg:'Offer Applied'})
        
    }catch(err){
        cosnole.log(err)
    }
},

deleteOffer : async(req,res)=>{
    
    const offerid = req.body.offerid
    try{
        const ofrData = await Offer.findById(offerid)
        const prdkts = await Product.find({category:ofrData.category_id})

        for(const data of prdkts){
            const beforeOffer = data.beforeOffer
            await Product.findByIdAndUpdate(
                data._id,
                {$set:{discountPrice:beforeOffer, beforeOffer: 0, inCategoryOffer: false,categoryoffer:'0'}},
                {new:true}
            )
        }
        await Offer.findByIdAndDelete(offerid)
        res.json({msg:'Offer Deleted Successfuly'})
    }catch(err){
        console.log(err)
    }
},

addReferalOffeer : async(req,res)=>{
    try{
        const {referalAmount,expiryDate} = req.body;
        if(expiryDate==''){
            res.json({icon:'error',msg:'please Fill the form Currectly'})
            return 
        }
        const currentDate = new Date()
        const check = await Referal.find({ExpairyDate:{$gt:currentDate.toString()}})
        if(check.length!=0){
            res.json({icon:'error',msg:'A Referal offer is Already existing'})
            return
        }
        
        if(expiryDate<currentDate){
            res.json({icon:'warning',msg:'Select a future Date'})
            return 
        }
        await Referal.create({OfferAmount:referalAmount,ExpairyDate:expiryDate})
        res.json({icon:'success', msg:'Offer Added successfully'})

    }catch(err){
        console.log(err)
    }

},

getEditReferalOffer : async(req,res)=>{
    try{
        const offerid = req.params.id
        console.log(offerid)
        let referal = await Referal.findOne({_id:offerid})
        res.json({success:true,referal})
    }catch(err){
        console.log(err)
    }
},

postEdiReferalOffer : async(req,res)=>{
    try{
        const {referalAmount,expiryDate,offerid} = req.body
        const selectedDate = new Date(expiryDate);
        const currentDate = new Date()
        if(selectedDate<currentDate){
            res.json({icon:'error', msg:'Choose Correct Date'})
            return
        }
        await Referal.updateOne({_id:offerid},{$set:{OfferAmount:referalAmount,ExpairyDate:expiryDate}})
        res.json({icon:'success', msg:'offer updated Successfully'})
    }catch(err){
        console.log(err)
    }
},

postDeleteReferalOffer : async(req,res)=>{
    try{
        const offerid = req.body.offerid
        await Referal.deleteOne({_id:offerid})
        res.json({icon:'success',msg:'Offer Deleted Successfully'})
    }catch(err){
        console.log(err)
    }
    
}

}
