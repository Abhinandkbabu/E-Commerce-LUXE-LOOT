// --------------update Name----------------------
$(document).ready(function() {
    $('.edit-button').click(function() {
        $('#inputName').prop('disabled', false);
        $(this).hide();
        $('.save-button').show();
    });

    $('.save-button').click(function() {
        var newName = $('#inputName').val();
        if(newName==''){
          Toastify({
            text: 'Enter a valid name',
            duration: 800,
            close: false,
            gravity: "bottom",
            position: 'center',
            style: {
                background: "rgba(0, 0, 255, 0.7)", // Set the background color with opacity
                color: "#fff",
                borderRadius: "15px",
            }
        }).showToast()
          return 
        }
        // AJAX request to update the name
        $.ajax({
            url: '/userUpdateName', // Specify your backend endpoint for updating the name
            method: 'POST',
            data: { newName: newName },
            success: function(response) {
                
              Toastify({
                text: 'Name Changed',
                duration: 800,
                close: false,
                gravity: "bottom",
                position: 'center',
                style: {
                    background: "rgba(0, 0, 255, 0.7)", // Set the background color with opacity
                    color: "#fff",
                    borderRadius: "15px",
                }
            }).showToast()

                $('.edit-button').show();
                $('.save-button').hide();
                $('#inputName').prop('disabled', true);

                // Update the name in the side panel
                $('#userProfileName').text(newName);
            },
            error: function(xhr, status, error) {
                console.error('Error updating name:', error);
                alert('Error updating name. Please try again.');
            }
        });
    });
});
function validateinputName() {
  const nameInput = document.getElementById('inputName');
  const nameError = document.getElementById('nameError');
  const name = nameInput.value.trim();
  
  if (name === '') {
    nameError.textContent = 'Name cannot be empty';
    nameInput.classList.add('is-invalid');
    $('.save-button').prop('disabled', true);
    return false;
  } else if (name.split(' ').filter(Boolean).length !== 3) {
    nameError.textContent = 'Please enter your first name, middle name, and last name';
    nameInput.classList.add('is-invalid');
    $('.save-button').prop('disabled', true);
    return false;
  } else {
    nameError.textContent = '';
    nameInput.classList.remove('is-invalid');
    $('.save-button').prop('disabled', false);
    return true;
  }
}
// --------------update Name end----------------------

//----------------reseet Password------------------------
function validateExistingPassword() {
  var passwordInput = document.getElementById('password');
  var passwordError = document.getElementById('error');
  if (passwordInput.value.trim().length < 8 || /\s/.test(passwordInput.value)) {
      passwordError.innerText = 'Password must be at least 8 characters';
      $('.update-password').prop('disabled', true);
      passwordInput.classList.add('is-invalid')
      return false
  } else {
      passwordError.innerText = '';
      $('.update-password').prop('disabled', false);
      passwordInput.classList.remove('is-invalid')
      return true
  }
}
function validatePassword() {
  var passwordInput = document.getElementById('new-password');
  var passwordError = document.getElementById('error');
  if (passwordInput.value.trim().length < 8 || /\s/.test(passwordInput.value)) {
      passwordError.innerText = 'Password must be at least 8 characters';
      $('.update-password').prop('disabled', true);
      passwordInput.classList.add('is-invalid')
      return false
  } else {
      passwordError.innerText = '';
      $('.update-password').prop('disabled', false);
      passwordInput.classList.remove('is-invalid')
      return true
  }
}

function validateRepeatPassword() {
  var repeatPasswordInput = document.getElementById('repeat-password');
  var passwordInput = document.getElementById('new-password');
  var repeatPasswordError = document.getElementById('error');
  if (repeatPasswordInput.value.trim() !== passwordInput.value.trim()) {
      repeatPasswordError.innerText = 'Passwords do not match';
      $('.update-password').prop('disabled', true);
      passwordInput.classList.add('is-invalid')
      return false
  } else {
      repeatPasswordError.innerText = '';
      $('.update-password').prop('disabled', false);
      passwordInput.classList.remove('is-invalid')
      return true
  }
}

