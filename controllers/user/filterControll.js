// const { name } = require("ejs");
const Category = require('../../models/catagorySchema')
const Product = require('../../models/productSchema')
const Brand = require('../../models/BrandSchema')
const Wishlist = require('../../models/wishlistSchema')

module.exports={
    
    searchProducts: async (req, res) => {
        try {
            const  SearchInput  = req.params.input;
    
            const matchingCategories = await Category.find({ Name: { $regex: SearchInput, $options: "i" } }, '_id');
            const categoryIds = matchingCategories.map(category => category._id);
    
            const matchingBrands = await Brand.find({ Name: { $regex: SearchInput, $options: "i" } }, '_id');
            const brandIds = matchingBrands.map(brand => brand._id);
    
            const products = await Product.find({
                $or: [
                    { productName: { $regex: SearchInput, $options: "i" } },
                    { category: { $in: categoryIds } },
                    { brand: { $in: brandIds } }
                ],
                status: "Active"
            });
    
            const categories = await Category.find({});
            const brands = await Brand.find({});
    
            const length = products.length;
            const totalPages = Math.ceil(length / 8);
            let wishlist;
            if (req.session.user) {
                let wishlistuser = await Wishlist.findOne({ userid: req.session.user._id });
                if(wishlistuser) wishlist = wishlistuser.products.map(obj => obj.productid.toString())
            } else {
                wishlist = [];
            }

            res.render('user/productList', { title: 'Products', data: products, totalPages, categories, brands, wishlist });
        } catch (err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
        }
    },
    
    sortProduct : async(req,res)=>{
        try{
            const { value, filter } = req.body;
            console.log("here");
            console.log(filter);
            
            let query = { status: "Active" };
            
            // Check if filter object exists and has categories property
            if (filter && filter.categories) {
                // If filter.categories is an array, use it directly, otherwise convert to an array
                query.category = { $in: Array.isArray(filter.categories) ? filter.categories : [filter.categories] };
            }
            
            // Check if filter object exists and has brands property
            if (filter && filter.brands) {
                // If filter.brands is an array, use it directly, otherwise convert to an array
                query.brand = { $in: Array.isArray(filter.brands) ? filter.brands : [filter.brands] };
            }
            
            // Add Price to the query if min and max are provided
            if (filter && filter.minPrice !== '' && filter.maxPrice !== '') {
                query.price = { $gt: parseInt(filter.minPrice), $lt: parseInt(filter.maxPrice) };
            }
            
            console.log(query);
            
            let sort;
            switch(value) {
                case '1':
                    sort = { price: 1 };
                    break;
                case '2':
                    sort = { price: -1 };
                    break;
                case '3':
                    sort = { productName: 1 };
                    break;
                case '4':
                    sort = { productName: -1 };
                    break;
                default:
                    sort = {};
                    break;
            }
            
            let data = await Product.find(query)
                .populate({
                    path: 'brand',
                    match: { Status: 'Active' } // Filter brands with status Active
                })
                .populate({
                    path: 'category',
                    match: { Status: 'Active' } // Filter categories with status Active
                })
                .sort(sort)
                .exec();
            



            console.log(data)

            if(data.length!=0) res.json({success:true,data})

        }catch(err){
            console.log(err)
        }
    },

    filterProduct: async (req,res)=>{
        console.log(req.body)
        const {categories,brands,minPrice,maxPrice} = req.body

        const query = { status: "Active" };

        // categories !== undefined ? query.category = {$in: categories} : null;
        // brands !== undefined ? query.brand = {$in: brands} : null;
        // (minPrice !== '' && maxPrice !== '') ? query.price = { $gte: minPrice, $lte: maxPrice } : null;

        // Add Category to the query if it is not an empty string
        if (req.body.categories!=undefined) {
            query.category = { $in:categories };
        }

        // Add BrandName to the query if it is not an empty string
        if (req.body.brands!=undefined) {
            query.brand = { $in: brands };
        }

        // Add Price to the query if min and max are provided
        if (minPrice!=''&& maxPrice!='') {
            query.price = { $gt:minPrice, $lt:maxPrice };
        }

        console.log(query)
        // req.session.filterquery= query

        try{
            const [ data,count] = await Promise.all([
                
                Product.find(query).populate('brand').populate('category'),
                Product.find(query).count()
            ])
            if(data) res.json({success:true,data})
        }catch(err){
            console.log(err)
        }
        

    }
}