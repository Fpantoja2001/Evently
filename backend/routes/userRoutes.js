const express = require('express');
const User = require('../model/userModel.js');
const session = require('express-session');
const { CONSTRAINT } = require('sqlite3');
const router = express.Router();

// Create a new user
router.post('/user/create', async (req, res) => {
    try {
        const { name, email, password, bio, phoneNumber, age, gender, socialLinks, skills, hobbies, pfpImage } = req.body;

        const user = await User.create({
            name,
            email,
            password,
            bio,
            phoneNumber,
            age,
            gender,
            socialLinks,
            skills: JSON.stringify(skills), // Store skills as a JSON string
            hobbies: JSON.stringify(hobbies), // Store hobbies as a JSON string
            pfpImage,
        });

        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all users
router.get('/user/getAll', async (req, res) => {
    try {
        const users = await User.findAll();
        // Parse JSON strings for skills and hobbies
        const parsedUsers = users.map(user => ({
            ...user.toJSON(),
            skills: user.skills ? JSON.parse(user.skills) : [],
            hobbies: user.hobbies ? JSON.parse(user.hobbies) : [],
        }));
        res.json(parsedUsers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a user by ID
router.get('/user/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Parse JSON strings for skills and hobbies
        const parsedUser = {
            ...user.toJSON(),
            skills: user.skills ? JSON.parse(user.skills) : [],
            hobbies: user.hobbies ? JSON.parse(user.hobbies) : [],
        };

        res.json(parsedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a user
router.put('/user/:id', async (req, res) => {
    console.log("request body", req.body);
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        const allowedFields = ['name', 'email', 'password', 'bio', 'phoneNumber', 'age', 'gender', 'socialLinks', 'skills', 'hobbies', 'pfpImage'];
        const updates = req.body;

        Object.keys(updates).forEach((key) => {
            if (allowedFields.includes(key)) {
                if (key === 'skills' || key === 'hobbies') {
                    user[key] = Array.isArray(updates[key]) ? JSON.stringify(updates[key]) : updates[key];
                } else if (key === 'socialLinks' && typeof updates[key] === 'object') {
                    user[key] = JSON.stringify(updates[key]);
                } else {
                    user[key] = updates[key];
                }
            }
        });

        // Save the updated user
        await user.save();

        // Parse JSON strings for skills, hobbies, and socialLinks before sending the response
        const parsedUser = {
            ...user.toJSON(),
            skills: user.skills ? JSON.parse(user.skills) : [],
            hobbies: user.hobbies ? JSON.parse(user.hobbies) : [],
            socialLinks: user.socialLinks ? JSON.parse(user.socialLinks) : null,
        };

        res.json(parsedUser);
    } catch (error) {
        console.error('Error updating user:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Delete a user
router.delete('/user/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        await user.destroy();
        res.json({ message: 'User deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Auth session
router.post('/user/login', async (req, res) => {
    try {
        req.session.authenticated = true; 
        req.session.user = req.body;
        console.log(req.sessionID, req.session)
    } catch (error) {
        res.status(500).json({
            error: error.message,
        })
    }
})

module.exports = router;
