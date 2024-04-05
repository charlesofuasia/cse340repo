const invModel = require("../models/inventory-model");
const accountModel = require("../models/account-model");
const Util = {};
const jwt = require("jsonwebtoken");
require("dotenv").config();
const msgModel = require("../models/message-model")

/***************
 * Constructs the nav HTML unordered list
 ***************/
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title = "Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title = "See our inventory of  ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/*************************
 * Build the classification view HTML
 ************************/

Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/************************
 * function to build view
 * of vehicle details by inv_id
 ********************/
Util.buildVehicleDetail = async function (data) {
  let details = "";
  if (!data) {
    details += "<p>Sorry, this product is not in stock. </p>";
  } else {
    details += '<div id="details-view">';
    details += '<div id="image-box">';
    details +=
      '<img src="' +
      data[0].inv_image +
      '"' +
      ' alt="Image of ' +
      data[0].inv_year +
      " " +
      data[0].inv_make +
      " " +
      data[0].inv_model;
    details += '"/>';
    details += "</div>";
    details += '<div id="info-box">';
    details += "<h2> Details of ";
    details +=
      data[0].inv_year + " " + data[0].inv_make + " " + data[0].inv_model;
    details += "</h2>";
    details +=
      '<p class="bold">Price: $' +
      new Intl.NumberFormat("en-US").format(data[0].inv_price) +
      "</p>";
    details +=
      '<p><span class="bold">Description:</span> ' +
      data[0].inv_description +
      "</p>";
    details +=
      '<p><span class="bold">Color:</span> ' + data[0].inv_color + "</p>";
    details +=
      '<p><span class="bold">Miles:</span> ' +
      new Intl.NumberFormat("en-US").format(data[0].inv_miles) +
      "</p>";

    details += "</div>";
    details += "</div>";
  }
  return details;
};

/*******************
 * Build members list
 * Intentional error
 ***************/
Util.buildMemberList = async function (data) {
  let list = '<ol id="members-list">';
  data.forEach((member) => {
    list += "<li>";
    list += member.member_id + " " + member.member_name;
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/*********************
 * to build a select list from classification
 ****************************/

Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let classificationList =
    '<select name="classification_id" id="classificationList" required>';
  classificationList += "<option value=''>Choose a Classification</option>";
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"';
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected ";
    }
    classificationList += ">" + row.classification_name + "</option>";
  });
  classificationList += "</select>";
  return classificationList;
};

/*********************************
 * To build a select list of accounts
 *********************************/
Util.buildAccountSelect = async function(message_to = null){
  const data = await accountModel.getAccounts();
  let accountSelect = '<select name="message_to" id="msgTo" required>';
      accountSelect += "<option value=''>Select Recipient</option>";
  data.rows.forEach((row) => {
    accountSelect += '<option value="' + row.account_id +'"';
    if (message_to != null && row.account_id == message_to){
      accountSelect += " selected ";
    }
    accountSelect += ">"+ row.account_firstname + " " + row.account_lastname + "</option>";
  });
  accountSelect += "</select>";
  return accountSelect;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = 1;
        next();
      }
    );
  } else {
    next();
  }
};

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};

/******************************
 * Function to check account type
 **************************/
Util.accountType = (req, res, next) => {
  if (res.locals.accountData.account_type == "Employee" || res.locals.accountData.account_type == "Admin"){
    next()
  }else{
    req.flash("notice", "Access is forbidden.")
    return res.redirect("/account/")
  }
}

/******************************************
 * To construct a display of inbox messages 
 ***************************************/
Util.getInboxMessages = async (account_id) => {
  const data = await msgModel.getInboxMessages(account_id);
  let inbox;
  if (!data){
    inbox = "<p>You have no message in your inbox.</p>"
  }else{
    inbox = "<table>"
    inbox += "<thead><tr><th>Received</th><th>Subject</th><th>From</th><th>Read</th></tr></thead>"
    inbox += "<tbody>"
    data.rows.forEach((row) => {
      inbox += "<tr><td>" + row.message_created.toLocaleString("en-US", "narrow") + "</td>"
      inbox += `<td><a href="/messages-box/read/${row.message_id}">` + row.message_subject + "</a></td>"
      inbox += "<td>" +  getName(row.message_from) + "</td>"
      inbox += "<td>" + row.message_read + "</td> </tr>"
    })
    inbox += "</tbody>"
    inbox += "</table>"

  }
  return inbox;
}

/*****************************
 * display message body
 ***********************/
Util.displayMessage = async (message_id) => {
  const data = await msgModel.getMessage(message_id);

  let display = '<div class="showMsg">'
  //display += `<p> Received: ${data.row[0].message_created.toLocaleString("en-US", "normal")}</p>`
  display += `<p>From: ${data.row.message_from}</p>`
  display += `<p>Subject: ${data.row.message_subject}</p>`;
  display += `<p>${data.row.message_body}</p>`
}

async function getName(message_from){
  const data = await accountModel.getAccountDetailsById(message_from);
  return data.account_firstname + " " + data.account_lastname; 
}




module.exports = Util;
