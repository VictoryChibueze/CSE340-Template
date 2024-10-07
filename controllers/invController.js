const utilities = require("../utilities/index");
const invModel = require("../models/inventory-model");

const invCont = {};

/* ********************************
 *  Build inventory by classification
 *  *********************************/
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;

  const data = await invModel.getInventoryByClassificationId(classification_id);
  console.log("classification" + data);
  const grid = await utilities.buildClassificationGrid(data);
  const nav = await utilities.getNav();

  const className = data[0].classification_name;
  // console.log(className);

  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

invCont.buildInventoryDetails = async function (req, res, next) {
  const inv_id = req.params.invId;
  const data = await invModel.getDetailsByInventoryId(inv_id);
  const details = await utilities.buildEachInventoryDetails(data);
  const nav = await utilities.getNav();
  const vehicleTitle = `${data.inv_year} ${data.inv_make} ${data.inv_model}`;

  res.render("./inventory/details", {
    title: vehicleTitle,
    nav,
    details,
  });
};
module.exports = invCont;
