//Resources needed to build a login route

const express = require("express");
const router = new express.Router();
const accountCont = require("../controllers/accountController");
const utilities = require("../utilities/");
const regValidate = require("../utilities/account-validation");

//route to build login view
router.get("/login", utilities.handleErrors(accountCont.buildLogin));

//Route to build Registration view
router.get("/register", utilities.handleErrors(accountCont.buildRegister));

//Route to register new account to database
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountCont.registerAccount)
);

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  utilities.handleErrors(accountCont.accountLogin)
);

//Route to deliver account management view
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountCont.buildAccountMgt)
);

//Route to deliver account update view
router.get("/update/:account_id", utilities.handleErrors(accountCont.buildUpdateView))

module.exports = router;
