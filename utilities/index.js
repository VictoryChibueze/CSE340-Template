const jwt = require("jsonwebtoken");
require("dotenv").config();
const invModel = require("../models/inventory-model");
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a id="nav-link" href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li >";
    list +=
      '<a id = "nav-link" href="/inv/type/' +
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

/* **************************************
 * Build the select list of classification items
 * ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let classificationList = `<select name="classification_id" `;
  classificationList += `id="classificationList" `;
  classificationList += `required>`;
  classificationList += `<option value=''>Choose a Classification</option>`;
  data.rows.forEach((row) => {
    classificationList += `<option value="${row.classification_id}"`;
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += ` selected `;
    }
    classificationList += `>${row.classification_name}</option>`;
  });
  classificationList += `</select>`;
  return classificationList;
};

Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = `<ul id="inv-display">`;
    data.forEach((vehicle) => {
      grid += `<li class="car-card">`;
      grid += `<div class="image-container">`;
      grid += `<a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">`;
      grid += `<img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors">`;
      grid += `</a></div>`;
      grid += `<div class="namePrice">`;
      grid += `<hr>`;
      grid += `<h2 class="car-card-heading">`;
      grid += `<a href="../../inv/detail/${vehicle.inv_id}" title="View `;
      grid += `${vehicle.inv_make} ${vehicle.inv_model} details">`;
      grid += `${vehicle.inv_make} ${vehicle.inv_model}</a>`;
      grid += `</h2>`;
      grid += `<span>$${new Intl.NumberFormat(`en-US`).format(
        vehicle.inv_price
      )}</span>`;
      grid += `</div>`;
      grid += `</li>`;
    });
    grid += `</ul>`;
  } else {
    grid += `<p class="notice">Sorry, no matching vehicles could be found.</p>`;
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
Util.buildErrorMessage = async function (error) {
  let message;
  message = `<div id="error-page">`;
  message += `<h2 id = "error-heading">${error.message}</h2>`;
  message += `<div id="error-container">`;
  message += `<img src="images/site/error.jpg" width="600" height="400" loading="lazy" alt="Cartoon Image of car crash" id="error-img">`;
  message += `</div>`;
  message += `</div>`;
  message += `<div id="error-overlay">`;
  message += `</div>`;
  return message;
};
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/*  Check if Employee or Admin level authorization
 * ************************************ */
// Util.checkAuthorized = (req, res, next) => {
//   Util.checkLogin(req, res, () => {
//     if (
//       res.locals.accountData.account_type == "Employee" ||
//       res.locals.accountData.account_type == "Admin"
//     ) {
//       next();
//     } else {
//       req.flash(
//         "notice",
//         "Unauthorized. You do not have permission to access the page."
//       );
//       return res.redirect("/account/login");
//     }
//   });
// };

Util.checkUserMatch = (req, res, next) => {
  Util.checkLogin(req, res, () => {
    if (res.locals.accountData.account_id == req.params.account_id) {
      next();
    } else {
      req.flash(
        "notice",
        "Unauthorized. You do not have permission to access the page."
      );
      return res.redirect("/account/login");
    }
  });
};

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = 1;
        next();
      }
    );
  } else {
    next();
  }
};

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};

module.exports = Util;
