const Wallet = require('../../models/walletSchema')
const WalletHistory = require('../../models/walletHistorySchema')

module.exports={

    getWallet : async function(req,res){
        try{
            const userid = req.session.user._id

            const [wallet,walletHistory] = await Promise.all([
                Wallet.findOne({userId:userid}),
                WalletHistory.findOne({userId:userid}).sort({'actions.Date':-1})
            ])
            res.render('user/walletPage',{title:"Wallet",walletbalance:wallet,walletHistory}) 

        }catch(err){
            console.log(err)
        }
    },

    AddWalletAmount: async function(userid,amount,reason,type,orderid=null){
        try{
            const [wallet,history] = await Promise.all([
                Wallet.updateOne({userId:userid},{$inc:{walletAmount:amount}},{upsert:true}),
                WalletHistory.updateOne({userId:userid},{$push:{
                    actions:{
                        amount:amount,
                        type:type,
                        reason:reason,
                        Date : new Date(),
                        orderId:orderid
                    }
                }},
                {upsert:true})
            ])
            return new Promise((resolve,reject)=>{
                if(wallet&&history){
                    resolve("success")
                }else{
                    reject(new Error('Error Occured when updating wallet'))
                }
            })
        }catch(err){
            console.log(err)
        }
        
    },

    RemoveWalletAmount: async function(userid,amount,reason,type,orderid=null){ 
        try{
            const [wallet,history] = await Promise.all([
                Wallet.updateOne({userId:userid},{$inc:{walletAmount:-amount}},{upsert:true}),
                WalletHistory.updateOne({userId:userid},{$push:{
                    actions:{
                        amount:amount,
                        type:type,
                        reason:reason,
                        Date :new Date(),
                        orderId:orderid
                    }
                }},
                {upsert:true})
            ])
            return new Promise((resolve,reject)=>{
                if(wallet&&history){
                    resolve("success")
                }else{
                    reject(new Error('Error Occured when updating wallet'))
                }
            })
        }catch(err){
            console.log(err)
        }
        
    }

}