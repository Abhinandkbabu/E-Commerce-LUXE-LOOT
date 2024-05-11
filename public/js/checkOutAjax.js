$(document).ready(function(){
  $('#addressForm').submit(function(e){
      e.preventDefault(); // prevent default form submission
      var formData = $(this).serialize(); // serialize form data
      if(!check()) return 
      $.ajax({
          type: 'POST',
          url: '/updateAddress', // change this to your backend endpoint
          data: formData,
          success: function(response){
              // Handle success response
              console.log(response);
              window.location.reload();
          },
          error: function(xhr, status, error){
              // Handle error
              console.error(xhr.responseText);
              // You can also show an error message here
          }
      });
  });
});



$(document).ready(function() {
    $('#orderForm').submit(function(event) {
        event.preventDefault(); // Prevent default form submission

        // Perform client-side validation
        if (!this.checkValidity()) {
            // If the form is invalid, display error messages and return
            this.classList.add('was-validated');
            return;
        }

        // Disable the submit button to prevent multiple submissions
        $('#submitOrderBtn').prop('disabled', true);

        // Serialize form data
        var formData = $(this).serialize();

        // Send AJAX request
        $.ajax({
            url: '/placeOrder', // Submit URL from the form's action attribute
            type: 'POST', // Submit method from the form's method attribute
            data: formData,
            success: function(response) {
              if(response.success){
                if(response.paymentMethod=='Cash on Delivery') location.href='/paymentSuccess';
                else if(response.paymentMethod=='Online') {
                    payment(response)
                }
              }else{
                // Show success message
                  Swal.fire({
                 
                  icon: "error",
                  title: "Error occured",
                  showConfirmButton: false,
                  timer: 1500
                });
              }
                // Optionally, you can redirect to another page here
                // window.location.href = "/checkout"; // Redirect to home page
            },
            error: function(xhr, status, error) {
                // Show error message
                alert('Error placing order. Please try again later.');
                console.error('Error placing order:', error);
            },
            complete: function() {
                // Re-enable the submit button
                $('#submitOrderBtn').prop('disabled', false);
            }
        });
    });
});

//razorpay
function payment(res){
  var options = {
    "key": "rzp_test_mX1xtg6FOs0mN5", 
    "amount": res.order.amount, 
    "currency": "INR",
    "name": "Luxe Loot", //your business name
    "description": "Test Transaction",
    "image": "https://example.com/your_logo",
    "order_id": res.order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    "handler": function (response){
        pymentverify(res.order,response)
    },
    "prefill": { //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
        "name": res.address.name, //your customer's name
        "email": res.Email, 
        "contact": res.address.mobile  //Provide the customer's phone number for better conversion rates 
    },
    "notes": {
        "address": "Razorpay Corporate Office"
    },
    "theme": {
        "color": "#3399cc"
    }
};
var rzp1 = new Razorpay(options);
rzp1.on('payment.failed', function (response){
  // alert(response.error.code);
  // alert(response.error.description);
  // alert(response.error.source);
  // alert(response.error.step);
  // alert(response.error.reason);
  // alert(response.error.metadata.order_id);
  // alert(response.error.metadata.payment_id);
  // location.href=`/viewOrder/${res.orderid}`
  // Disable the button with id "submitOrderBtn"
  rzp1.close();

$('#submitOrderBtn').prop('disabled', true);
  setTimeout(()=>{
  location.href=`/viewOrder/${res.orderid}`
},1900)

  Swal.fire({
  position: "center",
  icon: "error",
  title: "Your Payment is failed",
  showConfirmButton: false,
  footer:'<span class="text-warning"> Redirecting .. Please Wait </span>',
  timer: 2000
});

  // Change the href attribute using jQuery
});
rzp1.open();

}

function pymentverify(order,response){
    $.ajax({
      url:'/verifyPayment',
      method:'POST',
      data:{
        order,
        response
      },
      success:(res)=>{
        if(res.success) location.href ='/paymentSuccess';
      },
      error:(err)=>{
        
      }

    })
}

