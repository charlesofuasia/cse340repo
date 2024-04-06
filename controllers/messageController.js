const utilities = require("../utilities/");
const msgModel = require("../models/message-model")




async function getInbox(req, res){
    const nav = await utilities.getNav();
    const archived = await msgModel.countArchivedMessages(res.locals.accountData.account_id);
    const inbox = await utilities.getInboxMessages(res.locals.accountData.account_id);
    res.render("messages-box/inbox", {
        title: "Inbox",
        nav,
        archived,
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
    const archived = await msgModel.countArchivedMessages(res.locals.accountData.account_id);
    const inbox = await utilities.getInboxMessages(res.locals.accountData.account_id);
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
            archived,
            inbox,
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

/*******************************
 * module to mark a message a read.
 ***************************/
async function markRead(req, res){
    const message_id = req.params.message_id;
    const read = await msgModel.markRead(message_id);
    if (read){
        req.flash("notice", "You just marked a message as read.")
        res.redirect("/messages-box/")
    }
}


/*****************************
 * module to send a message to archive
 **********************************/
async function archiveMessage(req, res){
    const message_id = req.params.message_id;
    const archived = await msgModel.archiveMessage(message_id);
    if (archived){
        req.flash("notice", "You just sent a message to archive.")
        res.redirect("/messages-box/")
    }
}

async function getArchivedMessages(req, res){
    const nav = await utilities.getNav();
    const archived = await utilities.getArchivedMessages(res.locals.accountData.account_id);
    res.render("messages-box/archived", {
        title: "Archived Messages",
        nav,
        archived,
        errors: null,
        
    })
}

/******************
 * module to delete message
 ***********************/
async function deleteMessage(req, res){
    const message_id = req.params.message_id;
    const messageArchived = await msgModel.deleteMessage(message_id);
    if (messageArchived){
        req.flash("notice", "Message deleted.")
        res.redirect("/messages-box/")
    }
}






module.exports = {getInbox, buildComposeView, addNewMessage, readMessage, markRead, archiveMessage, getArchivedMessages, deleteMessage}