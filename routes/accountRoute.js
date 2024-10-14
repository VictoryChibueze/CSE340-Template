const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/index");
const acctController = require("../controllers/accountController");

router.get("/account", utilities.handleErrors(acctController));

module.exports = router;
