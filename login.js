// function showPage(page) {
//     document.getElementById('loginPage').classList.toggle('active', page === 'login');
//     document.getElementById('registerPage').classList.toggle('active', page === 'register');
//     document.getElementById('loginTab').classList.toggle('active', page === 'login');
//     document.getElementById('registerTab').classList.toggle('active', page === 'register');
// }

// function togglePass(inputId, btn) {
//     const input = document.getElementById(inputId);
//     const isText = input.type === 'text';
//     input.type = isText ? 'password' : 'text';
//     btn.style.color = isText ? '#aaa' : '#1a6b2f';
// }

// function checkStrength(val) {
//     const segs = ['s1','s2','s3','s4'].map(id => document.getElementById(id));
//     const label = document.getElementById('strengthLabel');
//     let score = 0;
//     if (val.length >= 8) score++;
//     if (/[A-Z]/.test(val)) score++;
//     if (/[0-9]/.test(val)) score++;
//     if (/[^A-Za-z0-9]/.test(val)) score++;
//     const colors = ['#e53935', '#f59e0b', '#f59e0b', '#1a6b2f'];
//     const labels = ['Weak', 'Fair', 'Good', 'Strong'];
//     segs.forEach((s, i) => {
//         s.style.background = i < score ? colors[score - 1] : '#e4efe6';
//     });
//     if (val.length && label) {
//         label.textContent = labels[score - 1] || '';
//         label.style.color = colors[score - 1] || '#aaa';
//     } else if (label) {
//         label.textContent = '';
//     }
// }


// let validate = function validateRegisterForm(){
//     const form = document.getElementById('register-form');
//     let isFormValid;
//     form.addEventListener("submit",function(e){
//     let validFirstName = validateFirstName(e);
//     let validLastName = validateLastName(e);
//     let validPhone = validatePhone(e);
//     let validEmail = validateEmail(e);
//     let validForTerms = agreeToTerms();
//     let validPassword = validatePassword(e);
//     isFormValid = validFirstName && validLastName && validPhone && validateEmail && validPassword && validForTerms ;
//     if(isFormValid){
//         alert("Form Submitted Successfully");
//     }
// })
// return isFormValid;
// }();
// (function saveData(){
//     const form = document.getElementById('register-form');
//     form.addEventListener("submit",function(e){
//         if (validate) {
//     // Get all values
//     const newUser = {
//         firstName: document.getElementById('firstName').value,
//         lastName: document.getElementById('lastName').value,
//         phone: document.getElementById('regPhone').value.trim(),
//         email: document.getElementById('regEmail').value.trim(),
//         password: document.getElementById('regPass').value
//     };

//     // Get existing users array (or empty array if none)
//     let users = JSON.parse(localStorage.getItem('users')) || [];

//     // Check if email already registered
//     let alreadyExists = users.find(u => u.email === newUser.email);
//     if (alreadyExists) {
//         alert("This email is already registered. Please login.");
//         return;
//     }

//     // Save new user
//     users.push(newUser);
//     localStorage.setItem('users', JSON.stringify(users));

//     alert("Account created! Please sign in.");
//     showPage('login'); // switch to login tab
// }

//     })
//     })()


// function validateFirstName(e){
//     let isValidFirstName = false;
//     let firstname = document.getElementById('firstName').value;
//     let firstnameError = document.getElementById('first-name-error');
//     if(firstname === ''){
//         e.preventDefault();
//        firstnameError.style.display="block";
//        isValidFirstName = false;
    
//     }else if(firstname.length < 4){
//         e.preventDefault();
//         firstnameError.style.display = 'block';
//         firstnameError.innerText = "First Name must be greater than 4 ";
//         isValidFirstName = false;
//     }else{
//         firstnameError.style.display = 'none';
//         isValidFirstName = true;
//     }

//     return isValidFirstName;
// }

// function validateLastName(e){
//     let isValidLastName = false;
//     let lastname = document.getElementById('lastName').value;
//     let lastnameError = document.getElementById('last-name-error');
//     if(lastname === ''){
//         e.preventDefault();
//        lastnameError.style.display="block";
//        isValidLastName = false;
    
//     }else if(lastname.length < 4){
//         e.preventDefault();
//         lastnameError.style.display = 'block';
//         lastnameError.innerText = "Last Name must be greater than 4 ";
//         isValidLastName = false;
//     }else{
//         lastnameError.style.display = 'none';
//         isValidLastName = true;
//     }

//     return isValidLastName;
// }

// function validatePhone(e){
//     let isValidPhone = false;
//     let phone = document.getElementById('regPhone').value.trim();
//     let phoneError = document.getElementById('phone-nmbr-error');
//     let phonePattern = /^(\+92|92|0)?3[0-9]{9}$/;
//     if(phone === ''){
//         e.preventDefault();
//        phoneError.style.display="block";
//        isValidPhone = false;
    
