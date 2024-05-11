const easyinvoice = require('easyinvoice')
const fs = require('fs')
const path = require('path');


module.exports = {
   generateInvoice : async (orderDeatails,index,deliveredProducts) => {
      try{
         const formatDate = (date) => {
            return date ? new Date(date).toLocaleDateString('en-US'):'';
         };
   
         const data = {
            images : {
               logo : fs.readFileSync(path.join(__dirname,'..','public','images','Logo_black.png'),'base64'),
            },
            sender : {
               company : "Luxe Loot",
               address : "East Nadakavu , Street 3442 ,Calicut , Kerala",
               zip : "673528",
               city : "Calicut",
               country : "India",
            },
            client : {
               company : orderDeatails.address.name,
               address : orderDeatails.address.locality,
               zip : orderDeatails.address.pincode,
               city : orderDeatails.address.city,
               country :'India'
            },
            information : {
               'order id' : orderDeatails._id,
               'date' : formatDate(orderDeatails.orderDate),
               'invoice date' : formatDate(orderDeatails.orderDate)
            },
            products : deliveredProducts.map( product => ({
               quantity : product.quantity.toString(),
               description : product.ProductId.productName,
               'tax-rate' : 0,
               price : product.price
            })),
            bottomNotice : "Thank you for chosing Luxe Loot",
            settings : {
               currency : 'IND',
               "tax-notation" : "GST"
            },
         };
   
    
         const result = await easyinvoice.createInvoice(data)
         if(result.pdf){
            const pdfPath = path.join(__dirname,'..','public','invoice',`${orderDeatails._id}.pdf`);
            await fs.promises.writeFile(pdfPath,result.pdf,'base64');
            return pdfPath;
         }else{
            console.log('Error while generating PDF ');
         }
      }catch(err){
         console.log(err);
         return null
      }
   }
};