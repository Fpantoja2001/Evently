const express = require('express');
const Conversation = require('../model/conversationModel.js');
const router = express.Router();

// New Conversation

router.post('/conversations', async (req,res) => {
    try { 
        const {senderId, receiverId} = req.body;
        
        const newConversation = await Conversation.create({
            members: JSON.stringify([senderId, receiverId]),
        });
        res.status(200).json(newConversation);
    } catch (error) {
        res.status(500).json(error);
    }
});

// Get User Conversation 

router.get('/conversations/:userId', async (req,res) => {

    try {
        const conversation = await Conversation.findAll();

        const parsedConversations = conversation.map(convo => ({
            ...convo.toJSON(),
            members: convo.members ? JSON.parse(convo.members): [],
        })).filter(convo => convo.members.includes(req.params.userId))
        
        res.status(200).json(parsedConversations)
    } catch (error) {
        res.status(500).json(error)
    }
})

router.get('/conversations/c/:conversationId', async (req,res) => {

    try {
        const conversation = await Conversation.findByPk(req.params.conversationId);
        const parsedConversation = {
            ...conversation.toJSON(),
            members: JSON.parse(conversation.members)
        }
        res.status(200).json(parsedConversation)
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router;