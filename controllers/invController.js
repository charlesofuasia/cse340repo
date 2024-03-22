const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/*****************
 * Build inventory by classification view
 ***********************/
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
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

/*************************************
 * A function to build the management view
 ***************************************/
invCont.buildManagement = async function (req, res, next) {
  const nav = await utilities.getNav();
  res.render("./inventory/management", {
    title: "Management",
    nav,
  });
};

/*******************
 * A function to build
 * add-classification view
 **********************/
invCont.buildAddClassificationView = async function (req, res, next) {
  const nav = await utilities.getNav();
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  });
};

/*********************
 * A function to add new classification
 *************************/
invCont.addclassification = async function (req, res) {
  let nav = await utilities.getNav();
  const { classification_name } = req.body;
  const addClass = await invModel.addClassification(classification_name);
  if (addClass) {
    req.flash(
      "notice",
      `${classification_name} has now been added as a new type`
    );
    res.status(201).render("inventory/management", {
      title: "Management",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the new class addition was not successful.");
    res.status(501).render("inventory/management", {
      title: "Management",
      nav,
      errors: null,
    });
  }
};

invCont.buildAddInventoryView = async function (req, res, next) {
  const nav = await utilities.getNav();
  res.render("./inventory/add-inventory", {
    title: "Add New Inventory",
    nav,
    errors: null,
  });
};

/*****************************
 * A function to demonstrate internal
 * server error
 *************************/
invCont.intentionalError = async function (req, res, next) {
  let nav = await utilities.getNav();
  let data = await invModel.getMembers();
  let list = await utilities.buildMemberList(data);
  res.render("./inventory/details", {
    title: "Members",
    nav,
    list,
  });
};

module.exports = invCont;
