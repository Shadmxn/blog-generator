const {
  CognitoIdentityProviderClient,
  SignUpCommand,
  InitiateAuthCommand,
  ConfirmSignUpCommand,
} = require("@aws-sdk/client-cognito-identity-provider");

const env = require("../../env");
const crypto = require("crypto");

const cognitoClient = new CognitoIdentityProviderClient({
  region: env.getAWSRegion(),
});

// Function to generate the secret hash for Cognito
function getSecretHash(username) {
  return crypto
    .createHmac("SHA256", env.getCognitoClientSecret())
    .update(username + env.getCognitoClientId())
    .digest("base64");
}

// Register a new user in Cognito
async function registerUser(email, password) {
  const input = {
    ClientId: env.getCognitoClientId(),
    Username: email,
    Password: password,
    SecretHash: getSecretHash(email), // Using the secret hash here
    UserAttributes: [
      {
        Name: "email",
        Value: email,
      },
    ],
  };

  const command = new SignUpCommand(input);
  try {
    const response = await cognitoClient.send(command);
    return {
      success: true,
      message: "User registered successfully!",
      response,
    };
  } catch (error) {
    console.error("Error registering user:", error);
    return {
      success: false,
      message: "Error during registration",
      error: error.message,
    };
  }
}

// Login the user by authenticating the credentials
async function loginUser(email, password) {
  const input = {
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: env.getCognitoClientId(),
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
      SECRET_HASH: getSecretHash(email), // Using the secret hash here as well
    },
  };

  const command = new InitiateAuthCommand(input);
  try {
    const response = await cognitoClient.send(command);
    return {
      success: true,
      accessToken: response.AuthenticationResult.AccessToken,
      idToken: response.AuthenticationResult.IdToken,
      refreshToken: response.AuthenticationResult.RefreshToken,
    };
  } catch (error) {
    console.error("Error logging in:", error);
    return {
      success: false,
      message: "Invalid username or password",
      error: error.message,
    };
  }
}

// Confirm user sign up with the verification code sent via email
async function confirmEmailCode(email, code) {
  const input = {
    ClientId: env.getCognitoClientId(),
    Username: email,
    ConfirmationCode: code,
    SecretHash: getSecretHash(email),
  };

  const command = new ConfirmSignUpCommand(input);
  try {
    await cognitoClient.send(command);
    return { success: true, message: "User confirmed successfully!" };
  } catch (error) {
    console.error("Error confirming user:", error);
    return {
      success: false,
      message: "Verification failed",
      error: error.message,
    };
  }
}

module.exports = {
  registerUser,
  loginUser,
  confirmEmailCode,
};