//     }else if(!phonePattern.test(phone)){
//         e.preventDefault();
//         phoneError.style.display = 'block';
//         phoneError.innerText = "Wrong Phone Number";
//         isValidPhone = false;
//     }else{
//         phoneError.style.display = 'none';
//         isValidPhone = true;
//     }

//     return isValidPhone;
// }

// function validateEmail(e){
//     let isValidEmail = false;
//     let Email = document.getElementById('regEmail').value.trim();
//     let EmailError = document.getElementById('Email-error');
//     let EmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if(Email === ''){
//         e.preventDefault();
//        EmailError.style.display="block";
//        isValidEmail = false;
    
//     }else if(!EmailPattern.test(Email)){
//         e.preventDefault();
//         EmailError.style.display = 'block';
//         EmailError.innerText = "Wrong Email Number";
//         isValidEmail = false;
//     }else{
//         EmailError.style.display = 'none';
//         isValidEmail = true;
//     }

//     return isValidEmail;
// }

// function agreeToTerms(){
//     let checkboxError = document.getElementById('terms-error');
//     let checkbox = document.getElementById('agreeTerms');
//     let isValid = true;
//     if(!checkbox.checked){
//         isValid = false;
//         checkboxError.style.display = 'block';
//     }else{
//         isValid = true;
//         checkboxError.style.display = 'none';
//     }
//     return isValid;
// }
// function validatePassword(e){
//     let Password = document.getElementById("regPass").value;
//     let ConfirmPassword = document.getElementById("regPass2").value;
//     let PassError = document.getElementById("Pass-error");
//     let ConfirmPassError = document.getElementById("ConfirmPass-error");
//     let isValidPassword;
//     if(Password === ''){
//         e.preventDefault;
//         PassError.style.display = 'block';
//         isValidPassword = false;
        
//     }else if(Password.length < 8){
//         e.preventDefault;
//         PassError.style.display = 'block';
//         PassError.innerText = 'Password must contain 8 letters';
//         isValidPassword = false;

//     }else{
//         PassError.style.display = 'none';
//         isValidPassword = true;
//     }

//     if(ConfirmPassword === ''){
//         e.preventDefault;
//         ConfirmPassError.style.display = 'block';
//         isValidPassword = false;
//     }else if(Password != ConfirmPassword){
//         e.preventDefault;
//         ConfirmPassError.style.display = 'block';
//         ConfirmPassError.innerText = 'Password must be same as above';
//         isValidPassword = false;
//     }else{
//         ConfirmPassError.style.display = 'none';
//         isValidPassword = true;
//     }
//     return isValidPassword;
    

// }

// ============================================
// PAGE SWITCHING
// ============================================
function showPage(page) {
    document.getElementById('loginPage').classList.toggle('active', page === 'login');
    document.getElementById('registerPage').classList.toggle('active', page === 'register');
    document.getElementById('loginTab').classList.toggle('active', page === 'login');
    document.getElementById('registerTab').classList.toggle('active', page === 'register');
}

// ============================================
// PASSWORD TOGGLE
// ============================================
function togglePass(inputId, btn) {
    const input = document.getElementById(inputId);
    const isText = input.type === 'text';
    input.type = isText ? 'password' : 'text';
    btn.style.color = isText ? '#aaa' : '#1a6b2f';
}

// ============================================
// PASSWORD STRENGTH CHECKER
// ============================================
function checkStrength(val) {
    const segs = ['s1','s2','s3','s4'].map(id => document.getElementById(id));
    const label = document.getElementById('strengthLabel');
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    const colors = ['#e53935', '#f59e0b', '#f59e0b', '#1a6b2f'];
    const labels = ['Weak', 'Fair', 'Good', 'Strong'];
    segs.forEach((s, i) => {
        s.style.background = i < score ? colors[score - 1] : '#e4efe6';
    });
    if (val.length && label) {
        label.textContent = labels[score - 1] || '';
        label.style.color = colors[score - 1] || '#aaa';
    } else if (label) {
        label.textContent = '';
    }
}

// ============================================
// REGISTER FORM — SINGLE LISTENER
// ============================================
document.getElementById('register-form').addEventListener('submit', function(e) {
    e.preventDefault(); // always stop first, allow only if valid

    // Run all validations
    let validFirstName = validateFirstName();
    let validLastName  = validateLastName();
    let validPhone     = validatePhone();
    let validEmail     = validateEmail();
    let validPassword  = validatePassword();
    let validTerms     = agreeToTerms();

    let isFormValid = validFirstName && validLastName && validPhone
                      && validEmail && validPassword && validTerms;

    if (isFormValid) {
        const newUser = {
            firstName : document.getElementById('firstName').value.trim(),
            lastName  : document.getElementById('lastName').value.trim(),
            phone     : document.getElementById('regPhone').value.trim(),
            email     : document.getElementById('regEmail').value.trim(),
            password  : document.getElementById('regPass').value
        };

        let users = JSON.parse(localStorage.getItem('users')) || [];

        // Check duplicate email
        let alreadyExists = users.find(u => u.email === newUser.email);
        if (alreadyExists) {
            alert("This email is already registered. Please login.");
            showPage('login');
            return;
        }

        // Save user
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        alert("Account created! Please sign in.");
        showPage('login');
    }
});

