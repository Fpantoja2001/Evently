import reviewData from "./review.json" with { type: "json" };

//get data using username
//TODO
var userReviews = reviewData.johndoe || [];

//helper function for creating a review div
function createDiv(review){
    const reviewElement = document.createElement('div');
        reviewElement.classList.add('review');
        reviewElement.innerHTML = `
            <h3>${review.eventName}</h3>
            <p>Rating: ${'⭐'.repeat(review.rating)} (${review.rating}/5)</p>
            <div class="comment">${review.comment}</div>
        `;
    return reviewElement;
}

//create a div element for each review already existing
const reviewsContainer = document.getElementById("reviewsContainer");
if(reviewsContainer){
    userReviews.forEach(review => {
        reviewsContainer.appendChild(createDiv(review));
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const reviewForm = document.getElementById('reviewForm');
    const reviewsContainer = document.getElementById('reviewsContainer');

    // Event listener for form submission
    reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get input values
        const eventName = document.getElementById('eventName').value.trim();
        const rating = document.getElementById('rating').value;
        const comment = document.getElementById('comment').value.trim();

        // Validate inputs
        if (!eventName || !rating) {
            alert('Please provide both an event name and a rating.');
            return;
        }

        // Create a review element
        var newReview = {};
        newReview.eventName = eventName;
        newReview.rating = rating;
        newReview.comment = comment || 'No comment provided.';

        // Append the review
        reviewData.johndoe.push(newReview);
        reviewsContainer.appendChild(createDiv(newReview));

        // Clear the form
        reviewForm.reset();
    });
});