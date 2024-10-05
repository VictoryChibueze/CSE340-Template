const invModel = require("../models/inventory-model");
const utilities = require("../utilities/index");

const invCont = {};

/* ********************************
 *  Build inventory by classification
 *  *********************************/
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.param.classification_id;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildByClassificationGrid(data);
  const nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

module.exports = invCont;
