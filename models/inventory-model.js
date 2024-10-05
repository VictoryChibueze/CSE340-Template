const pool = require("../database/index.js");

/* ********************************
 * Get all classification data
 * ****************************  */

async function getClassifications() {
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  );
}

module.exports = { getClassifications };

/* **********************************************
 * Get all inventory items and classification_name by classification_id
 * ***********************************************/
