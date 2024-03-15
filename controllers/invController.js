const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/*****************
 * Build inventory by classification view
 ***********************/
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  console.log(data);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

/******************************
 * Build vehicle detail view
 * *************************/
invCont.buildVehicleDetail = async function (req, res, next) {
  const inv_id = await req.params.invId;
  const data = await invModel.getInventoryDetailByInvId(inv_id);
  const details = await utilities.buildVehicleDetail(data);
  let nav = await utilities.getNav();
  const vehicleYear = data[0].inv_year;
  const vehicleMake = data[0].inv_make;
  const vehicleModel = data[0].inv_model;
  res.render("./inventory/details", {
    title: `${vehicleYear} ${vehicleMake} ${vehicleModel} Details`,
    nav,
    details,
  });
};

/*****************************
 * A function to demonstrate internal
 * server error
 *************************/
invCont.intentionalError = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/details", {
    nav, // error is because the details needed to build the body at
    // ./inventory/details is not defined in this function.
  });
};

module.exports = invCont;
