//Needed resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/");
const inventoryValidate = require("../utilities/inventory-validation");
const invCont = require("../controllers/invController");

//Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);

//Router to build vehicle details
router.get(
  "/detail/:invId",
  utilities.handleErrors(invController.buildVehicleDetail)
);

//Router to build management view
router.get("/",
utilities.accountType,
 utilities.handleErrors(invController.buildManagement));

// Router to build add-classification view
router.get(
  "/add-classification",
  utilities.accountType,
  utilities.handleErrors(invController.buildAddClassificationView)
);

//Router to post new classification to the DB
router.post(
  "/add-classification",
  utilities.accountType,
  inventoryValidate.addClassificationValidationRules(),
  inventoryValidate.checkAddClassification,
  utilities.handleErrors(invController.addclassification)
);

// route to build the add-inventory view
router.get(
  "/add-inventory",
  utilities.accountType,
  utilities.handleErrors(invController.buildAddInventoryView)
);

//Router to post/add new inventory
router.post(
  "/add-inventory",
  utilities.accountType,
  inventoryValidate.addInvRules(),
  inventoryValidate.checkAddInv,
  utilities.handleErrors(invController.addNewInventory)
);

//Router to get json of inventory

router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);

//Route to deliver edit inventory view

router.get(
  "/edit/:inv_id",
  utilities.accountType,
  utilities.handleErrors(invController.buildEditView)
);

//Route for posting updated data
router.post(
  "/edit-inventory",
  utilities.accountType,
  inventoryValidate.addInvRules(),
  inventoryValidate.checkAddInv,
  utilities.handleErrors(invController.updateInventory)
);

// Route to build delete view
router.get("/delete/:inv_id",
utilities.accountType,
 utilities.handleErrors(invController.buildDeleteView))


// Route to delete inventory

router.post("/delete",
utilities.accountType,
 utilities.handleErrors(invController.deleteInventory))

//Intentional Error route
router.get("/err", utilities.handleErrors(invController.intentionalError));

module.exports = router;
