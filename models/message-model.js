const pool = require("../database/")

/**********************************************
 * To insert new message data into message table
 ********************************************/
async function addNewMessage(
    message_subject,
    message_body,
    message_to,
    message_from,
    
){
    try {
        const sql = "INSERT INTO public.message(message_subject, message_body, message_to, message_from) VALUES ($1, $2, $3, $4) RETURNING *"
        return await pool.query(sql, [
            message_subject,
            message_body,
            message_to,
            message_from,
            
        ])
    }catch (error){
        console.error("Insert message error: " + error)
    }
}

/********************************
 * To get all the details of inbox from 
 * both the message and account table
 **********************************/
async function getInboxMessages(account_id){
    try {
        const sql = "SELECT * FROM public.message INNER JOIN public.account ON account.account_id = message.message_to WHERE message_to = $1 AND message_archived = false"
        return await pool.query(sql, [account_id])
    }catch (error){
        return error.message;
    }

}

/********************************
 * get message content by message_id
 ***************************************/
async function getMessage(message_id) {
    try {
        return pool.query(`
        SELECT * FROM public.message 
        WHERE message_id = $1
        RETURNING *
        `[message_id])
    }catch (error){
        return error.message;
    }

}





module.exports = {addNewMessage, getInboxMessages, getMessage,}