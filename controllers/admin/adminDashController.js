const Order = require('../../models/orderSchema')
const { generateSalesPDF } = require('../../utility/salesPdfCreator')
const User = require('../../models/userSchema')
const moment = require('moment')
const Category = require('../../models/catagorySchema')
const Brand = require('../../models/BrandSchema')

module.exports = {


    getAdminDashboard: async(req,res)=>{
        try{

            
            
            const currentDate = new Date();
            const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            startOfMonth.setDate(startOfMonth.getDate() - 30); // Subtract 30 days
            

  

            const [sales, revenue, customers, recentOrders, topSelling,previousMonthCustomer,bestSellingCategory,bestSellingBrand] = await Promise.all([
                Order.aggregate([
                    { $match: { orderStatus: "Order Delivered" } },
                    { $group: { _id: null, totalSalesCount: { $sum: 1 } } }]),

                    Order.aggregate([
                        { $match: { PaymentStatus: "Payment Successful",  orderStatus: { $nin: ["Order Canceled", "Canceled"] } } },
                        { $group: { _id: null, totalAmount: { $sum: "$subTotal" } } }
                    ]),
                    

                User.find().countDocuments(),
                Order.find().sort({ orderDate: -1 }).limit(50),
                Order.aggregate([
                    { $unwind: "$products" }, // Split the products array into separate documents
                    { $group: { _id: "$products.ProductId", totalQuantity: { $sum: "$products.quantity"  } } }, // Group by product and sum the quantities
                    { $sort: { totalQuantity: -1 } }, // Sort by total quantity in descending order
                    { $limit: 5 }, // Limit to top 5
                    {
                        $lookup: {
                            from: "products", // Collection name for products
                            localField: "_id",
                            foreignField: "_id",
                            as: "productDetails"
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            totalQuantity: 1,
                            productDetails: { $arrayElemAt: ["$productDetails", 0] } // Get the product details from the array 
                        }
                    }
                ]),
                User.countDocuments({
                    createdAt: { $gte: startOfMonth, $lte: currentDate }
                }),

                Order.aggregate([
                    { $unwind: '$products' },
                    {
                       $group : {
                          _id : '$products.ProductId',
                          totalQuantitySold : { $sum : '$products.quantity'}
                       }
                    },
                    {
                       $lookup : {
                          from : 'products',
                          foreignField : '_id',
                          localField : '_id',
                          as : 'productDetails'
                       }
                    },
                    { $unwind: '$productDetails' },
                    {
                       $group : {
                          _id : '$productDetails.category',
                          totalQuantitySold : { $sum : '$totalQuantitySold'}
                       }
                    },
                    { $sort: { totalQuantitySold: -1 } },
                    { $limit: 1 }
                 ]),
                 Order.aggregate([
                    { $unwind: '$products' },
                    {
                        $group: {
                            _id: '$products.ProductId',
                            totalQuantitySold: { $sum: '$products.quantity' }
                        }
                    },
                    {
                        $lookup: {
                            from: 'products',
                            foreignField: '_id',
                            localField: '_id',
                            as: 'productDetails'
                        }
                    },
                    { $unwind: '$productDetails' },
                    {
                        $lookup: {
                            from: 'brands', // Assuming your brand model is named 'brands'
                            foreignField: '_id',
                            localField: 'productDetails.brand',
                            as: 'brandDetails'
                        }
                    },
                    { $unwind: '$brandDetails' },
                    {
                        $group: {
                            _id: '$brandDetails._id', // Group by brand ID
                            totalQuantitySold: { $sum: '$totalQuantitySold' }
                        }
                    },
                    { $sort: { totalQuantitySold: -1 } },
                    { $limit: 1 }
                ])
                
                
            ])
            
           
            let bestCategory = await Category.findById(bestSellingCategory[0]._id)
            let bestBrand = await Brand.findById(bestSellingBrand[0]._id)
            
            console.log(bestSellingBrand)

            const totalSales = sales[0] ? sales[0].totalSalesCount : 0;
            const totalRevenue = revenue[0] ? revenue[0].totalAmount : 0;

            res.render('admin/dashboard',{title:"Dashboard",totalSales,totalRevenue,customers,recentOrders,topSelling,previousMonthCustomer,bestcategory:bestCategory.Name,categoryCount:bestSellingCategory[0].totalQuantitySold, bestbrand:bestBrand.Name,brandCount:bestSellingBrand[0].totalQuantitySold})
        }catch(err){
            console.log(err)
        }
    },


    downloadSalesReport: async (req, res) => {
        try {
            const { startdate, enddate, downloadformat } = req.body
            console.log(req.body)
            let startDate = new Date(startdate)
            let endDate = new Date(enddate)
            let currentDate = new Date()
            // if(endDate<startDate||endDate>=currentDate){
            //     res.json({msg:'Coose Currect Date'})
            //     return
            // }
            endDate.setHours(23, 59, 59, 999);
            const orders = await Order.find(
                { PaymentStatus: "Payment Successful", orderDate: { $gte: startDate, $lte: endDate, } }).populate("products.ProductId");

                console.log(orders)

            if(downloadformat == 'pdf'){
                const pdfBuffer = await generateSalesPDF(orders, startDate, endDate);

                // Set headers for the response
                res.setHeader("Content-Type", "application/pdf");
                res.setHeader(
                    "Content-Disposition",
                    "attachment; filename=sales Report.pdf"
                );

                res.status(200).end(pdfBuffer);
            }else{

                let totalSales = 0;

                orders.forEach((order) => {
                    totalSales += order.discountAmount || 0;
                });

                pdf.downloadReport(
                    req,
                    res,
                    orders,
                    startDate,
                    endDate,
                    totalSales.toFixed(2),
                    downloadformat
                );
            }
             
        } catch (error) {
            console.log(error);


        }
    },

    getChart : async(req,res)=>{
        try {
            
            const orders = await Order.find(
                { orderStatus: { $nin: ["Order Canceled", "Canceled"] } ,PaymentStatus: "Payment Successful" }
            )

            const orderCountsByDay = {};
            const totalAmountByDay = {};
            const orderCountsByMonthYear = {};
            const totalAmountByMonthYear = {};
            const orderCountsByYear = {};
            const totalAmountByYear = {};
            let labelsByCount;
            let labelsByAmount;


            orders.forEach((order) => {

                const formattedOrderDate = moment(order.orderDate);
                const orderDate = formattedOrderDate.format("ddd MMM DD YYYY");
                const dayMonthYear = formattedOrderDate.format("YYYY-MM-DD");
                const monthYear = formattedOrderDate.format("YYYY-MM");
                const year = formattedOrderDate.format("YYYY");


                if (req.url === "/count-orders-by-day") {
                    if (!orderCountsByDay[dayMonthYear]) {
                        orderCountsByDay[dayMonthYear] = 1;
                        totalAmountByDay[dayMonthYear] = order.totalAmount;
                    } else {
                        orderCountsByDay[dayMonthYear]++;
                        totalAmountByDay[dayMonthYear] += order.totalAmount;
                    }

                    const ordersByDay = Object.keys(orderCountsByDay).map(
                        (dayMonthYear) => ({
                            _id: dayMonthYear,
                            count: orderCountsByDay[dayMonthYear],
                        })
                    );

                    const amountsByDay = Object.keys(totalAmountByDay).map(
                        (dayMonthYear) => ({
                            _id: dayMonthYear,
                            total: totalAmountByDay[dayMonthYear],
                        })
                    );

                    amountsByDay.sort((a, b) => (a._id < b._id ? -1 : 1));
                    ordersByDay.sort((a, b) => (a._id < b._id ? -1 : 1));

                    labelsByCount = ordersByDay.map((entry) =>
                        moment(entry._id, "YYYY-MM-DD").format("DD MMM YYYY")
                    );

                    labelsByAmount = amountsByDay.map((entry) =>
                        moment(entry._id, "YYYY-MM-DD").format("DD MMM YYYY")
                    );

                    dataByCount = ordersByDay.map((entry) => entry.count);
                    dataByAmount = amountsByDay.map((entry) => entry.total);

                } else if (req.url === "/count-orders-by-month") {

                    if (!orderCountsByMonthYear[monthYear]) {
                        orderCountsByMonthYear[monthYear] = 1;
                        totalAmountByMonthYear[monthYear] = order.totalAmount;
                    } else {
                        orderCountsByMonthYear[monthYear]++;
                        totalAmountByMonthYear[monthYear] += order.totalAmount;
                    }

                    const ordersByMonth = Object.keys(orderCountsByMonthYear).map(
                        (monthYear) => ({
                            _id: monthYear,
                            count: orderCountsByMonthYear[monthYear],
                        })
                    );
                    const amountsByMonth = Object.keys(totalAmountByMonthYear).map(
                        (monthYear) => ({
                            _id: monthYear,
                            total: totalAmountByMonthYear[monthYear],
                        })
                    );

                    ordersByMonth.sort((a, b) => (a._id < b._id ? -1 : 1));
                    amountsByMonth.sort((a, b) => (a._id < b._id ? -1 : 1));

                    labelsByCount = ordersByMonth.map((entry) =>
                        moment(entry._id, "YYYY-MM").format("MMM YYYY")
                    );
                    labelsByAmount = amountsByMonth.map((entry) =>
                        moment(entry._id, "YYYY-MM").format("MMM YYYY")
                    );
                    dataByCount = ordersByMonth.map((entry) => entry.count);
                    dataByAmount = amountsByMonth.map((entry) => entry.total);


                } else if (req.url === "/count-orders-by-year") {
                    if (!orderCountsByYear[year]) {
                        orderCountsByYear[year] = 1;
                        totalAmountByYear[year] = order.totalAmount;
                    } else {
                        orderCountsByYear[year]++;
                        totalAmountByYear[year] += order.totalAmount;
                    }

                    const ordersByYear = Object.keys(orderCountsByYear).map((year) => ({
                        _id: year,
                        count: orderCountsByYear[year],
                    }));
                    const amountsByYear = Object.keys(totalAmountByYear).map((year) => ({
                        _id: year,
                        total: totalAmountByYear[year],
                    }));

                    ordersByYear.sort((a, b) => (a._id < b._id ? -1 : 1));
                    amountsByYear.sort((a, b) => (a._id < b._id ? -1 : 1));

                    labelsByCount = ordersByYear.map((entry) => entry._id);
                    labelsByAmount = amountsByYear.map((entry) => entry._id);
                    dataByCount = ordersByYear.map((entry) => entry.count);
                    dataByAmount = amountsByYear.map((entry) => entry.total);
                }
            })

            console.log(labelsByCount, labelsByAmount, dataByCount, dataByAmount)
            res.json({ labelsByCount, labelsByAmount, dataByCount, dataByAmount });

        } catch (error) {
            console.log(error);
        }

    }

}