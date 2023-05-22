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

document.addEventListener('DOMContentLoaded', () => {
  const loginButton = document.querySelector('.login');

  loginButton.addEventListener('click', async () => {
    const usernameInput = document.querySelector('#username');
    const passwordInput = document.querySelector('#password');

    const username = usernameInput.value;
    const password = passwordInput.value;

    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const result = await response.json();

    if (response.ok) {
      // Login successful, redirect to app.html
      window.location.href = '/app.html';
    } else {
      // Login failed, show error notification
      showNotification(result.message);
    }
  });
});