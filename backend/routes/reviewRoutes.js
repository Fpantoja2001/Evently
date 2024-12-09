const express = require('express');
const Review = require('../model/reviewModel.js');
const router = express.Router();

//create a new review object
router.post('/review/create', async (req, res) => { 
    try {
        const {
            userName,
            reviewId,
            eventName,
            rating,
            comment,
        } = req.body;

        const newReview = await Review.create({
            userName,
            reviewId,
            eventName,
            rating,
            comment,
        });

        res.status(201).json({ message: 'Review created successfully.', Review: newReview });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all reviews of a user using the userName
router.get('/review/getUserReviews', async (req, res) => {
    try {
        const reviewsAndCount = await Review.findAndCountAll(req.params.id);
        const reviews = reviewsAndCount.rows;
        const count = reviewsAndCount.count;
        // Parse JSON strings for reviews
        const parsedReviews = reviews.map(review => ({
            ...review.toJSON(),
        }));
        res.json({"reviews": parsedReviews, "total": count});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a review
router.delete('/review/:id', async (req, res) => {
    try {
        const review = await Review.findByPk(req.params.id);
        if (!review) return res.status(404).json({ error: 'Review not found' });

        await review.destroy();
        res.json({ message: 'Review deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;