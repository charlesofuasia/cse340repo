const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {};

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
      .withMessage("Classification name must be min of 3 letters, no space"),
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

module.exports = validate;
