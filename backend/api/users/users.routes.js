const express = require("express");
const router = express.Router();
const handlers = require("./users.handlers");

router.post("/signup", handlers.signupUser);
router.post("/confirm-signup", handlers.confirmSignup);
router.post("/login", handlers.loginUser);
router.post("/verify-token", handlers.verifyToken);

module.exports = router;
