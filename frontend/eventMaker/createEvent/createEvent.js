const template = document.createElement("template");

const templates = [
    `<!-- Step 1: Event Type -->

    <link rel="stylesheet" href="../../eventMaker/createEvent/createEvent.css">

    <div class="step" data-step="1">
        <div class="form-group">
            <select id="eventType" required>
                <option value="" disabled selected hidden></option>
                <option value="Public">Public</option>
                <option value="Private">Private</option>
            </select>
            <label for="eventType">What is the type of the event?</label>
            <span class="error-message" id="eventTypeError"></span>
        </div>
        <div class="navigation-buttons">
            <button type="button" id="nextBtn" style="width:30vw">Next</button>
        </div>
    </div>
    `,
    `<!-- Step 2: Private Options (Conditional) -->
    <link rel="stylesheet" href="../../eventMaker/createEvent/createEvent.css">
    <div class="step conditional-group" data-step="2" id="privateOptionsGroup">
        <div class="form-group">
            <select id="privateOptions">
                <option value="" disabled selected hidden></option>
                <option value="Invite only">Invite only</option>
                <option value="Friends only">Friends only</option>
                <option value="Community only">Community only</option>
                <option value="Request only">Request only</option>
            </select>
            <label for="privateOptions">Private Options</label>
            <span class="error-message" id="privateOptionsError"></span>
        <div class="navigation-buttons">
            <button type="button" id="backBtn">Back</button>
            <button type="button" id="nextBtn">Next</button>
        </div>
    </div>
    `, 
    `
    <!-- Step 3: Occupancy Option -->
    <link rel="stylesheet" href="../../eventMaker/createEvent/createEvent.css">
    <div class="step" data-step="3">
        <div class="form-group">
            <select id="occupancyOption" required>
                <option value="" disabled selected hidden></option>
                <option value="Limited">Limited</option>
                <option value="Not limited">Not limited</option>
            </select>
            <label for="occupancyOption">Occupancy Option?</label>
            <span class="error-message" id="occupancyOptionError"></span>
            <div class="navigation-buttons">
            <button type="button" id="backBtn">Back</button>
            <button type="button" id="nextBtn">Next</button>
            </div>
        </div>
    </div>
    `,
    `
    <!-- Step 4: Seat Option (Conditional) -->
    <link rel="stylesheet" href="../../eventMaker/createEvent/createEvent.css">
    <div class="step conditional-group" data-step="4" id="seatOptionGroup">
        <div class="form-group">
            <select id="seatOption">
                <option value="" disabled selected hidden></option>
                <option value="First come, first serve">First come, first serve</option>
                <option value="Reservation">Reservation</option>
            </select>
            <label for="seatOption">How to get a seat?</label>
            <span class="error-message" id="seatOptionError"></span>
            <div class="navigation-buttons">
            <button type="button" id="backBtn">Back</button>
            <button type="button" id="nextBtn">Next</button>
            </div>
        </div>
    </div>
    `,
    `
    <!-- Step 5: Choose Category -->
    <link rel="stylesheet" href="../../eventMaker/createEvent/createEvent.css">
    <div class="step" data-step="5">
        <div class="form-group">
            <select id="eventCategory" required>
                <option value="" disabled selected hidden></option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="Other">Other</option>
            </select>
            <label for="eventCategory">Choose Category</label>
            <span class="error-message" id="eventCategoryError"></span>
            <div class="navigation-buttons">
            <button type="button" id="backBtn">Back</button>
            <button type="button" id="nextBtn">Next</button>
            </div>
        </div>
    </div>
    `,
    `
    <!-- Step 6: Customized Category (Conditional) -->
    <link rel="stylesheet" href="../../eventMaker/createEvent/createEvent.css">
    <div class="step conditional-group" data-step="6" id="customCategoryGroup">
        <div class="form-group">
            <input type="text" id="customCategory" placeholder=" " />
            <label for="customCategory">Customized Category</label>
            <span class="error-message" id="customCategoryError"></span>
            <div class="navigation-buttons">
            <button type="button" id="backBtn">Back</button>
            <button type="button" id="nextBtn">Next</button>
            </div> 
        </div>
    </div>
    `,
    `
    <!-- Step 7: Event Title -->
    <link rel="stylesheet" href="../../eventMaker/createEvent/createEvent.css">
    <div class="step" data-step="7">
        <div class="form-group">
            <input type="text" id="eventTitle" required placeholder=" " />
            <label for="eventTitle">Title for the event?</label>
            <span class="error-message" id="eventTitleError"></span>
            <div class="navigation-buttons">
            <button type="button" id="backBtn">Back</button>
            <button type="button" id="nextBtn">Next</button>
            </div>
        </div>
    </div>
    `,
    `
    <!-- Step 8: Event Date -->
    <link rel="stylesheet" href="../../eventMaker/createEvent/createEvent.css">
    <div class="step" data-step="8">
        <div class="form-group">
            <input type="date" id="eventDate" required placeholder=" " />
            <label for="eventDate">When is this event happening?</label>
            <span class="error-message" id="eventDateError"></span>
            <div class="navigation-buttons">
            <button type="button" id="backBtn">Back</button>
            <button type="button" id="nextBtn">Next</button>
            </div>
        </div>
    </div>
    `,
    `
    <!-- Step 9: Event Location -->
    <link rel="stylesheet" href="../../eventMaker/createEvent/createEvent.css">
    <div class="step" data-step="9">
        <div class="form-group">
            <input type="text" id="eventLocation" required placeholder=" " />
            <label for="eventLocation">Where is the event happening?</label>
            <span class="error-message" id="eventLocationError"></span>
            <div class="navigation-buttons">
            <button type="button" id="backBtn">Back</button>
            <button type="button" id="nextBtn">Next</button>
            </div>
        </div>
    </div>
    `,
    `
    <!-- Step 10: Event Description -->
    <link rel="stylesheet" href="../../eventMaker/createEvent/createEvent.css">
    <div class="step" data-step="10">
        <div class="form-group">
            <textarea id="eventDescription" rows="4" required placeholder=" "></textarea>
            <label for="eventDescription">Any description?</label>
            <span class="error-message" id="eventDescriptionError"></span>
            <div class="navigation-buttons">
            <button type="button" id="backBtn">Back</button>
            <button type="button" id="nextBtn">Next</button>
            </div>
        </div>
    </div>
    `,
    `
    <!-- Success Message -->
    <link rel="stylesheet" href="../../eventMaker/createEvent/createEvent.css">
    <div class="success-message" id="successMessage"></div>

    <div class="navigation-buttons">
        <button type="button" id="submitBtn">Submit</button>
        <button type="button" id="backBtn">Back</button>
    </div>
    `
]

