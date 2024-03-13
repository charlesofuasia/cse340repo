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
  console.log(data);
  const vehicleMake = data.inv_make;
  const vehicleModel = data.inv_model;
  res.render("./inventory/details", {
    title: `${vehicleMake} ${vehicleModel} details`,
    nav,
    details,
  });
};

module.exports = invCont;