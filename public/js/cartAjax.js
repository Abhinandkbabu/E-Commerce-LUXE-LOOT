function changeQuantity(cartId, productId, count) {
  let currentQuantity = parseInt($(`#quantity${productId}`).text()); // Get the current quantity
  let newQuantity = currentQuantity + count; // Calculate new quantity

  if (newQuantity < 1) {
      // If quantity becomes zero or negative, remove the item
      $.ajax({
          url: `/removeCartItem/${cartId}/${productId}`,
          method: 'get',
          success: function (res) {
            Toastify({
                text: "Item removed from cart",
                duration: 800,
                close: false,
                gravity: "top",
                position: 'center',
                style: {
                  background: "rgba(0, 0, 255, 0.7)", // Set the background color with opacity
                  color: "#fff",
                  borderRadius: "15px",
                }
              }).showToast();
              setTimeout(()=>{
                window.location.reload()
              },1200)
          },
          error: function (err) {
              // Handle error if needed
          }
      });
  } else if(newQuantity<=5) {
      // Update the quantity
      $.ajax({
          url: '/changeProductQuantity',
          method: 'post',
          data: {
              cart: cartId,
              product: productId,
              count: count,
              newQuantity
          },
          success: function (res) {
            if(res.success){
              // Update the quantity display
              $(`#quantity${productId}`).html(newQuantity);

              // Update other elements as needed
              $('.contentToReload-totalprice').html('₹'+res.cartPricing.totalprice);
              $('.contentToReload-discount').html('-₹'+res.cartPricing.subtotal);
              $('.contentToReload-toteldiscount').html('₹'+res.cartPricing.totaldiscount);
            }else{
              Toastify({
                text: res.msg,
                duration: 800,
                close: false,
                gravity: "top",
                position: 'center',
                style: {
                  background: "rgba(0, 0, 255, 0.7)", // Set the background color with opacity
                  color: "#fff",
                  borderRadius: "15px",
                }
              }).showToast();
            }
          },
          error: function (err) {
              // Handle error if needed
          }
      });
  }else{
    Toastify({
      text: "Quantity Exeeded",
      duration: 800,
      close: false,
      gravity: "top",
      position: 'center',
      style: {
        background: "rgba(0, 0, 255, 0.7)", // Set the background color with opacity
        color: "#fff",
        borderRadius: "15px",
      }
    }).showToast();
  }
}

function removeitem(cartId,productId){
    $.ajax({
        url: `/removeCartItem/${cartId}/${productId}`,
        method: 'get',
        success: function (res) {
          Toastify({
              text: "Item removed from cart",
              duration: 800,
              close: false,
              gravity: "top",
              position: 'center',
              style: {
                background: "rgba(0, 0, 255, 0.7)", // Set the background color with opacity
                color: "#fff",
                borderRadius: "15px",
              }
            }).showToast();
            setTimeout(()=>{
              window.location.reload()
            },1300)
            // $("#myDiv").load(location.href + " #myDiv")
            // $("#reload").load(location.href+"#reload")
        },
        error: function (err) {
            // Handle error if needed
        }
    });
}