$('.update-password').click(function() {
  var password = $('#password').val();
  var newPassword = $('#new-password').val();
  var repeatPassword = $('#repeat-password').val();

  // Validate passwords
  if (password === '' || newPassword === '' || repeatPassword === '') {
    Toastify({
      text: 'please fill this form',
      duration: 800,
      close: false,
      gravity: "bottom",
      position: 'center',
      style: {
          background: "rgba(0, 0, 255, 0.7)", // Set the background color with opacity
          color: "#fff",
          borderRadius: "15px",
      }
  }).showToast();
      return;
  }

  if (newPassword !== repeatPassword) {
    Toastify({
      text: 'Password does not match',
      duration: 800,
      close: false,
      gravity: "bottom",
      position: 'center',
      style: {
          background: "rgba(0, 0, 255, 0.7)", // Set the background color with opacity
          color: "#fff",
          borderRadius: "15px",
      }
  }).showToast();
      return;
  }

  // AJAX request to update the password
  $.ajax({
      url: '/userUpdatePassword', // Specify your backend endpoint for updating the password
      method: 'POST',
      data: {
          password: password,
          newPassword: newPassword
      },
      success: function(response) {
        Toastify({
          text: 'Password Updated Successfully',
          duration: 800,
          close: false,
          gravity: "bottom",
          position: 'center',
          style: {
              background: "rgba(0, 0, 255, 0.7)", // Set the background color with opacity
              color: "#fff",
              borderRadius: "15px",
          }
      }).showToast();
          $('#password').val('');
          $('#new-password').val('');
          $('#repeat-password').val('');
      },
      error: function(xhr, status, error) {
          
          alert('Error updating password. Please try again.');
      }
  });
});


function deleteAddress(userId, addressIndex) {
    Swal.fire({
        title: 'Are you sure?',
        text: 'Delete Address',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Confirm'
        }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: "POST",
                url: "/deleteAddress",
                data: { userId: userId, addressIndex: addressIndex },
                success: function(response) {
        
                    Toastify({
                        text: response.msg,
                        duration: 800,
                        close: false,
                        gravity: "bottom",
                        position: 'center',
                        style: {
                            background: "rgba(0, 0, 255, 0.7)", // Set the background color with opacity
                            color: "#fff",
                            borderRadius: "15px",
                        }
                    }).showToast();
                    $("#messages").load(location.href + " #messages");
                    // Optionally, update UI after successful deletion
                },
                error: function(xhr, status, error) {
                    console.error(xhr.responseText);
                }
            });

        }
    })
    
}

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
                $('#staticBackdrop').modal('hide');
                // window.location.reload()
                $("#messages").load(location.href + " #messages");
            },
            error: function(xhr, status, error){
                // Handle error
                console.error(xhr.responseText);
                // You can also show an error message here
            }
        });
    });
});

// adddress validation
function validateName() {
    const nameInput = document.getElementById('name');
    const nameError = document.getElementById('nameError');
    const name = nameInput.value.trim();
    
    if (name === '') {
      nameError.textContent = 'Name cannot be empty';
      nameInput.classList.add('is-invalid');
      $('.addadress-btn').prop('disabled', true);
      return false;
    } else if (name.split(' ').filter(Boolean).length !== 3) {
      nameError.textContent = 'Please enter your first name, middle name, and last name';
      nameInput.classList.add('is-invalid');
      $('.addadress-btn').prop('disabled', true);
      return false;
    } else {
      nameError.textContent = '';
      nameInput.classList.remove('is-invalid');
      $('.addadress-btn').prop('disabled', false);
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
      $('.addadress-btn').prop('disabled', true);
      return false;
    } else {
      addressLaneError.textContent = '';
      addressLaneInput.classList.remove('is-invalid');
      $('.addadress-btn').prop('disabled', false);
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
      $('.addadress-btn').prop('disabled', true);
      return false;
    } else {
      localityError.textContent = '';
      localityInput.classList.remove('is-invalid');
      $('.addadress-btn').prop('disabled', false);
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
      $('.addadress-btn').prop('disabled', true);
      return false;
    } else {
      cityError.textContent = '';
      cityInput.classList.remove('is-invalid');
      $('.addadress-btn').prop('disabled', false);
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
      $('.addadress-btn').prop('disabled', true);
      return false;
    } else {
      districtError.textContent = '';
      districtInput.classList.remove('is-invalid');
      $('.addadress-btn').prop('disabled', false);
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
      $('.addadress-btn').prop('disabled', true);
      return false;
    } else {
      stateError.textContent = '';
      stateInput.classList.remove('is-invalid');
      $('.addadress-btn').prop('disabled', false);
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
      $('.addadress-btn').prop('disabled', true);
      return false;
    } else {
      pincodeError.textContent = '';
      pincodeInput.classList.remove('is-invalid');
      $('.addadress-btn').prop('disabled', false);
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
      $('.addadress-btn').prop('disabled', true);
      return false;
    } else {
      mobileError.textContent = '';
      mobileInput.classList.remove('is-invalid');
      $('.addadress-btn').prop('disabled', false);
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
        text: 'Plese fill currectly',
        duration: 800,
        close: false,
        gravity: "bottom",
        position: 'center',
        style: {
            background: "rgba(0, 0, 255, 0.7)", // Set the background color with opacity
            color: "#fff",
            borderRadius: "15px",
        }
    }).showToast();
      // event.preventDefault();
      return false
    }
    return true
  };