template.innerHTML = templates[0];

class EventMaker extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });
        shadow.appendChild(template.content.cloneNode(true));

        // inner html tracker
        this.currentStep = 0; 

        // Navigation buttons
        this.nextBtn = shadow.getElementById("nextBtn");
        // this.submitBtn = shadow.getElementById("submitBtn");

        // Event listeners
        this.nextBtn.addEventListener("click", () => this.nextStep());

        // Event details 
        this.eventDetails = {
            "type" : "",
            "privacy": "",
            "occupancy": "",
            "seating": "",
            "category": "",
            "customCategory": "",
            "title": "",
            "date": "",
            "location": "",
            "description": "",
        }
    }

    nextStep() {        
        // Selecting Shadow element to change its inner html
        const currentComponent = document.querySelector(".eventComponent")
        const shadowRoot = currentComponent.shadowRoot;

        // Getting selection value
        switch (this.currentStep) {
            case 0: {
                const selectElement = shadowRoot.querySelector("select");
                this.eventDetails["type"] = selectElement ? selectElement.value : "";
                break;
            }
            case 1: {
                const selectElement = shadowRoot.querySelector("select");
                this.eventDetails["privacy"] = selectElement ? selectElement.value : "";
                break;
            }
            case 2: {
                const selectElement = shadowRoot.querySelector("select");
                this.eventDetails["occupancy"] = selectElement ? selectElement.value : "";
                break;
            }
            case 3: {
                const selectElement = shadowRoot.querySelector("select");
                this.eventDetails["seating"] = selectElement ? selectElement.value : "";
                break;
            }
            case 4: {
                const selectElement = shadowRoot.querySelector("select");
                this.eventDetails["category"] = selectElement ? selectElement.value : "";
                break;
            }
            case 5: {
                const inputElement = shadowRoot.querySelector("input");
                this.eventDetails["customCategory"] = inputElement ? inputElement.value : "";
                break;
            }
            case 6: {
                const inputElement = shadowRoot.querySelector("input");
                this.eventDetails["title"] = inputElement ? inputElement.value : "";
                break;
            }
            case 7: {
                const inputElement = shadowRoot.querySelector("input");
                this.eventDetails["date"] = inputElement ? inputElement.value : "";
                break;
            }
            case 8: {
                const inputElement = shadowRoot.querySelector("input");
                this.eventDetails["location"] = inputElement ? inputElement.value : "";
                break;
            }
            case 9: {
                const textAreaElement = shadowRoot.querySelector("textarea");
                this.eventDetails["description"] = textAreaElement ? textAreaElement.value : "";
                break;
            }
            default:
                console.error("Invalid step");
                break;
        }
        
        // Changing the inner html of shadow element to it's next one
        this.currentStep ++;
        shadowRoot.innerHTML = templates[this.currentStep];

        // Adding event listener to current next button in shadow element
        if (this.currentStep < 10) {
            this.nextBtn = shadowRoot.getElementById("nextBtn")
            this.nextBtn.addEventListener("click", () => this.nextStep())
        } else {
            const submitBtn = shadowRoot.getElementById("submitBtn");
            submitBtn.addEventListener("click", () => this.submit()) 
        }
        
        if (this.currentStep > 0){
            this.backBtn = shadowRoot.getElementById("backBtn")
            this.backBtn.addEventListener("click", () => this.previousStep());
        } 
    }

    previousStep() {
        // Selecting Shadow element to change its inner html
        const currentComponent = document.querySelector(".eventComponent")
        const shadowRoot = currentComponent.shadowRoot;

        // Changing the inner html of shadow element to it's previous one
        this.currentStep --;
        shadowRoot.innerHTML = templates[this.currentStep];

        // Adding event listener to current next button in shadow element
        this.nextBtn = shadowRoot.getElementById("nextBtn")
        this.nextBtn.addEventListener("click", () => this.nextStep())

        if (this.currentStep > 0) {
            this.backBtn = shadowRoot.getElementById("backBtn")
            this.backBtn.addEventListener("click", () => this.previousStep()) 
        }
    }

    submit(){
        const userId = localStorage.getItem("userId");

    if (userId) {
    console.log("Current loggedin user ID:", userId);
    } else {
    console.log("Noone is currently logged in.");
}
        console.log(this.eventDetails);

        fetch("http://localhost:3000/api/event/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body:JSON.stringify({
                eventName: this.eventDetails.title,
                eventDate: this.eventDetails.date,
                privacy: this.eventDetails.privacy,
                inviteOption: this.eventDetails.privacy === "Invite only" ? true : false,
                eventLimit: this.eventDetails.occupancy === "Limited" ? 50 : 0,
                eventCategory: this.eventDetails.category,
                reservation: this.eventDetails.seating === "Reservation" ? true : false,
                eventCreator: userId, //CHANGE TO CURRENT USER. HOW? IDK.
                eventAddress: this.eventDetails.location,
                eventDescription: this.eventDetails.description,
            })
        })
        .then(response =>response.json())
        .then(data => {
            console.log("Success:", data);
            alert("Event created successfully!");
        })
        .catch(error =>{
            console.error("Error creating event:", error);
            alert("Failed to create event.");
        });
    }
}

customElements.define("event-maker", EventMaker);
