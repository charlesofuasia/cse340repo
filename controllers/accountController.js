const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const msgModel = require("../models/message-model")
require("dotenv").config();

/**************************
 * Deliver login view
 ***********************/
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  });
}
/**************************
 * Deliver registration view
 **************************/
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

/*******************
 * Process registration
 ********************/
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Register",
      nav,
      errors: null,
    });
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 }
      );
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 *1000});
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }
      return res.redirect("/account/");
    }else{
      req.flash("notice", "Incorrect login details.")
      res.redirect("/account/login")
    }
  } catch (error) {
    return new Error("Access Forbidden");
  }
}
/*********************
 * Deliver account management view
 *********************/
async function buildAccountMgt(req, res) {
  const nav = await utilities.getNav();
  const unread = await msgModel.countUnreadMessages(res.locals.accountData.account_id);
  res.render("account/account-management", {
    title: "Account Management",
    nav,
    unread,
    errors: null,
  });
}
/********************
 * Function to log out of account
 ********************/
function logout(req, res){
 res.locals.loggedin = 0;
 res.redirect("/")
}

/*****************
 * build account update view
 ******************/
async function buildUpdateView(req, res){
  const nav = await utilities.getNav();
  const account_id = parseInt(req.params.account_id);
  const accData = await accountModel.getAccountDetailsById(account_id);
  res.render("account/update", {
    title: "Update " + accData[0].account_firstname,
    nav,
    account_firstname: accData[0].account_firstname,
    account_lastname: accData[0].account_lastname,
    account_email: accData[0].account_email,
    account_id: accData[0].account_id,
    errors: null,
  });
}

async function updateAccount(req, res){
  const nav = await utilities.getNav();
  const {
    account_id,
    account_firstname,
    account_lastname  ,
    account_email,
  } = req.body;

  const accountUpdated = await accountModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_id,
  );
  if (accountUpdated) {
    req.flash("notice", `${account_firstname} has been updated.`);
    const acctInfo = await accountModel.getAccountByEmail(account_email);
    delete acctInfo.account_password;
    const token = jwt.sign(acctInfo, process.env.ACCESS_TOKEN_SECRET, {expiresIn: 3600 * 1000});

    if (process.env.NODE_ENV == "development"){
      res.cookie("jwt", token, {httpOnly: true, maxAge: 3600 * 1000})
    }else {
      res.cookie("jwt", token, {httpOnly:true, secure: true, maxAge: 3600 * 1000})
    }
   res.redirect("/account/")
  }else {
    req.flash("notice", "The account update failed.")
    res.status(501).render("account/update", {
      title: "Update " + account_firstname,
      nav,
      account_firstname,
      account_lastname,
      account_email,
      errors: null,
    })
  }
}

/**********************
 * Process password update
 ***************************/
async function updatePassword(req, res){
  const nav = await utilities.getNav();
  const {account_id, account_password} = req.body;
  accData = await accountModel.getAccountDetailsById(account_id);

   // Hash the password before storing
    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the update.')
        res.status(500).render("account/update", {
            title: "Update Your Account",
            nav,
            errors: null,
            account_firstname: accData.account_firstname,
            account_lastname: accData.account_lastname,
            account_email: accData.account_email,
            account_id: accData.account_id
        })
    }

    const passwordChange = await accountModel.updatePassword(account_id, hashedPassword)

    if (passwordChange) {
      req.flash("notice", "You have successfully changed your password.")
      res.status(201).redirect("/account/")
    }else {
      req.flash("notice", "Password change was unsuccessful.")
      res.status(501).render("account/update", {
        title: "Update " + accData.account_firstname,
        nav,
        account_firstname: accData.account_firstname,
        account_lastname: accData.account_lastname,
        account_email: accData.account_email,
        account_id: accData.account_id,
        errors: null,

      })

    }
}


function logout(req, res){
  req.flash("notice", "You are now logged out.")
  res.clearCookie("jwt");
  res.clearCookie("sessionId");
  return res.redirect("/");
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildAccountMgt,
  buildUpdateView,
  updateAccount,
  updatePassword,
  logout,
};
