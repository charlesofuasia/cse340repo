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
        const sql = "SELECT * FROM public.message INNER JOIN public.account ON account.account_id = message.message_from WHERE message_to = $1 AND message_archived = false"
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
        const data = await pool.query("SELECT * FROM public.message JOIN public.account ON account.account_id = message.message_from WHERE message_id = $1", [message_id]);
        return data.rows[0];
        
    }catch (error){
        return error.message;
    }

}
/***************************
 * Count unread messages
 ************************/
async function countUnreadMessages(account_id){
    try {
        const sql = "SELECT * FROM public.message INNER JOIN public.account ON account.account_id = message_to WHERE account_id = $1 AND message_read = false AND message_archived = false";
        const result = await pool.query(sql, [account_id]);
        return result.rowCount;

    }catch (error){
        return error.message;
    }
}
/**********************
 * count archived messages
 ***********************/
async function countArchivedMessages(account_id){
    try {
        const result = await pool.query("SELECT * FROM public.message INNER JOIN public.account ON account.account_id = message.message_to WHERE account_id = $1 AND message_archived = true", [account_id]);
        return result.rowCount;
    }catch (error){
        return message.error;
    }
}
/************************
 * mark message as read
 ***********************/
async function markRead(message_id){
    try{
        return await pool.query("UPDATE public.message SET message_read = true WHERE message_id = $1", [message_id])
    }catch (error){
        return error.message
    }
}
/******************
 * archive message
 **********************/
async function archiveMessage(message_id){
    try{
        return await pool.query("UPDATE public.message SET message_archived = true WHERE message_id = $1", [message_id])
    }catch (error){
        return error.message
    }
}

/********************************
 * delete a message 
 ******************************/
async function deleteMessage(message_id){
    try{
        return await pool.query("DELETE FROM public.message WHERE message_id = $1", [message_id])
    }catch (error){
        return error.message;
    }
}

/***************************
 * deliver archived messages of an account
 ************************************/
async function getArchivedMessages(account_id){
    try{
        return await pool.query(`
        SELECT * FROM public.message
        INNER JOIN public.account
        ON message.message_from = account.account_id
        WHERE message_to = $1 AND message_archived = true`, [account_id] );
    }catch (error){
        return error.message;
    }
}

/****************************
 * delete a message
 ********************************/
async function deleteMessage(message_id){
    try{
        return await pool.query("DELETE FROM public.message WHERE message_id = $1", [message_id])
    }catch (error){
        return error.message;
    }
}





module.exports = {addNewMessage, 
                  getInboxMessages, 
                  getMessage, 
                  countUnreadMessages, 
                  countArchivedMessages,
                  markRead,
                  archiveMessage,
                  deleteMessage,
                  getArchivedMessages,
                  deleteMessage,
                }