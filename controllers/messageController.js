const utilities = require("../utilities/");
const msgModel = require("../models/message-model")




async function getInbox(req, res){
    const nav = await utilities.getNav();
    const inbox = await utilities.getInboxMessages(res.locals.accountData.account_id)
    res.render("messages-box/inbox", {
        title: "Inbox",
        nav,
        inbox,
        
    })
}

/******************************
 * To build compose message view
 *******************************/
async function buildComposeView(req, res){
    const nav = await utilities.getNav();
    const accountSelect = await utilities.buildAccountSelect();
    res.render("messages-box/compose", {
        title: "Compose Message",
        nav,
        accountSelect,
        errors: null,
    })
}
/*********************
 * process new message
 ********************/
async function addNewMessage(req, res){
    const nav = await utilities.getNav();
    const accountSelect = await utilities.buildAccountSelect();
    const {
        message_subject,
        message_body,
        message_to,
        message_from,

    } = req.body;
    const addMessage = await msgModel.addNewMessage(
        message_subject,
        message_body,
        message_to,
        message_from
    );
    if (addMessage){
        req.flash("notice", "Your message has been sent");
        res.status(201).render("messages-box/inbox", {
            title: "Message Inbox",
            nav,
            errors: null,
        })
    }else {
        req.flash("notice", "The process failed.");
        res.status(501).render("messages-box/compose", {
            title: "Compose Message",
            nav,
            accountSelect,
            errors: null,
        })
    }
}

/********************
 * Read message details
 **************************/
async function readMessage(req, res){
    const nav = await utilities.getNav();
    const message_id = req.params.message_id;
    const msgBody = await utilities.displayMessage(message_id);
    res.render("messages-box/read", {
        title: "Message Content",
        nav,
        msgBody,
        errors: null,
    })

}








module.exports = {getInbox, buildComposeView, addNewMessage, readMessage}