function showNotification(message) {
  if (!("Notification" in window)) {
    console.log("This browser does not support desktop notification");
    return;
  }

  if (Notification.permission === "granted") {
    let notification = new Notification(message);
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission()
      .then(function (permission) {
        if (permission === "granted") {
          let notification = new Notification(message);
        }
      })
      .catch(function (error) {
        console.error("Error occurred while requesting permission:", error);
      });
  }
}


document.addEventListener('DOMContentLoaded', () => {
  const loginButton = document.querySelector('.login');
  const rememberMeCheckbox = document.querySelector('#formCheck-1');

  // Function to save the username and password in local storage
  function saveCredentials(username, password) {
    localStorage.setItem('username', username);
    localStorage.setItem('password', password);
  }

  // Function to retrieve the saved username and password from local storage
  function getSavedCredentials() {
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');
    return { username, password };
  }

  // Function to clear the saved username and password from local storage
  function clearSavedCredentials() {
    localStorage.removeItem('username');
    localStorage.removeItem('password');
  }

  // Check if there are saved credentials
  const savedCredentials = getSavedCredentials();
  if (savedCredentials.username && savedCredentials.password) {
    // Pre-fill the login form with the saved credentials
    const usernameInput = document.querySelector('#username');
    const passwordInput = document.querySelector('#password');
    usernameInput.value = savedCredentials.username;
    passwordInput.value = savedCredentials.password;
    rememberMeCheckbox.checked = true;
  }

  loginButton.addEventListener('click', () => {
    const usernameInput = document.querySelector('#username');
    const passwordInput = document.querySelector('#password');

    const username = usernameInput.value;
    const password = passwordInput.value;

    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })
      .then(response => {
        if (response.ok) {
          // Login successful
          if (rememberMeCheckbox.checked) {
            // Save the username and password if remember me is checked
            saveCredentials(username, password);
          } else {
            // Clear the saved credentials if remember me is unchecked
            clearSavedCredentials();
          }
          // Redirect to app.html
          window.location.href = '/app.html';
        } else {
          // Login failed, show error notification
          return response.json().then(result => {
            showNotification(result.message);
          });
        }
      })
      .catch(error => {
        // Handle any other errors that occurred during the request
        console.error(error);
      });
  });
});
