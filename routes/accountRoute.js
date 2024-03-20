//Resources needed to build a login route

const express = require("express");
const router = new express.Router();
const accountCont = require("../controllers/accountController");
const utilities = require("../utilities/");
const regValidate = require("../utilities/account-validation");

//route to build login view
router.get("/login", utilities.handleErrors(accountCont.buildLogin));

//Route to build Registration view
router.get(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountCont.buildRegister)
);

//Route to register new account to database
router.post("/register", utilities.handleErrors(accountCont.registerAccount));

module.exports = router;
