document.addEventListener('DOMContentLoaded', function() {

    //fetch('placeholder_for_data')  
    //   .then(response => response.json())
    //   .then(data => {
            let ratingFloat = 3.80;
            let ratingTextElement = document.getElementById('rating-text');
            ratingTextElement.textContent = `${ratingFloat} Stars`;
            document.getElementById('event-name').textContent = "Event Name";
            document.getElementById('event-time-date').textContent = "0:00 X-XX-XX";
            document.getElementById('privacy-option').textContent = "Public";
            document.getElementById('invite-option').textContent = "Community";
            document.getElementById('limit-option').textContent = "Limited";
            document.getElementById('reservation-option').textContent = "Reservation";
            document.getElementById('category-option').textContent = "Category";
            document.getElementById('event-creators').textContent = "Event Creators";
            document.getElementById('event-address').textContent = "Address";
            document.getElementById('event-description').textContent = "Description: The state has a program called the Agricultural Protection Program (APR) that works with willing farmers to buy a conservation easement on farms with prime soils as a way to help perpetuate agriculture in MA. To the best of my knowledge, they don't prioritize any farms beyond prime soils.  What other ways could we prioritize lands for agricultural protection in Massachusetts?Description: The state has a program called the Agricultural Protection Program (APR) that works with willing farmers to buy a conservation easement on farms with prime soils as a way to help perpetuate agriculture in MA. To the best of my knowledge, they don't prioritize any farms beyond prime soils.  What other ways could we prioritize lands for agricultural protection in Massachusetts?Description: The state has a program called the Agricultural Protection Program (APR) that works with willing farmers to buy a conservation easement on farms with prime soils as a way to help perpetuate agriculture in MA. To the best of my knowledge, they don't prioritize any farms beyond prime soils.  What other ways could we prioritize lands for agricultural protection in Massachusetts?Description: The state has a program called the Agricultural Protection Program (APR) that works with willing farmers to buy a conservation easement on farms with prime soils as a way to help perpetuate agriculture in MA. To the best of my knowledge, they don't prioritize any farms beyond prime soils.  What other ways could we prioritize lands for agricultural protection in Massachusetts?";


            const stars = document.querySelectorAll('.stars .star');
            stars.forEach((star, index) => {
                let rating = index + 1;
                if (rating <= Math.floor(ratingFloat)) {
                    star.classList.add("star-filled");
                    star.classList.remove("star-half", "star-quarter", "star-three-quarter");
                }
                else if (rating - 0.25 <= ratingFloat) {
                    star.classList.add("star-three-quarter");
                    star.classList.remove("star-filled", "star-quarter", "star-half");
                }
                else if (rating - 0.5 <= ratingFloat) {
                    star.classList.add("star-half");
                    star.classList.remove("star-filled", "star-quarter", "star-three-quarter");
                }
                else if (rating - 0.75 <= ratingFloat) {
                    star.classList.add("star-quarter");
                    star.classList.remove("star-filled", "star-half", "star-three-quarter");
                }
 
                else {
                    star.classList.remove("star-filled", "star-half", "star-quarter");
                }
            });
    //})
    //.catch(error => console.error('Error fetching event data:', error));
});
