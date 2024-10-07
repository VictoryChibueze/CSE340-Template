const invModel = require("../models/inventory-model");
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

Util.buildClassificationGrid = async function (data) {
  let grid;
  console.log("YOU" + data);
  console.log(data.length);
  if (data.length > 0) {
    grid = '<ul id ="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }

  return grid;
};
Util.buildEachInventoryDetails = async function (data) {
  let detail;
  detail = `<div id=details-container>`;
  detail += `<div class="image-container">`;
  detail += `<img src="${data.inv_image}" alt="Image of ${data.inv_make} ${data.inv_model} on CSE Motors" id="vehicle-img-large">`;
  detail += `</div>`;
  detail += `<section id="vehicle-details">`;
  detail += `<h2 class="section-title">${data.inv_make} ${data.inv_model} Details</h2>`;
  detail += `<table><tbody>`;
  detail += `<tr><td><span class="details-label">Price: $${new Intl.NumberFormat(
    "en-US"
  ).format(data.inv_price)}</span></td></tr>`;
  detail += `<tr><td><span class="details-label">Description: </span>`;
  detail += `<span class="details-text">${data.inv_description}</span></td></tr>`;
  detail += `<tr><td><span class="details-label">Color: </span>`;
  detail += `<span class="details-text">${data.inv_color}</span></td></tr>`;
  detail += `<tr><td><span class="details-label">Miles: </span>`;
  detail += `<span class="details-text">${new Intl.NumberFormat("en-US").format(
    data.inv_miles
  )}</span></td></tr>`;
  detail += `</tbody></table></section></div>`;
  return detail;
};
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;
