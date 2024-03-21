//Needed resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/");

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
router.get(
  "/management",
  utilities.handleErrors(invController.buildManagement)
);

//Intentional Error route
router.get("/err", utilities.handleErrors(invController.intentionalError));

module.exports = router;
