import reviewData from "../review/review.json" with { type: "json" };

const requestButton = document.getElementById('button-request');
const joinButton = document.getElementById('button-join');
const dontJoinButton = document.getElementById('button-decline');

document.addEventListener('DOMContentLoaded', async function() {
  const ratings = reviewData.johndoe.map(item => item.rating); // GETTING REVIEW DATA
  const sum = ratings.reduce((total, val) => total + val, 0);
  const meanrating = sum/ratings.length;

  const url = new URL(window.location.href); // GETTING URL / EVENT ID
  let eventId = url.searchParams.get('eventid');
  if(eventId === null){
    eventId = 123;
  }
  url.pathname = `api/event/${eventId}`
  //url.searchParams.append("eventId", eventId);

  //url.searchParams.append("deBug", true); // FOR SWITCH TO DEBUB MODE
  fetch(url)
  .then(response => {
    if (response.ok){
      return response.json()
    } else {
      return {error: "Unable to display event details page"}
    }
  })
  .then(data => {
    if (data.error){
      document.getElementById('event-name').textContent = data.error;
    } else {
    console.log(data);
    document.getElementById('event-name').textContent = data.eventName;
    document.getElementById('event-time-date').textContent = data.eventDate;
    document.getElementById('privacy-option').textContent = data.privacy;
    document.getElementById('invite-option').textContent = data.inviteOption;
    document.getElementById('limit-option').textContent = data.eventLimit;
    document.getElementById('reservation-option').textContent = data.reservation ? "Yes" : "No";
    document.getElementById('category-option').textContent = data.eventCategory;
    // document.getElementById('event-creators').textContent = data.eventCreator; // Uncomment if needed
    document.getElementById('event-address').textContent = data.eventAddress;
    document.getElementById('event-description').textContent = data.eventDescription;
    document.getElementById('Attendee_num').textContent = 0; // PLACEHOLDER VAL
    document.getElementById('Attendee_not_num').textContent = 0; // PLACEHOLDER VAL
    if(data.eventImage){
      document.getElementById('event-image').src = data.eventImage;
    }

      if(data.privacy === "Public"){ // DISABLING BUTTONS IF PRIVATE EVENT
        joinButton.disabled = false;
        dontJoinButton.disabled = false;
      } else {
        joinButton.disabled = true;
        dontJoinButton.disabled = true;
      }
    }
  })
  .catch(error =>  console.error('Request failed', error));

  let ratingTextElement = document.getElementById('rating-text');// CALCULATING REVIEW STARS
  ratingTextElement.textContent = `${meanrating} Stars`;
  const stars = document.querySelectorAll('.stars .star'); 
  stars.forEach((star, index) => {
      let rating = index + 1;
      if (rating <= Math.floor(meanrating)) {
          star.classList.add("star-filled");
          star.classList.remove("star-half", "star-quarter", "star-three-quarter");
      }
      else if (rating - 0.25 <= meanrating) {
          star.classList.add("star-three-quarter");
          star.classList.remove("star-filled", "star-quarter", "star-half");
      }
      else if (rating - 0.5 <= meanrating) {
          star.classList.add("star-half");
          star.classList.remove("star-filled", "star-quarter", "star-three-quarter");
      }
      else if (rating - 0.75 <= meanrating) {
          star.classList.add("star-quarter");
          star.classList.remove("star-filled", "star-half", "star-three-quarter");
      }
      else {
          star.classList.remove("star-filled", "star-half", "star-quarter");
      }
  });
});

// JOIN BUTTON
joinButton.addEventListener('click', async () => {
  document.getElementById("Attendee_num").textContent = 1; 
  joinButton.disabled = true;
  dontJoinButton.disabled = true;
});

// DONT JOIN BUTTON
dontJoinButton.addEventListener('click', async () => {
  document.getElementById("Attendee_not_num").textContent = 1; 
  joinButton.disabled = true;
  dontJoinButton.disabled = true;
});
