const express = require("express");
const router = new express.Router();
const msgController = require("../controllers/messageController");
const utilities = require("../utilities/");
const msgValidate = require("../utilities/message-validation")


// Route to deliver message home
router.get("/",
utilities.checkLogin,
 utilities.handleErrors(msgController.getInbox));

// to deliver compose view
router.get("/compose",
utilities.checkLogin,
 utilities.handleErrors(msgController.buildComposeView));

//To post message to database
router.post("/compose",
 msgValidate.composeValidationRules(), 
 msgValidate.checkComposeData, 
 utilities.handleErrors(msgController.addNewMessage));

//To read message content
router.get("/read/:message_id",
 utilities.checkLogin, 
 utilities.handleErrors(msgController.readMessage));

 //return to inbox
 router.get("/return", utilities.checkLogin, utilities.handleErrors(msgController.getInbox))

//mark as read
router.post("/mark-read/:message_id", utilities.checkLogin, utilities.handleErrors(msgController.markRead))

//archive message
router.post("/archive/:message_id", utilities.checkLogin, utilities.handleErrors(msgController.archiveMessage))

//get archive
router.get("/archived", utilities.checkLogin, utilities.handleErrors(msgController.getArchivedMessages))

//delete message
router.post("/delete/:message_id", utilities.checkLogin, utilities.handleErrors(msgController.deleteMessage))


module.exports = router;