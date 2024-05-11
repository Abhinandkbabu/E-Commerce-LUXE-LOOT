const RazorPay = require('razorpay');

const instance = new RazorPay({
    key_id: process.env.RZRP_KEY_ID,
    key_secret:process.env.RZRP_SECRET
})
module.exports = function(orderid, total) {
    return new Promise((resolve, reject) => {
        try {
            console.log(`orderid${orderid},total${total}`);
            const options = {
                amount: total*100,
                currency: "INR",
                receipt: orderid
            };
            instance.orders.create(options, function(err, order) {
                if (err) {
                    reject(err);
                } else {
                    resolve(order);
                }
            });
        } catch (err) {
            reject(err);
        }
    });
};