// Toggle password visibility
function togglePassword(id) {
    let field = document.getElementById(id);
    field.type = (field.type === "password") ? "text" : "password";
}

// Validation
document.getElementById("signupForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let isValid = true;

    // Get values
    let firstName = document.getElementById("firstName").value.trim();
    let lastName = document.getElementById("lastName").value.trim();
    let email = document.getElementById("email").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;

    // Clear errors
    document.querySelectorAll(".error").forEach(e => e.innerText = "");
    document.getElementById("successMsg").innerText = "";

    // First Name
    if (firstName === "") {
        document.getElementById("firstNameError").innerText = "Required";
        isValid = false;
    }

    // Last Name
    if (lastName === "") {
        document.getElementById("lastNameError").innerText = "Required";
        isValid = false;
    }

    // Email
    let emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (!email.match(emailPattern)) {
        document.getElementById("emailError").innerText = "Invalid email";
        isValid = false;
    }

    // Phone
    let phonePattern = /^[0-9]{10,15}$/;
    if (!phone.match(phonePattern)) {
        document.getElementById("phoneError").innerText = "Invalid phone number";
        isValid = false;
    }

    // Username
    if (username.length < 4) {
        document.getElementById("usernameError").innerText = "Min 4 characters";
        isValid = false;
    }

    // Password
    if (password.length < 8) {
        document.getElementById("passwordError").innerText = "Min 8 characters";
        isValid = false;
    }

    // Confirm Password
    if (password !== confirmPassword) {
        document.getElementById("confirmPasswordError").innerText = "Passwords do not match";
        isValid = false;
    }

    // Success
    if (isValid) {
        document.getElementById("successMsg").innerText = "Account created successfully!";
    }
});