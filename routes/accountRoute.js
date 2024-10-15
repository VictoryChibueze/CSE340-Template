const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/index");
const acctController = require("../controllers/accountController");

router.get("/login", utilities.handleErrors(acctController.buildLogin));
router.get("/register", utilities.handleErrors(acctController.buildRegister));
router.post(
  "/register",
  utilities.handleErrors(acctController.registerAccount)
);
module.exports = router;