// edit adddress validation
function editvalidateName() {
  const nameInput = document.getElementById('editName');
  const nameError = document.getElementById('editnameError');
  const name = nameInput.value.trim();
  
  if (name === '') {
    nameError.textContent = 'Name cannot be empty';
    nameInput.classList.add('is-invalid');
    $('#saveEditedAddress').prop('disabled', true);
    return false;
  } else if (name.split(' ').filter(Boolean).length !== 3) {
    nameError.textContent = 'Please enter your first name, middle name, and last name';
    nameInput.classList.add('is-invalid');
    $('#saveEditedAddress').prop('disabled', true);
    return false;
  } else {
    nameError.textContent = '';
    nameInput.classList.remove('is-invalid');
    $('#saveEditedAddress').prop('disabled', false);
    return true;
  }
}

function editvalidateAddressLane() {
  const addressLaneInput = document.getElementById('editAddressLane');
  const addressLaneError = document.getElementById('editaddressLaneError');
  const addressLane = addressLaneInput.value.trim();
  
  if (addressLane === '') {
    addressLaneError.textContent = 'Address lane cannot be empty';
    addressLaneInput.classList.add('is-invalid');
    $('#saveEditedAddress').prop('disabled', true);
    return false;
  } else {
    addressLaneError.textContent = '';
    addressLaneInput.classList.remove('is-invalid');
    $('#saveEditedAddress').prop('disabled', false);
    return true;
  }
}

function editvalidateLocality() {
  const localityInput = document.getElementById('editLocality');
  const localityError = document.getElementById('editlocalityError');
  const locality = localityInput.value.trim();
  
  if (locality === '') {
    localityError.textContent = 'Locality cannot be empty';
    localityInput.classList.add('is-invalid');
    $('#saveEditedAddress').prop('disabled', true);
    return false;
  } else {
    localityError.textContent = '';
    localityInput.classList.remove('is-invalid');
    $('#saveEditedAddress').prop('disabled', false);
    return true;
  }
}

function editvalidateCity() {
  const cityInput = document.getElementById('editCity');
  const cityError = document.getElementById('editcityError');
  const city = cityInput.value.trim();
  
  if (city === '') {
    cityError.textContent = 'City cannot be empty';
    cityInput.classList.add('is-invalid');
    $('#saveEditedAddress').prop('disabled', true);
    return false;
  } else {
    cityError.textContent = '';
    cityInput.classList.remove('is-invalid');
    $('#saveEditedAddress').prop('disabled', false);
    return true;
  }
}

function editvalidateDistrict() {
  const districtInput = document.getElementById('editDistrict');
  const districtError = document.getElementById('editdistrictError');
  const district = districtInput.value.trim();
  
  if (district === '') {
    districtError.textContent = 'District cannot be empty';
    districtInput.classList.add('is-invalid');
    $('#saveEditedAddress').prop('disabled', true);
    return false;
  } else {
    districtError.textContent = '';
    districtInput.classList.remove('is-invalid');
    $('#saveEditedAddress').prop('disabled', false);
    return true;
  }
}

function editvalidateState() {
  const stateInput = document.getElementById('editState');
  const stateError = document.getElementById('stateError');
  const state = stateInput.value.trim();
  
  if (state === '') {
    stateError.textContent = 'State cannot be empty';
    stateInput.classList.add('is-invalid');
    $('#saveEditedAddress').prop('disabled', true);
    return false;
  } else {
    stateError.textContent = '';
    stateInput.classList.remove('is-invalid');
    $('#saveEditedAddress').prop('disabled', false);
    return true;
  }
}

function editvalidatePincode() {
  const pincodeInput = document.getElementById('editPincode');
  const pincodeError = document.getElementById('editpincodeError');
  const pincode = pincodeInput.value.trim();
  
  if (pincode === '') {
    pincodeError.textContent = 'Pincode cannot be empty';
    pincodeInput.classList.add('is-invalid');
    $('#saveEditedAddress').prop('disabled', true);
    return false;
  } else {
    pincodeError.textContent = '';
    pincodeInput.classList.remove('is-invalid');
    $('#saveEditedAddress').prop('disabled', false);
    return true;
  }
}

function editvalidateMobile() {
  const mobileInput = document.getElementById('editMobile');
  const mobileError = document.getElementById('editmobileError');
  const mobile = mobileInput.value.trim();
  
  if (mobile.length !== 10 || isNaN(mobile)) {
    mobileError.textContent = 'Please enter a valid 10-digit mobile number';
    mobileInput.classList.add('is-invalid');
    $('#saveEditedAddress').prop('disabled', true);
    return false;
  } else {
    mobileError.textContent = '';
    mobileInput.classList.remove('is-invalid');
    $('#saveEditedAddress').prop('disabled', false);
    return true;
  }
}

