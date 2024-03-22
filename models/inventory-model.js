const pool = require("../database/");

/* *******************
 * Get all classification data
 * *******************/

async function getClassifications() {
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  );
}

/********************************
 * Get all inventory items and
 * classification_name by classification_id
 **********************************/

async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
      JOIN public.classification AS c
      on i.classification_id = c.classification_id
      WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getclassificationbyid error " + error);
  }
}

/* *****************************
 * Function to retrieve specific vehicle
 * database by inv_id
 * **********************************/
async function getInventoryDetailByInvId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory
      WHERE inv_id = $1`,
      [inv_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getInventoryDetail error " + error);
  }
}

/******************
 * Add a new classification
 ******************************/
async function addClassification(classification_name) {
  try {
    const sql =
      "INSERT INTO public.classification(classification_name) VALUES($1) RETURNING *";
    return await pool.query(sql, [classification_name]);
  } catch (error) {
    return error.message;
  }
}

/****************
 * Get members list
 * From a table that does not exists
 * an intentional error
 ****************/
async function getMembers() {
  try {
    const data = await await pool.query(`SELECT * FROM public.members`);
    return data.rows;
  } catch (error) {
    return error;
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryDetailByInvId,
  getMembers,
  addClassification,
};
