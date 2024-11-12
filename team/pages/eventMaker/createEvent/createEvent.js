const template = document.createElement("template");

// template.innerHTML



templates = [
    `
    <div class="event-container">
        <h2>Create an Event</h2>
        <form id="eventForm">
        <!-- Step 1: Event Type -->
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
    </div>
    `,
    `<!-- Step 2: Private Options (Conditional) -->
    <div class="step hidden conditional-group" data-step="2" id="privateOptionsGroup">
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
        </div>
    </div>
    `,`
    <!-- Step 3: Occupancy Option -->
    <div class="step hidden" data-step="3">
        <div class="form-group">
            <select id="occupancyOption" required>
                <option value="" disabled selected hidden></option>
                <option value="Limited">Limited</option>
                <option value="Not limited">Not limited</option>
            </select>
            <label for="occupancyOption">Occupancy Option?</label>
            <span class="error-message" id="occupancyOptionError"></span>
        </div>
    </div>
    `,`
    <!-- Step 4: Seat Option (Conditional) -->
    <div class="step hidden conditional-group" data-step="4" id="seatOptionGroup">
        <div class="form-group">
            <select id="seatOption">
                <option value="" disabled selected hidden></option>
                <option value="First come, first serve">First come, first serve</option>
                <option value="Reservation">Reservation</option>
            </select>
            <label for="seatOption">How to get a seat?</label>
            <span class="error-message" id="seatOptionError"></span>
        </div>
    </div>
    `,`
    <!-- Step 5: Choose Category -->
    <div class="step hidden" data-step="5">
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
        </div>
    </div>
    `,`
    <!-- Step 6: Customized Category (Conditional) -->
    <div class="step hidden conditional-group" data-step="6" id="customCategoryGroup">
        <div class="form-group">
            <input type="text" id="customCategory" placeholder=" " />
            <label for="customCategory">Customized Category</label>
            <span class="error-message" id="customCategoryError"></span>
        </div>
    </div>
    `,`
    <!-- Step 7: Event Title -->
    <div class="step hidden" data-step="7">
        <div class="form-group">
            <input type="text" id="eventTitle" required placeholder=" " />
            <label for="eventTitle">Title for the event?</label>
            <span class="error-message" id="eventTitleError"></span>
        </div>
    </div>
    `,`
    <!-- Step 8: Event Date -->
    <div class="step hidden" data-step="8">
        <div class="form-group">
            <input type="date" id="eventDate" required placeholder=" " />
            <label for="eventDate">When is this event happening?</label>
            <span class="error-message" id="eventDateError"></span>
        </div>
    </div>
    `,`
    <!-- Step 9: Event Location -->
    <div class="step hidden" data-step="9">
        <div class="form-group">
            <input type="text" id="eventLocation" required placeholder=" " />
            <label for="eventLocation">Where is the event happening?</label>
            <span class="error-message" id="eventLocationError"></span>
        </div>
    </div>
    `,`
    <!-- Step 10: Event Description -->
    <div class="step hidden" data-step="10">
        <div class="form-group">
            <textarea id="eventDescription" rows="4" required placeholder=" "></textarea>
            <label for="eventDescription">Any description?</label>
            <span class="error-message" id="eventDescriptionError"></span>
        </div>
    </div>
    `,`
    <!-- Success Message -->
    <div class="success-message" id="successMessage"></div>

    <div class="navigation-buttons">
        <button type="button" id="backBtn">Back</button>
        <button type="button" id="nextBtn">Next</button>
        <button type="submit" id="submitBtn">Submit</button>
    </div>
    `
]

class EventMaker extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });
        shadow.appendChild(template.content.cloneNode(true));

        this.form = shadow.getElementById("eventForm");
        this.steps = shadow.querySelectorAll(".step");
        this.currentStep = 1;

        // Navigation buttons
        this.nextBtn = shadow.getElementById("nextBtn");
        this.backBtn = shadow.getElementById("backBtn");
        this.submitBtn = shadow.getElementById("submitBtn");

        // Conditional groups
        this.privateOptionsGroup = shadow.getElementById("privateOptionsGroup");
        this.seatOptionGroup = shadow.getElementById("seatOptionGroup");
        this.customCategoryGroup = shadow.getElementById("customCategoryGroup");

        // Dropdowns for conditional logic
        this.eventType = shadow.getElementById("eventType");
        this.occupancyOption = shadow.getElementById("occupancyOption");
        this.eventCategory = shadow.getElementById("eventCategory");

        // Event listeners
        this.nextBtn.addEventListener("click", () => this.nextStep());
        this.backBtn.addEventListener("click", () => this.previousStep());
        this.form.addEventListener("submit", (event) => this.handleSubmit(event));

        this.eventType.addEventListener("change", () => this.togglePrivateOptions());
        this.occupancyOption.addEventListener("change", () => this.toggleSeatOptions());
        this.eventCategory.addEventListener("change", () => this.toggleCustomCategory());

        this.updateNavigation();
    }

    nextStep() {
        if (this.currentStep < this.steps.length) {
            this.steps[this.currentStep - 1].classList.add("hidden");
            this.steps[this.currentStep].classList.remove("hidden");
            this.currentStep++;
        }
        this.updateNavigation();
    }

    previousStep() {
        if (this.currentStep > 1) {
            this.steps[this.currentStep - 1].classList.add("hidden");
            this.steps[this.currentStep - 2].classList.remove("hidden");
            this.currentStep--;
        }
        this.updateNavigation();
    }

    updateNavigation() {
        this.backBtn.style.display = this.currentStep > 1 ? "inline-block" : "none";
        this.nextBtn.style.display = this.currentStep < this.steps.length - 1 ? "inline-block" : "none";
        this.submitBtn.style.display = this.currentStep === this.steps.length ? "inline-block" : "none";
    }

    togglePrivateOptions() {
        this.privateOptionsGroup.classList.toggle("hidden", this.eventType.value !== "Private");
    }

    toggleSeatOptions() {
        this.seatOptionGroup.classList.toggle("hidden", this.occupancyOption.value !== "Limited");
    }

    toggleCustomCategory() {
        this.customCategoryGroup.classList.toggle("hidden", this.eventCategory.value !== "Other");
    }

    handleSubmit(event) {
        event.preventDefault();
        const successMessage = this.shadowRoot.getElementById("successMessage");

        if (this.form.checkValidity()) {
            successMessage.textContent = "Event created successfully!";
            successMessage.style.display = "block";
            setTimeout(() => successMessage.style.display = "none", 3000);
            this.form.reset();
            this.currentStep = 1;
            this.steps.forEach(step => step.classList.add("hidden"));
            this.steps[0].classList.remove("hidden");
            this.updateNavigation();
        } else {
            successMessage.textContent = "";
            this.form.reportValidity();
        }
    }
}

customElements.define("event-maker", EventMaker);
