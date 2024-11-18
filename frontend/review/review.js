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
        const reviewElement = document.createElement('div');
        reviewElement.classList.add('review');
        reviewElement.innerHTML = `
            <h3>${eventName}</h3>
            <p>Rating: ${'⭐'.repeat(rating)} (${rating}/5)</p>
            <p>${comment || 'No comment provided.'}</p>
            <hr>
        `;

        // Append the review
        reviewsContainer.appendChild(reviewElement);

        // Clear the form
        reviewForm.reset();
    });
});