//validation
function validateName() {
      const nameInput = document.getElementById('name');
      const nameError = document.getElementById('nameError');
      const name = nameInput.value.trim();
      
      if (name === '') {
        nameError.textContent = 'Name cannot be empty';
        nameInput.classList.add('is-invalid');
        $("#addAddressbtn").prop("disabled", true);

        return false;
      } else if (name.split(' ').filter(Boolean).length !== 3) {
        nameError.textContent = 'Please enter your first name, middle name, and last name';
        nameInput.classList.add('is-invalid');
        $("#addAddressbtn").prop("disabled", true);
        return false;
      } else {
        nameError.textContent = '';
        nameInput.classList.remove('is-invalid');
        $("#addAddressbtn").prop("disabled", false);
        return true;
      }
    }

    function validateAddressLane() {
      const addressLaneInput = document.getElementById('addressLane');
      const addressLaneError = document.getElementById('addressLaneError');
      const addressLane = addressLaneInput.value.trim();
      
      if (addressLane === '') {
        addressLaneError.textContent = 'Address lane cannot be empty';
        addressLaneInput.classList.add('is-invalid');
        $("#addAddressbtn").prop("disabled", true);
        return false;
      } else {
        addressLaneError.textContent = '';
        addressLaneInput.classList.remove('is-invalid');
        $("#addAddressbtn").prop("disabled", false);
        return true;
      }
    }

    function validateLocality() {
      const localityInput = document.getElementById('locality');
      const localityError = document.getElementById('localityError');
      const locality = localityInput.value.trim();
      
      if (locality === '') {
        localityError.textContent = 'Locality cannot be empty';
        localityInput.classList.add('is-invalid');
        $("#addAddressbtn").prop("disabled", true);
        return false;
      } else {
        localityError.textContent = '';
        localityInput.classList.remove('is-invalid');
        $("#addAddressbtn").prop("disabled", false);
        return true;
      }
    }

    function validateCity() {
      const cityInput = document.getElementById('city');
      const cityError = document.getElementById('cityError');
      const city = cityInput.value.trim();
      
      if (city === '') {
        cityError.textContent = 'City cannot be empty';
        cityInput.classList.add('is-invalid');
        $("#addAddressbtn").prop("disabled", true);
        return false;
      } else {
        cityError.textContent = '';
        cityInput.classList.remove('is-invalid');
        $("#addAddressbtn").prop("disabled", false);
        return true;
      }
    }

    function validateDistrict() {
      const districtInput = document.getElementById('district');
      const districtError = document.getElementById('districtError');
      const district = districtInput.value.trim();
      
      if (district === '') {
        districtError.textContent = 'District cannot be empty';
        districtInput.classList.add('is-invalid');
        $("#addAddressbtn").prop("disabled", true);
        return false;
      } else {
        districtError.textContent = '';
        districtInput.classList.remove('is-invalid');
        $("#addAddressbtn").prop("disabled", false);
        return true;
      }
    }

    function validateState() {
      const stateInput = document.getElementById('state');
      const stateError = document.getElementById('stateError');
      const state = stateInput.value.trim();
      
      if (state === '') {
        stateError.textContent = 'State cannot be empty';
        stateInput.classList.add('is-invalid');
        $("#addAddressbtn").prop("disabled", true);
        return false;
      } else {
        stateError.textContent = '';
        stateInput.classList.remove('is-invalid');
        $("#addAddressbtn").prop("disabled", false);
        return true;
      }
    }

    function validatePincode() {
      const pincodeInput = document.getElementById('pincode');
      const pincodeError = document.getElementById('pincodeError');
      const pincode = pincodeInput.value.trim();
      
      if (pincode === '') {
        pincodeError.textContent = 'Pincode cannot be empty';
        pincodeInput.classList.add('is-invalid');
        $("#addAddressbtn").prop("disabled", true);
        return false;
      } else {
        pincodeError.textContent = '';
        pincodeInput.classList.remove('is-invalid');
        $("#addAddressbtn").prop("disabled", false);
        return true;
      }
    }

    function validateMobile() {
      const mobileInput = document.getElementById('mobile');
      const mobileError = document.getElementById('mobileError');
      const mobile = mobileInput.value.trim();
      
      if (mobile.length !== 10 || isNaN(mobile)) {
        mobileError.textContent = 'Please enter a valid 10-digit mobile number';
        mobileInput.classList.add('is-invalid');
        $("#addAddressbtn").prop("disabled", true);
        return false;
      } else {
        mobileError.textContent = '';
        mobileInput.classList.remove('is-invalid');
        $("#addAddressbtn").prop("disabled", false);
        return true;
      }
    }

    function check() {
      const isNameValid = validateName();
      const isAddressLaneValid = validateAddressLane();
      const isLocalityValid = validateLocality();
      const isCityValid = validateCity();
      const isDistrictValid = validateDistrict();
      const isStateValid = validateState();
      const isPincodeValid = validatePincode();
      const isMobileValid = validateMobile();

      if (!isNameValid || !isAddressLaneValid || !isLocalityValid || !isCityValid || !isDistrictValid || !isStateValid || !isPincodeValid || !isMobileValid) {
        Toastify({
          text: "Plese fill The form",
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
        return false
        // event.preventDefault();
      }
      return true
    };