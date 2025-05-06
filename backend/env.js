require("dotenv").config();

module.exports = {
  getCognitoUserPoolId: () => process.env.COGNITO_USER_POOL_ID,
  getCognitoClientId: () => process.env.COGNITO_CLIENT_ID,
  getCognitoClientSecret: () => process.env.COGNITO_CLIENT_SECRET,
  getAWSRegion: () => process.env.AWS_REGION,
};
