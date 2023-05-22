
function togglePasswordVisibility(inputId, iconId) {
  const passwordInput = document.getElementById(inputId);
  const eyeIcon = document.getElementById(iconId);

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    eyeIcon.classList.remove("fa-eye");
    eyeIcon.classList.add("fa-eye-slash");
    eyeIcon.style.color = "var(--error-color)";

    setTimeout(() => {
      passwordInput.type = "password";
      eyeIcon.classList.remove("fa-eye-slash");
      eyeIcon.classList.add("fa-eye");
      eyeIcon.style.color = "var(--success-color)";
    }, 2000);

  } else {
    passwordInput.type = "password";
    eyeIcon.classList.remove("fa-eye-slash");
    eyeIcon.classList.add("fa-eye");
    eyeIcon.style.color = "var(--success-color)";
  }

  passwordInput.addEventListener("input", () => {
    if (passwordInput.value === "") {
      eyeIcon.style.removeProperty("color");
    }
  });
}


function passwordMatchIndicator() {
  const passwordInput = document.getElementById("password");
  const cnfPasswordInput = document.getElementById("cnfpassword");
  const passwordIcon = document.getElementById("key1");
  const cnfPasswordIcon = document.getElementById("key2");

  if (passwordInput.value === cnfPasswordInput.value) {
    passwordIcon.style.color = "var(--success-color)";
    cnfPasswordIcon.style.color = "var(--success-color)";
  } else {
    passwordIcon.style.color = "var(--error-color)";
    cnfPasswordIcon.style.color = "var(--error-color)";
  }

  if (passwordInput.value === "" && cnfPasswordInput.value === "") {
    passwordIcon.style.removeProperty("color");
    cnfPasswordIcon.style.removeProperty("color");
  }
}