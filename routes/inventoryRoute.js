const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/");
const invValidate = require("../utilities/inventory-validation");

// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);

// Route to build inventory details by inv_id view
router.get(
  "/detail/:invId",
  utilities.handleErrors(invController.buildInventoryDetails)
);
// add a new classification
router.post(
  "/add-classification",
  utilities.checkAuthorized,
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

// add new inventory
router.post(
  "/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkNewInventoryData,
  utilities.handleErrors(invController.addInventory)
);

module.exports = router;
