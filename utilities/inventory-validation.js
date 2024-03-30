const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {};
const classValidate = require("../models/inventory-model");

/********************************
 * Add classification validation rules
 *******************************/
validate.addClassificationValidationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isAlpha()
      .isLength({ min: 3 })
      .withMessage("Classification name must be min of 3 letters, no space")
      .custom(async (classification_name) => {
        const nameInUse = await classValidate.verifyNewClassification(
          classification_name
        );
        if (nameInUse) {
          throw new Error(
            `${classification_name} is already an existing classification. Choose a different name.`
          );
        }
      }),
  ];
};

/***********************************************
 * Check data and return errors  or continue
 * with classification addition process
 *******************************************/

validate.checkAddClassification = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name,
    });
    return;
  }
  next();
};

/***************************
 * add inventory validation rules
 ********************/
validate.addInvRules = () => {
  return [
    body("classification_id")
      .trim()
      .notEmpty()
      .withMessage("Select a classification"),

    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("An inventory make is required"),

    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("inventory model is required"),

    body("inv_year")
      .trim()
      .escape()
      .notEmpty()
      .isInt({ min: 1950, max: 2025 })
      .withMessage("A valid year is required."),

    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .isString()
      .isLength({ min: 10 })
      .withMessage("Description with at least 10 characters is required"),

    body("inv_image")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("image file path is required"),

    body("inv_thumbnail")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("image thumbnail file path is required"),

    body("inv_price")
      .trim()
      .escape()
      .notEmpty()
      .isInt({ min: 20 })
      .withMessage("A minimum price of 20 is required"),

    body("inv_price")
      .trim()
      .escape()
      .notEmpty()
      .isInt({ min: 0 })
      .withMessage("a minimum of 0 miles is required"),

    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("inventory color is required"),
  ];
};

validate.checkAddInv = async (req, res, next) => {
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

  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    const { classification_id } = req.body;
    const invClass = await utilities.buildClassificationList(classification_id);
    res.render("inventory/add-inventory", {
      errors,
      title: "Add Inventory",
      nav,
      invClass,
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
    return;
  }
  next();
};
/*******************
 * errors will be directed to the edit inventory view.
 ****************/

validate.checkUpdateData = async (req, res, next) => {
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

  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    const { classification_id } = req.body;
    const invClass = await utilities.buildClassificationList(classification_id);
    res.render("inventory/edit-inventory", {
      errors,
      title: `Edit ${inv_make} ${inv_model}`,
      inv_id,
      nav,
      invClass,
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
    return;
  }
  next();
};

module.exports = validate;
