const express = require('express');
const Message = require('../model/messageModel.js');
const router = express.Router();

// Create new message
router.post('/message', async (req,res) => {
    try {
        const newMessage = await Message.create(req.body)
        res.status(200).json(newMessage);
    } catch (error) {
        res.status(500).json(error);
    }
});

// Get messages from a conversation
router.get('/message/:conversationId', async (req,res) => {
    try {
        const messages = await Message.findAll({
            where: {"conversationId": req.params.conversationId},
        })
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json(error);
    }
}); 

// Get message by ID
router.get('/message/m/:messageId', async (req,res) => {
    try {
        const messages = await Message.findOne({
            where: {"messageId": req.params.messageId},
        })
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json(error);
    }
}); 

//
router.put('/message/u/:messageId', async (req,res) => {
    try {
        const message = await Message.findOne({
            where: {"messageId": req.params.messageId},
        }) 
        
        message["status"] = req.body["status"];
        await message.save()

        const newMessage = {
            ...message.toJSON()
        }

        res.status(200).json(newMessage)
    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router;