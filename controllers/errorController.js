const utilities = require("../utilities/");
exports.throwError = async (req, res, next) => {
  const error = new Error(
    "Oh no! There was a crash.Maybe try a different route"
  );
  error.status = error.status || 500;
  const nav = await utilities.getNav();
  const message = await utilities.buildErrorMessage(error);

  //   throw error;

  res.render("./errors/error", {
    title: error.status,
    nav,
    message,
  });
};
