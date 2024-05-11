const orderStatus = "<%= order.status %>";
        
// Function to get the class based on order status
function getOrderStatusClass(status) {
    return orderStatus === status ? 'progtrckr-done' : 'progtrckr-todo';
}

// Update the class of list items based on the order status
['Order Processing', 'Order Placed', 'Order Shipped', 'Order Delivered'].forEach(status => {
    const element = document.getElementById(status.toLowerCase());
    if (element) {
        element.className = getOrderStatusClass(status);
    }
});

const cancelProductButtons = document.querySelectorAll('.cancelProductBtn');
cancelProductButtons.forEach(button => {
button.addEventListener('click', function(event) {
event.preventDefault(); // Prevent the default action of the button

const orderId = this.getAttribute('data-orderid');
const productId = this.getAttribute('data-productid');

// Display SweetAlert confirmation dialog
Swal.fire({
    title: 'Are you sure?',
    text: 'You are about to cancel this product.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, cancel it!'
}).then((result) => {
    if (result.isConfirmed) {
        // Make an AJAX request to cancel the product
        fetch(`/singleCancel/${orderId}/${productId}`, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
            // Display a Toastify alert with the response message
            Swal.fire({
            title: 'Order Cancelled',
            text: data.message,
            icon: 'success',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
        });
        })
        .catch(error => {
            // Display an error Toastify alert if the request fails
            Toastify({
                text: 'Failed to cancel product. Please try again later.',
                duration: 3000,
                backgroundColor: "linear-gradient(to right, #ff416c, #ff4b2b)",
            }).showToast();
        });
    }
});
});
});


//cancel  
document.getElementById('cancelOrderBtn').addEventListener('click', function(event) {
event.preventDefault(); // Prevent the default action of the button

// Display a SweetAlert confirmation dialog
Swal.fire({
title: 'Are you sure?',
text: 'You are about to cancel this order.',
icon: 'warning',
showCancelButton: true,
confirmButtonColor: '#d33',
cancelButtonColor: '#3085d6',
confirmButtonText: 'Yes, cancel it!'
}).then((result) => {
if (result.isConfirmed) {
    const orderId = "<%= order._id %>";

    // Make an AJAX request to cancel the order
    fetch(`/cancelOrder/${orderId}`, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        // Display a SweetAlert after the cancellation is confirmed
        Swal.fire({
            title: 'Order Cancelled',
            text: data.message,
            icon: 'success',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
        });
    })
    .catch(error => {
        // Display an error SweetAlert if the request fails
        Swal.fire({
            title: 'Error',
            text: 'Failed to cancel order. Please try again later.',
            icon: 'error',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
        });
    });
}
});
});