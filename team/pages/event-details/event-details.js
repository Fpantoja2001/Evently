document.addEventListener('DOMContentLoaded', function() {

    fetch('placeholder_for_data')  
        .then(response => response.json())
        .then(data => {
            document.getElementById('rating-text').textContent = data.ratingText;
            document.getElementById('event-name').textContent = data.eventName;
            document.getElementById('category').textContent = data.category;
            document.getElementById('date-time').textContent = data.eventTime;
            document.getElementById('event-creators').textContent = data.eventCreators;
            document.getElementById('attendees-amount').textContent = `${data.attendeesCount} Attendees`;
            document.getElementById('address').textContent = data.eventAddress;
            document.getElementById('description').textContent = data.eventDescription;

            ratingFloat = parseFloat(document.getElementById('rating-text').textContent);
            const stars = document.querySelectorAll('.stars .star');
            stars.forEach((star, index) => {
                if(index < ratingFloat){
                    star.classList.add("star-filled");
                } else {
                    star.classList.remove("star-filled");
                }
            });
        })
        .catch(error => console.error('Error fetching event data:', error));
});
