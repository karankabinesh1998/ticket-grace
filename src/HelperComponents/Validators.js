import swal from "sweetalert";

function emailValidation(email) {
    const re = /\S+@\S+\.\S+/;
    if (!email) {
        return 'Please enter email address'
    } else if (re.test(email)) {
        return null;
    } else {
        return 'Please enter valid email address';
    }
}

function passwordValidation(password){
    if(!password){
        return 'Please enter the password'
    }else{
        return null;
    }
};

function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
         swal("Please enter only Numbers.")
        return false;
    }
    return true;
};

function phoneNumberValidation(phoneNumber) {
    if (phoneNumber == "" || phoneNumber == null) {
        return "Please enter your Mobile No.";
    }
    if (phoneNumber.length < 10 || phoneNumber.length > 10) {
        return "Mobile No. is not valid, Please Enter 10 Digit Mobile No.";
    }
     return null;
}

export default {
    emailValidation,
    passwordValidation,
    isNumber,
    phoneNumberValidation
}