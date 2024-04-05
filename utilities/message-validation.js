const utilities = require(".");
const {body, validationResult} = require("express-validator");
const validate = {};


/****************************
 * Compose validation rules
 *************************/
validate.composeValidationRules = () => {
    return [
        //message_to is required and must not be empty
        body("message_to")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("A receiver of the message is required."),

        //message_subject is required and must not be empty
        body("message_subject")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("A message subject is required."),

        //message_body is required and must not be empty
        body("message_body")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Message body cannot be empty.")

    ]
}

// check entered data and return errors if errors or continue
validate.checkComposeData = async (req, res, next) => {
    const {message_to, message_subject, message_body} = req.body;
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()){
        let nav = await utilities.getNav()
        res.render("messages_box/compose", {
            errors,
            title: "Compose Message",
            nav,
            message_to,
            message_subject,
            message_body,
        });
        return;
    }
    next();
}



module.exports = validate;