const express = require('express');
const router=express.Router()
const adminAuth=require('../middleware/adminAuth')
const upload=require('../middleware/imgUpload')
const adminController=require('../controllers/admin/adminController')
const categoryControll=require('../controllers/admin/categoryController')
const productControll=require('../controllers/admin/productController')
const brandControll=require('../controllers/admin/brandController')
const OrderControll=require('../controllers/admin/orderController');
const couponControll = require('../controllers/admin/couponController')
const offerControll = require('../controllers/admin/offerController')
const adminDashControll = require('../controllers/admin/adminDashController')
const bannerControll = require('../controllers/admin/BannerController')


//initial
router.route('/')
.get(adminAuth.verifyAdmin,adminDashControll.getAdminDashboard)

//signIn
router.route('/signin')
.get(adminAuth.adminExsist,adminController.getSignIn)
.post(adminController.postSignIn)

//  Products-------------------------------------------------------------
const uploadFields = [
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
    {name:"image5", maxCount: 1 }
  ];

router.route('/product')
.get(adminAuth.verifyAdmin,productControll.getProducts)

router.route('/addProduct')
.get(adminAuth.verifyAdmin,productControll.getAddProducts)
.post(adminAuth.verifyAdmin,upload.any(),productControll.postAddProduct)

router.route('/editProduct/:id')
.get(adminAuth.verifyAdmin,productControll.getEditProduct)
.post(adminAuth.verifyAdmin,upload.any(),productControll.postEditProduct)

router.route('/removeImageEdit')
.post(adminAuth.verifyAdmin,productControll.deleteProductImage)

router.route('/blockProduct/:id')
.get(adminAuth.verifyAdmin,productControll.getBlockProduct)

router.route('/unBlockProduct/:id')
.get(adminAuth.verifyAdmin,productControll.getUnblockProduct)



//  Category--------------------------------------------------------------
router.route('/categories')
.get(adminAuth.verifyAdmin,categoryControll.getcategory)

router.route('/addCategory')
.post(adminAuth.verifyAdmin,categoryControll.postAddCategory)

router.route('/CategoryStatus')
.post(adminAuth.verifyAdmin,categoryControll.changeCategoryStatus)


//  Brand-----------------------------------------------------------------
router.route('/brands')
.get(adminAuth.verifyAdmin,brandControll.getBrands)

router.route('/addBrand')  
.post(adminAuth.verifyAdmin,brandControll.postAddBrand)

router.route('/brandStatus')
.post(adminAuth.verifyAdmin,brandControll.changeBrandStatus)


router.route('/admin/admins')
.get()

// User-------------------------------------------------------------------
router.route('/customer')
.get(adminAuth.verifyAdmin,adminController.getCostomer)

router.route('/blockUser/:id')
.get(adminAuth.verifyAdmin,adminController.blockUser)

router.route('/UnBlockUser/:id')
.get(adminAuth.verifyAdmin,adminController.unBlockUser)

//order------------------------------------------------------------------------
router.route('/orders')
.get(adminAuth.verifyAdmin,OrderControll.showOrderList)

router.route('/changeOrderStatus')
.post(adminAuth.verifyAdmin,OrderControll.postChangeOrderStatus)


router.route('/viewOrder/:id')
.get(adminAuth.verifyAdmin,OrderControll.getViewOrder)

router.route('/RequestedReturn')
.get(adminAuth.verifyAdmin,OrderControll.getReturnRequestedProducts)

router.route('/approveReturn')
.post(adminAuth.verifyAdmin,OrderControll.postApproveRequest)

router.route('/rejectReturn')
.post(adminAuth.verifyAdmin,OrderControll.rejectReturn)

//coupons-------------------------------------------------------------------------

router.route('/coupons')
.get(adminAuth.verifyAdmin,couponControll.getCoupons)
.post(adminAuth.verifyAdmin,couponControll.postAddCoupons)

router.route('/editcoupons/:couponid')
.get(adminAuth.verifyAdmin,couponControll.getEditCoupon)
.post(adminAuth.verifyAdmin,couponControll.postEditCoupon)

router.route('/deleteCoupon')
.post(adminAuth.verifyAdmin,couponControll.postDeleteCoupon)

// offers---------------------------------------------------------------------

router.route('/offers')
.get(adminAuth.verifyAdmin,offerControll.getOffers)
.post(adminAuth.verifyAdmin,offerControll.addOffer)

router.route('/editoffer/:offerid')
.get(adminAuth.verifyAdmin,offerControll.getEditOffer)
.post(adminAuth.verifyAdmin,offerControll.postEditOffer)

router.route('/deleteoffer')
.post(adminAuth.verifyAdmin,offerControll.deleteOffer)

router.route('/addreferaloffer')
.post(adminAuth.verifyAdmin,offerControll.addReferalOffeer)

router.route('/editReferaloffer/:id')
.get(adminAuth.verifyAdmin,offerControll.getEditReferalOffer)
.post(adminAuth.verifyAdmin,offerControll.postEdiReferalOffer)

router.route('/deleteReferalOffer')
.post(adminAuth.verifyAdmin,offerControll.postDeleteReferalOffer)

// download sales report------------------------------
router.route('/salesreport')
.post(adminAuth.verifyAdmin,adminDashControll.downloadSalesReport)

// Banner--------------------------------------------------------------

router.route('/Banner')
.get(adminAuth.verifyAdmin,bannerControll.getBanner)
.post(adminAuth.verifyAdmin,upload.any(),bannerControll.postAddBanner)

router.route('/changeBannerStatus').post(adminAuth.verifyAdmin,bannerControll.updateBannerStatus)

router.route('/deletebanner').post(adminAuth.verifyAdmin,bannerControll.deleteBanner)
// chart ---------------------------------------
router.route('/count-orders-by-day').get(adminAuth.verifyAdmin,adminDashControll.getChart)
router.route('/count-orders-by-month').get(adminAuth.verifyAdmin,adminDashControll.getChart)
router.route('/count-orders-by-year').get(adminAuth.verifyAdmin,adminDashControll.getChart)

router.route("/logout")
.get((req,res)=>{
    req.session.destroy() 
    res.redirect('/admin')
})

module.exports=router