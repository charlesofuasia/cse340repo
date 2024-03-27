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
  const classificationSelect = await utilities.buildClassificationList();
  res.render("./inventory/management", {
    title: "Management",
    nav,
    classificationSelect,
    errors: null,
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
/*****************************************
 * A function to build an add new inventory view
 **************************************/
invCont.buildAddInventoryView = async function (req, res, next) {
  const nav = await utilities.getNav();
  const { classification_id } = req.body;
  const invClass = await utilities.buildClassificationList(classification_id);
  res.render("./inventory/add-inventory", {
    title: "Add New Inventory",
    nav,
    invClass,
    errors: null,
  });
};

/************************************
 * Add new vehicle inventory to the database
 **********************************/
invCont.addNewInventory = async (req, res) => {
  const nav = await utilities.getNav();
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  const addInventory = await invModel.addNewInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  );
  if (addInventory) {
    req.flash(
      "notice",
      `${inv_make} ${inv_model} has been added to the inventory database`
    );
    res.status(201).render("inventory/management", {
      title: "Management",
      nav,
      errors: null,
    });
  } else {
    req.flash(
      "notice",
      "Sorry, the new item was not successfully added to the database"
    );
    res.status(501).render("inventory/management", {
      title: "Management",
      nav,
      errors: null,
    });
  }
};

/************************************
 * Edit vehicle inventory in the database
 **********************************/
invCont.updateInventory = async (req, res) => {
  let nav = await utilities.getNav();
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  );
  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model;
    req.flash("notice", `${itemName} has been successfully updated`);
    res.redirect("/inv/");
  } else {
    const classificationSelect = await utilities.buildClassificationList(
      classification_id
    );
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the update failed.");
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit" + itemName,
      classificationSelect: classificationSelect,
      nav,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

/*****************************************
 * A function to build edit inventory item view
 **************************************/
invCont.buildEditView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getInventoryDetailByInvId(inv_id);
  const classificationSelect = await utilities.buildClassificationList(
    itemData[0].classification_id
  );
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`;
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_description: itemData[0].inv_description,
    inv_image: itemData[0].inv_image,
    inv_thumbnail: itemData[0].inv_thumbnail,
    inv_price: itemData[0].inv_price,
    inv_miles: itemData[0].inv_miles,
    inv_color: itemData[0].inv_color,
    classification_id: itemData[0].classification_id,
  });
};
module.exports = invCont;
