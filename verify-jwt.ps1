$uri = "http://localhost:5050/login"

# Prompt the user for username and password
$username = Read-Host -Prompt "Enter username"
$password = Read-Host -Prompt "Enter password" -AsSecureString

# Convert the password to plain text
$passwordPlainText = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))

# Create the request body
$body = @{
  username = $username
  password = $passwordPlainText
} | ConvertTo-Json

# Send the login request
$response = Invoke-RestMethod -Uri $uri -Method POST -Body $body -ContentType "application/json"

# Check if login was successful
if ($response.success) {
  # Get the JWT token
  $jwtToken = $response.token
  Write-Host "Login successful. JWT Token: $jwtToken"
}
else {
  $errorMessage = $response.message
  Write-Host "Login failed. Error: $errorMessage"
}
