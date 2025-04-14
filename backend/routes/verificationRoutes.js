const express = require('express');
const Verification = require('../model/verificationModel.js');
const router = express.Router()

router.post('/verification', async (req, res) => {
    try {
        const {requester} = req.body;

        // Check if the user has requested multiple verification
        const otherVerificationCodes = await Verification.findAll({
            where: {verificationRequester: requester}
        })

        // Delete existing requested verification codes
        if (otherVerificationCodes.length > 0) {
            console.log("Deleting existing codes:", otherVerificationCodes);
            await Verification.destroy({
              where: { verificationRequester: requester },
            });
        }

        // Create new code for User
        const newVerificationCode = await Verification.create({
            verificationRequester: requester
        })

        return res.status(201).json(newVerificationCode);
    } catch (error) {
        return res.status(500).json({"error":error.message})
    }
});

router.get('/verification/:userId', async (req, res) => {
    try {
        const verificationCode = await  Verification.findAll({
            where: {verificationRequester: req.params.userId}
        });

        res.status(200).json(verificationCode[0])
    } catch (error) {
        res.status(500).json({"error": error})
    }
})

router.delete('/verification/delete/:userId', async (req, res) => {

    try{ 
        const verificationCode = await  Verification.findAll({
            where: {verificationRequester: req.params.userId}
        });

        if (verificationCode.length > 0) {
            await Verification.destroy({
              where: { verificationRequester: req.params.userId },
            });
        }

        res.status(200).json({"message": "Verification Code Deleted Successfully"})
    } catch (error) {
        res.status(500).json({"error": error})
    }
    


})

module.exports = router;