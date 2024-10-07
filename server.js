/* ******************************************
 * This server.js file is the primary file of the
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const utilities = require("./utilities/index");
const errorRoute = require("./routes/errorRoute");
const invModel = require("./models/inventory-model");
/* ***********************
 * View engine
 *************************/

app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

/* ***********************
 * Routes
 *************************/
app.use(static);

// Index route
app.get("/", utilities.handleErrors(baseController.buildHome));

// Inventory Route

app.use("/inv", inventoryRoute);
app.use(errorRoute);
// File Not Found - Must be lasst in the List

app.use(async (req, res, next) => {
  next({ status: 404, message: "Sorry we appear to have lost that page" });
});
/* **************************************
 *Express Error handler
 * Place after all other middleware
 * *******************************************/

app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();

  console.error(`Error at: "${req.params} ${req.originalUrl}": ${err.message}`);
  if (err.status == 404) {
    message = err.message;
  } else {
    message = `Oh no! There is a crash somewhere.Maybe try another route`;
  }
  res.render("errors/error", {
    title: err.status || "Server Error",
    message: err.message,
    nav,
  });
});
/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT || 3000;
const host = process.env.HOST;

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});
