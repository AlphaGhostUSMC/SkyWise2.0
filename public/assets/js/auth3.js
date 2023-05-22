  function showNotification(message) {
    // Check if the browser supports notifications
    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notification");
      return;
    }
  
    // Check the notification permission
    if (Notification.permission === "granted") {
      // If permission is already granted, show the notification
      let notification = new Notification(message);
    } else if (Notification.permission !== "denied") {
      // Otherwise, request permission from the user
      Notification.requestPermission().then(function (permission) {
        if (permission === "granted") {
          let notification = new Notification(message);
        }
      });
    }
  }
  
  function validateForm() {
    const username = document.querySelector('.reg-username-input').value;
    const email = document.querySelector('.email-input').value;
    const password = document.querySelector('.reg-password-input').value;
    const cnfpassword = document.querySelector('.reg-cnfpassword-input').value;
  
    // Validation check 1: Username
    if (username.trim() === '') {
      showNotification('Username should not be empty.');
      return false;
    }
    if (username.length < 5 || username.length > 15) {
      showNotification('Username should be between 5 and 15 characters.');
      return false;
    }
    if (/^\d+$/.test(username)) {
      showNotification('Username should not be only numbers.');
      return false;
    }
    if (/[^a-zA-Z0-9]/.test(username)) {
      sowNotification('Username should not contain special characters.');
      return false;
    }
  
    // Validation check 2: Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showNotification('Email is not valid.');
      return false;
    }
  
    // Validation check 3: Password
    if (password.length < 8 || password.length > 16) {
      showNotification('Password should be between 8 and 16 characters.');
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      showNotification('Password should contain at least one uppercase letter.');
      return false;
    }
    if (!/[a-z]/.test(password)) {
      showNotification('Password should contain at least one lowercase letter.');
      return false;
    }
    if (!/[0-9]/.test(password)) {
      showNotification('Password should contain at least one number.');
      return false;
    }
    if (!/[!@#$%^&*]/.test(password)) {
      showNotification('Password should contain at least one special character.');
      return false;
    }
  
    // Validation check 4: Confirm Password
    if (password !== cnfpassword) {
      showNotification('Password and Confirm Password do not match.');
      return false;
    }
  
    // All checks passed
    return true;
  }
  
  
  
  document.addEventListener('DOMContentLoaded', function () {
    const registerButton = document.querySelector('.register.button-control');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const cnfPasswordInput = document.getElementById('cnfpassword');
  
    registerButton.addEventListener('click', validateForm);
  
    usernameInput.addEventListener('keypress', function (event) {
      if (event.key === 'Enter') {
        validateForm();
      }
    });
  
    emailInput.addEventListener('keypress', function (event) {
      if (event.key === 'Enter') {
        validateForm();
      }
    });
  
    passwordInput.addEventListener('keypress', function (event) {
      if (event.key === 'Enter') {
        validateForm();
      }
    });
  
    cnfPasswordInput.addEventListener('keypress', function (event) {
      if (event.key === 'Enter') {
        validateForm();
      }
    });
  });