const userServices = require("./users.services");

exports.signupUser = async (req, res) => {
  const { email, password, city, province, country, formattedAddress } =
    req.body;
  const result = await userServices.registerUser(
    email,
    password,
    city,
    province,
    country,
    formattedAddress
  );
  result.success ? res.json(result) : res.status(400).json(result);
};

exports.confirmSignup = async (req, res) => {
  const { email, otp } = req.body;
  const result = await userServices.confirmEmailCode(email, otp);
  result.success ? res.json(result) : res.status(400).json(result);
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  const result = await userServices.loginUser(email, password);
  result.success ? res.json(result) : res.status(401).json(result);
};

exports.verifyToken = async (req, res) => {
  const { token } = req.body;
  const valid = await userServices.verifyIdToken(token);
  res.json({ valid });
};
