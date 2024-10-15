const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/index");
const acctController = require("../controllers/accountController");

router.get("/login", utilities.handleErrors(acctController.buildLogin));
router.get("/register", utilities.handleErrors(acctController.buildRegister));
module.exports = router;
