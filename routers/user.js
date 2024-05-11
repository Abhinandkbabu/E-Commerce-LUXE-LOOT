const express = require('express');
const router=express.Router()
const userController=require("../controllers/user/userController")
const userAuth = require('../middleware/userAuth');
const productController = require('../controllers/admin/productController');
const cartController=require('../controllers/user/cartCotroller')
const addressController=require('../controllers/user/addressController')
const orderController=require('../controllers/user/orderController');
const wishlistController = require('../controllers/user/wishlistController')
const walletController = require('../controllers/user/WalletController')
const filterController = require('../controllers/user/filterControll')
const CouponController = require('../controllers/admin/couponController')
const count=require('../middleware/counting')



router.route('/')
.get(userAuth.verifyUser,count,userController.initial)      //This is the Homepage of a logined user

router.route('/guest')
.get(userAuth.userExist,userController.gust)                //home page of Gust


router.route('/signIn')
.get(userAuth.userExist, userController.signIn)             //showing signin and loginpage
.post(userController.postsignin)                            //verifying login details


router.route('/signUp')
.post(userController.signUpPost)                            //reciving Details of a New User 


router.route('/send-otp')   
.get(userController.getotp)                                 //Rendering otp Page
.post(userController.postotp)                               //Verifying the Otp 

router.route('/resend-otp')
.get(userController.reSendOTP)                              //Rending Otp

router.route('/profileView')
.get(userAuth.verifyUser,count,userController.getUserProfile) //rendering UserProfile

router.route('/forgotPassword')
.get(userController.getForgetPassword)                      // Redering Forgot Password page
.post(userController.postForgetPassword)                    // Sending Reset Password link to user

router.route('/resetPassword/:email/:token')
.get(userController.getResetPassword)                       // here redering the reset Password page
.post(userController.postResetPassword)                     // here reseting the password

//-------Product---------------------------------

router.route('/productList/:page')
.get(count,productController.getProductList)                // showing the product list page

router.route('/productView/:id')
.get(count,productController.getProductView)                // Showing order Details
// ----------------product End-----------------


// -----------------Search/Sort/filter-------------------
router.route('/search/:input')
.get(filterController.searchProducts)                      // The Algorithm to Perform Search

router.route('/sortProduct')
.post(filterController.sortProduct)                        // The Algorithm to Perform Sort

router.route('/filterProduct')
.post(filterController.filterProduct)                      // The Algorithm to Perform Filter
// ---------------End Search/Sort/filter------------------


//-------------------Address--------------------

router.route('/deleteAddress')
.post(userAuth.verifyUser,userController.deleteAddress)

//----------------------end Address--------------------

// ------------------cart----------------------------
router.route('/cart')
.get(userAuth.userAllowed,count,cartController.getCart)

router.route('/addtocart/:id')
.get(userAuth.verifyUser,cartController.postAddToCart)

router.route('/removeCartItem/:id/:proId')
.get(userAuth.verifyUser,cartController.removeCartItem)

router.route('/changeProductQuantity')
.post(userAuth.verifyUser,cartController.changeQuantity)

router.route('/checkout')
.get(userAuth.verifyUser,count,addressController.getCheckout)


// --------------------cart End------------------------

// .........................wishlist.......................

router.route('/wishlist')
.get(userAuth.verifyUser,count,wishlistController.getWishlist)

router.route('/addtoWishlist')
.post(userAuth.verifyUser,wishlistController.addToWishlist)

router.route('/removewishlistitem')
.post(userAuth.verifyUser,wishlistController.removeitem)

// .........................end wishlist.......................


//----------------address------------------------------

router.route('/updateAddress')
.post(userAuth.verifyUser,userController.postUpdateAddress)

router.route('/editAddress')
.post(userAuth.verifyUser,userController.postEditAddress)

//.......................wallet.........................

router.route('/wallet')
.get(userAuth.verifyUser,count,walletController.getWallet)

router.route('/applayWalletAmount')
.post(userAuth.verifyUser,cartController.applayWalletAmount)

router.route('/removerAppliedWalletAmount')
.post(userAuth.verifyUser,cartController.postRemoveWalletAmount)

//-----------------coupon------------------------------------

router.route('/availableCoupon')
.get(userAuth.verifyUser,CouponController.getAvailableCoupon)

router.route('/applyCouponCode')
.post(userAuth.verifyUser,CouponController.postApplyCoupon)

router.route('/removeCoupon')
.post(userAuth.verifyUser,CouponController.postRemoveCoupon)

//-------------------Order----------------------------
router.route('/orders')
.get(userAuth.verifyUser,count,orderController.getOrders)

router.route('/placeOrder')
.post(userAuth.verifyUser,orderController.placeOrder)

router.route('/singleOrder/:Productid')
.get(userAuth.userAllowed,)

router.route('/viewOrder/:id')
.get(userAuth.verifyUser,count,orderController.getViewOrder)

router.route('/cancelOrder/:id')
.get(userAuth.verifyUser,orderController.cancelOrder)

router.route('/singleCancel/:orderid/:productid')
.get(userAuth.verifyUser,orderController.singleOrderCancel)

router.route('/singleOrder')
.get(orderController.getSingleOrder)
.post(userAuth.verifyUser,orderController.postSingleOrder)

router.route('/returnRequest')
.post(userAuth.verifyUser,orderController.postReturnOrder)

router.route('/repayment/:orderid')
.get(userAuth.verifyUser,orderController.getRepayment)

//...........payment success.....................

router.route('/verifyPayment')
.post(userAuth.verifyUser,orderController.verifyPayment)

router.route('/paymentSuccess')
.get(userAuth.verifyUser,orderController.getSuccess)

//-----------------userProfile----------------
router.route('/userUpdateName')
.post(userAuth.verifyUser,userController.postEditName)

router.route('/userUpdatePassword')
.post(userAuth.verifyUser,userController.postUserUpdatePassword)


// --------------send Referal link------------------------------

router.route('/sendReferalMail')
.post(userAuth.verifyUser,userController.postSendReferalLink)

router.route('/referalLogin/:email')
.get(userController.getReferalLogin)


//---------------------------------download Invoice------------------------
router.route('/generateinvoice/:orderid/:index')
.get(userAuth.verifyUser,orderController.generateInvoice)

router.route('/downloadinvoice/:orderid')
.get(userAuth.verifyUser,orderController.downloadInvoice)

router.route('/logout')
.get((req,res)=>{
    req.session.destroy()
    res.redirect('/')

})
module.exports=router