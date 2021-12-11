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
}

export default {
    emailValidation,
    passwordValidation
}