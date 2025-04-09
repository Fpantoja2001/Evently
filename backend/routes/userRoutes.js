const express = require('express');
const User = require('../model/userModel.js');
const session = require('express-session');
const router = express.Router();

// Create a new user
router.post('/user/create', async (req, res) => {
    try {
        const { name, username, email, password, bio, phoneNumber, age, gender, socialLinks, skills, hobbies, pfpImage, currentEvents, pastEvents, pronouns, followers, following, friends } = req.body;

        const user = await User.create({
            name,
            username,
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
            currentEvents: JSON.stringify(currentEvents),
            pastEvents,
            pronouns,
            followers:JSON.stringify(followers),
            following:JSON.stringify(following),
            friends:JSON.stringify(friends),
        });

        return res.status(201).json(user);
    } catch (error) {
        return res.status(500).json({"error":error.message})
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
            currentEvents: user.currentEvents ? JSON.parse(user.currentEvents) : [],
            followers: user.followers ? JSON.parse(user.followers) : [],
            following: user.following ? JSON.parse(user.following) : [],
            friends: user.friends ? JSON.parse(user.friends) : [],
        }));
        res.json(parsedUsers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Check Username and Email availability
router.post('/user/check', async (req, res) => {
    const usernameCheck = await User.findOne({where: {"username": req.body.username}});
    const emailCheck = await User.findOne({where: {"email": req.body.email}});

    if(usernameCheck && emailCheck){
        return res.status(401).json({
            "error": "username and email unavailable"
        })
    } else if (usernameCheck) {
        return res.status(401).json({
            "error": "username unavailable"
        })
    } else if (emailCheck){
        return res.status(401).json({
            "error": "email unavailable"
        })
    }

    return res.status(200).json({"message": "both username and email available"})
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
            currentEvents: user.currentEvents ? JSON.parse(user.currentEvents) : [],
            followers: user.followers ? JSON.parse(user.followers) : [],
            following: user.following ? JSON.parse(user.following) : [],
            friends: user.friends ? JSON.parse(user.friends) : [],
        };

        res.json(parsedUser);
    } catch (error) {
        res.status(500).json({ error: error.message, message: "user does not exists in db"});
    }
});

// Update a user
router.put('/user/:id', async (req, res) => {
    // console.log("request body", req.body['pfpImage'][0]);
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        // List of updatable fields
        const updatableFields = [
            'name', 
            'username',
            'email', 
            'password', 
            'bio', 
            'phoneNumber', 
            'age', 
            'gender', 
            'socialLinks', 
            'skills', 
            'hobbies', 
            'pfpImage',
            'currentEvents',
            'pastEvents',
            'pronouns',
            'followers',
            'following',
            'friends',
        ];

        // Update only provided fields
        for (const field of updatableFields) {
            if (req.body[field] !== undefined) {
                if (field === 'skills' || field === 'hobbies' || field === "currentEvents" || field === "socialLinks" || field === "followers" || field === "following" || field === "friends") {
                    // Convert to JSON string if it's an array/object
                    user[field] = req.body[field] ? JSON.stringify(req.body[field]) : null;
                } else {
                    user[field] = req.body[field];
                }
            }
        }

        await user.save();

        // Parse JSON strings for skills, hobbies, and socialLinks before sending the response
        const parsedUser = {
            ...user.toJSON(),
            skills: user.skills ? JSON.parse(user.skills) : [],
            hobbies: user.hobbies ? JSON.parse(user.hobbies) : [],
            socialLinks: user.socialLinks ? JSON.parse(user.socialLinks) : [], // need to parse it once you can add multiple links
            currentEvents: user.currentEvents ? JSON.parse(user.currentEvents) : [],
            followers: user.followers ? JSON.parse(user.followers) : [],
            following: user.following ? JSON.parse(user.following) : [],
            friends: user.friends ? JSON.parse(user.friends) : [],
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

// session generation on login
router.post('/user/login', async (req, res) => {
    try {
        if("email" in req.body && !("password" in req.body)) {
            const user = await User.findOne({where: {"email": (req.body.email).toLowerCase()}});
            
            if (user){
                res.status(200).json({
                    "validEmail": true,
                })
            } else {
                res.status(401).json({
                    "validEmail": false,
                    "error": "Email does not exist within database"
                })
            } 
        }

        if("password" in req.body) {
            const user = await User.findOne({where: {"email": (req.body.email).toLowerCase()}});

            if(user.password === req.body.password) {
                req.session.authenticated = true; 
                req.session.user = req.body;
                res.status(200).json({
                    id: req.sessionID,
                    isAuth: req.session.authenticated,
                    userData: req.session.user,
                    userId: user.id,
                });
            } else {
                res.status(401).json({
                    isAuth: false,
                    "error": "Invalid password"
                })
            }
        }
        
    } catch (error) {
        res.status(401).json({
            error: error.message,
        })
    }
})

// session deletion on logout
router.post('/logout', (req,res) => {
    try {
        req.session.destroy()
        res.json("success")
    } catch(error){
        res.status(500).json({
            error: error.message,
        })
    }
})

module.exports = router;