// ============================================
// LOGIN FORM
// ============================================
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const input    = document.getElementById('loginInput').value.trim();
    const password = document.getElementById('loginPass').value;
    const loginError = document.getElementById('login-error');

    // Basic empty checks
    if (!input || !password) {
        loginError.style.display = 'block';
        loginError.innerText = "Please fill in all fields.";
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];

    let matchedUser = users.find(u =>
        (u.email === input || u.phone === input) && u.password === password
    );

    if (matchedUser) {
        // Save session
        localStorage.setItem('loggedInUser', JSON.stringify(matchedUser));

        // Remember Me
        const rememberMe = document.getElementById('rememberMe');
        if (rememberMe && rememberMe.checked) {
            localStorage.setItem('rememberedInput', input);
        } else {
            localStorage.removeItem('rememberedInput');
        }

        alert("Welcome back, " + matchedUser.firstName + "!");
        window.location.href = 'home.html'; // 👈 change to your homepage
    } else {
        loginError.style.display = 'block';
        loginError.innerText = "Invalid email/phone or password.";
    }
});

// ============================================
// REMEMBER ME — Pre-fill on page load
// ============================================
window.addEventListener('load', function () {
    const saved = localStorage.getItem('rememberedInput');
    if (saved) {
        const loginInput = document.getElementById('loginInput');
        const rememberMe = document.getElementById('rememberMe');
        if (loginInput) loginInput.value = saved;
        if (rememberMe) rememberMe.checked = true;
    }
});

// ============================================
// VALIDATION FUNCTIONS (no e parameter needed
// since we do e.preventDefault() at the top)
// ============================================
function validateFirstName() {
    let firstname = document.getElementById('firstName').value.trim();
    let error = document.getElementById('first-name-error');
    if (firstname === '') {
        error.style.display = 'block';
        error.innerText = "First name is required.";
        return false;
    } else if (firstname.length < 4) {
        error.style.display = 'block';
        error.innerText = "First name must be at least 4 characters.";
        return false;
    }
    error.style.display = 'none';
    return true;
}

function validateLastName() {
    let lastname = document.getElementById('lastName').value.trim();
    let error = document.getElementById('last-name-error');
    if (lastname === '') {
        error.style.display = 'block';
        error.innerText = "Last name is required.";
        return false;
    } else if (lastname.length < 4) {
        error.style.display = 'block';
        error.innerText = "Last name must be at least 4 characters.";
        return false;
    }
    error.style.display = 'none';
    return true;
}

function validatePhone() {
    let phone = document.getElementById('regPhone').value.trim();
    let error = document.getElementById('phone-nmbr-error');
    let pattern = /^(\+92|92|0)?3[0-9]{9}$/;
    if (phone === '') {
        error.style.display = 'block';
        error.innerText = "Phone number is required.";
        return false;
    } else if (!pattern.test(phone)) {
        error.style.display = 'block';
        error.innerText = "Enter a valid Pakistani phone number.";
        return false;
    }
    error.style.display = 'none';
    return true;
}

function validateEmail() {
    let email = document.getElementById('regEmail').value.trim();
    let error = document.getElementById('Email-error');
    let pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === '') {
        error.style.display = 'block';
        error.innerText = "Email is required.";
        return false;
    } else if (!pattern.test(email)) {
        error.style.display = 'block';
        error.innerText = "Enter a valid email address.";
        return false;
    }
    error.style.display = 'none';
    return true;
}

function agreeToTerms() {
    let checkbox = document.getElementById('agreeTerms');
    let error = document.getElementById('terms-error');
    if (!checkbox.checked) {
        error.style.display = 'block';
        return false;
    }
    error.style.display = 'none';
    return true;
}

function validatePassword() {
    let password  = document.getElementById("regPass").value;
    let confirm   = document.getElementById("regPass2").value;
    let passError = document.getElementById("Pass-error");
    let confError = document.getElementById("ConfirmPass-error");
    let isValid   = true;

    if (password === '') {
        passError.style.display = 'block';
        passError.innerText = "Password is required.";
        isValid = false;
    } else if (password.length < 8) {
        passError.style.display = 'block';
        passError.innerText = "Password must be at least 8 characters.";
        isValid = false;
    } else {
        passError.style.display = 'none';
    }

    if (confirm === '') {
        confError.style.display = 'block';
        confError.innerText = "Please confirm your password.";
        isValid = false;
    } else if (password !== confirm) {
        confError.style.display = 'block';
        confError.innerText = "Passwords do not match.";
        isValid = false;
    } else {
        confError.style.display = 'none';
    }

    return isValid;
}