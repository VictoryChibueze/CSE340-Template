const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/index");
const acctController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");

router.get("/login", utilities.handleErrors(acctController.buildLogin));
router.get("/register", utilities.handleErrors(acctController.buildRegister));
router.post(
  "/register",
  regValidate.registrationRules,
  regValidate.checkRegData,
  utilities.handleErrors(acctController.registerAccount)
);

// process the login attempt
router.post("/login", (req, res) => {
  res.status(200).send("login process");
});
module.exports = router;
