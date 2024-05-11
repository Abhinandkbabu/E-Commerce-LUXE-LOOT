const User=require('../../models/userSchema')
const Wallet = require('../../models/walletSchema')
module.exports={
    getCheckout: async(req,res)=>{
        try{
            const cart=req.session.CartPrice
            const email=req.session.user.Email
            const userid=req.session.user._id
            const [user,wallet] = await Promise.all([
                User.findOne({Email:email}),
                Wallet.findOne({userId:userid})
            ])           
            const Address=user.Address
            let walletAmount=0
            if(wallet){
                walletAmount=wallet.walletAmount
            }
            req.session.WalletAmount=walletAmount
            res.render('user/checkOut',{title:'Check Out',cart,Address,walletAmount})
        }catch(err){
            console.log(err)
        }
    },
    
} 