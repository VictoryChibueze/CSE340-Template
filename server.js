/* ******************************************
 * This server.js file is the primary file of the
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const session = require("express-session");
const pool = require("./database/");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const accountRoute = require("./routes/accountRoute");
const utilities = require("./utilities/index");
const errorRoute = require("./routes/errorRoute");
const bodyParser = require("body-parser");
const invModel = require("./models/inventory-model");

/* *************************************
 * Middleware
 * *************************************/

app.use(
  session({
    store: new (require("connect-pg-simple")(session))({
      createTableIfMissing: true,
      pool,
    }),
    secret:
      process.env.SESSION_SECRET ||
      "ad0bc01fc02da4f4685f2df3fb49bdf79c6ef392bd70c0c0f5f6a1d993b207b9bd42668a837af92ec98a55530a3dd4af081cdc61db48c0ba941149411bca27ff",
    resave: true,
    saveUninitialized: true,
    name: "sessionId",
  })
);

// Express Message Middleware
// Express Messages Middleware
app.use(require("connect-flash")());
app.use(function (req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
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

// Account Route
app.use("/account", accountRoute);
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
    message: message,
    nav,
  });
});
/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT || 5501;
const host = process.env.HOST;

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});
