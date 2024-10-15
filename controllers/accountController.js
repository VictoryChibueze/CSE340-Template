const utilities = require("../utilities/index");

/* **********************************************
 * Deliver login view
 **************************************************/

async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  });
}

/* ********************************************
 ** Deliveer registration view
 * *********************************************/

async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}
module.exports = { buildLogin, buildRegister };
