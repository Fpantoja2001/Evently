// components/eventMaker/event-maker-component.js

class EventMakerComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        // Initialize template and styles
        this.template = null;
        this.styles = null;
    }

    async connectedCallback() {
        try {
            // Fetch and set CSS
            const cssResponse = await fetch('components/eventMaker/eventMaker.css');
            if (!cssResponse.ok) {
                throw new Error('Failed to load CSS');
            }
            const cssText = await cssResponse.text();
            const style = document.createElement('style');
            style.textContent = cssText;
            this.shadowRoot.appendChild(style);

            // Fetch and set HTML
            const htmlResponse = await fetch('components/eventMaker/eventMaker.html');
            if (!htmlResponse.ok) {
                throw new Error('Failed to load HTML template');
            }
            const htmlText = await htmlResponse.text();
            const container = document.createElement('div');
            container.innerHTML = htmlText;
            this.shadowRoot.appendChild(container);

            // Initialize elements after loading HTML
            this.initializeElements();
        } catch (error) {
            console.error('Error loading Event Maker component:', error);
            this.shadowRoot.innerHTML = `<p>Error loading Event Maker component.</p>`;
        }
    }

    initializeElements() {
        // Form and Steps
        this.form = this.shadowRoot.querySelector('#eventForm');
        this.steps = this.shadowRoot.querySelectorAll('.step');
        this.currentStep = 1;

        // Progress Indicators
        this.progressIndicators = this.shadowRoot.querySelectorAll('.step-indicator');

        // Step 1 Elements
        this.eventType = this.shadowRoot.querySelector('#eventType');
        this.eventTypeError = this.shadowRoot.querySelector('#eventTypeError');
        this.nextBtn1 = this.shadowRoot.querySelector('#nextBtn1');

        // Step 2 Elements
        this.privateOptionsGroup = this.shadowRoot.querySelector('#privateOptionsGroup');
        this.privateOptions = this.shadowRoot.querySelector('#privateOptions');
        this.privateOptionsError = this.shadowRoot.querySelector('#privateOptionsError');
        this.nextBtn2 = this.shadowRoot.querySelector('#nextBtn2');

        // Step 3 Elements
        this.occupancyGroup = this.shadowRoot.querySelector('#occupancyGroup');
        this.occupancyOption = this.shadowRoot.querySelector('#occupancyOption');
        this.occupancyOptionError = this.shadowRoot.querySelector('#occupancyOptionError');
        this.nextBtn3 = this.shadowRoot.querySelector('#nextBtn3');

        // Step 4 Elements
        this.seatOptionGroup = this.shadowRoot.querySelector('#seatOptionGroup');
        this.seatOption = this.shadowRoot.querySelector('#seatOption');
        this.seatOptionError = this.shadowRoot.querySelector('#seatOptionError');
        this.nextBtn4 = this.shadowRoot.querySelector('#nextBtn4');

        // Step 5 Elements
        this.eventCategory = this.shadowRoot.querySelector('#eventCategory');
        this.eventCategoryError = this.shadowRoot.querySelector('#eventCategoryError');
        this.nextBtn5 = this.shadowRoot.querySelector('#nextBtn5');

        // Step 6 Elements
        this.customCategoryGroup = this.shadowRoot.querySelector('#customCategoryGroup');
        this.customCategory = this.shadowRoot.querySelector('#customCategory');
        this.customCategoryError = this.shadowRoot.querySelector('#customCategoryError');
        this.nextBtn6 = this.shadowRoot.querySelector('#nextBtn6');

        // Step 7 Elements
        this.eventTitle = this.shadowRoot.querySelector('#eventTitle');
        this.eventTitleError = this.shadowRoot.querySelector('#eventTitleError');
        this.nextBtn7 = this.shadowRoot.querySelector('#nextBtn7');

        // Step 8 Elements
        this.eventDate = this.shadowRoot.querySelector('#eventDate');
        this.eventDateError = this.shadowRoot.querySelector('#eventDateError');
        this.nextBtn8 = this.shadowRoot.querySelector('#nextBtn8');

        // Step 9 Elements
        this.eventLocation = this.shadowRoot.querySelector('#eventLocation');
        this.eventLocationError = this.shadowRoot.querySelector('#eventLocationError');
        this.nextBtn9 = this.shadowRoot.querySelector('#nextBtn9');

        // Step 10 Elements
        this.eventDescription = this.shadowRoot.querySelector('#eventDescription');
        this.eventDescriptionError = this.shadowRoot.querySelector('#eventDescriptionError');
        this.submitBtn = this.shadowRoot.querySelector('#submitBtn');

        // Success Message
        this.successMessage = this.shadowRoot.querySelector('#successMessage');

        // Attach Event Listeners
        this.attachEventListeners();
    }

    attachEventListeners() {
        // Navigation Buttons
        this.nextBtn1.addEventListener('click', this.handleNext1.bind(this));
        this.nextBtn2.addEventListener('click', this.handleNext2.bind(this));
        this.nextBtn3.addEventListener('click', this.handleNext3.bind(this));
        this.nextBtn4.addEventListener('click', this.handleNext4.bind(this));
        this.nextBtn5.addEventListener('click', this.handleNext5.bind(this));
        this.nextBtn6.addEventListener('click', this.handleNext6.bind(this));
        this.nextBtn7.addEventListener('click', this.handleNext7.bind(this));
        this.nextBtn8.addEventListener('click', this.handleNext8.bind(this));
        this.nextBtn9.addEventListener('click', this.handleNext9.bind(this));

        // Back Buttons
        const backButtons = this.shadowRoot.querySelectorAll('.backBtn');
        backButtons.forEach(btn => {
            btn.addEventListener('click', this.handleBack.bind(this));
        });

        // Form Submission
        this.form.addEventListener('submit', this.handleSubmit.bind(this));

        // Dropdown Changes
        this.eventType.addEventListener('change', this.handleEventTypeChange.bind(this));
        this.occupancyOption.addEventListener('change', this.handleOccupancyChange.bind(this));
        this.eventCategory.addEventListener('change', this.handleCategoryChange.bind(this));

        // Real-time Validation
        this.addRealTimeValidation();
    }

    // Handler for Next Button on Step 1
    handleNext1() {
        if (this.validateStep1()) {
            if (this.eventType.value === 'Private') {
                this.showStep(2);
            } else {
                // Skip Step 2 if Public
                this.showStep(3);
            }
        }
    }

    // Handler for Next Button on Step 2
    handleNext2() {
        if (this.validateStep2()) {
            this.showStep(3);
        }
    }

    // Handler for Next Button on Step 3
    handleNext3() {
        if (this.validateStep3()) {
            if (this.occupancyOption.value === 'Limited') {
                this.showStep(4);
            } else {
                // Skip Step 4 if Not limited
                this.showStep(5);
            }
        }
    }

    // Handler for Next Button on Step 4
    handleNext4() {
        if (this.validateStep4()) {
            this.showStep(5);
        }
    }

    // Handler for Next Button on Step 5
    handleNext5() {
        if (this.validateStep5()) {
            if (this.eventCategory.value === 'Other') {
                this.showStep(6);
            } else {
                // Skip Step 6 if not Other
                this.showStep(7);
            }
        }
    }

    // Handler for Next Button on Step 6
    handleNext6() {
        if (this.validateStep6()) {
            this.showStep(7);
        }
    }

    // Handler for Next Button on Step 7
    handleNext7() {
        if (this.validateStep7()) {
            this.showStep(8);
        }
    }

    // Handler for Next Button on Step 8
    handleNext8() {
        if (this.validateStep8()) {
            this.showStep(9);
        }
    }

    // Handler for Next Button on Step 9
    handleNext9() {
        if (this.validateStep9()) {
            this.showStep(10);
        }
    }

    // Handler for Back Buttons
    handleBack(event) {
        const backStep = parseInt(event.target.getAttribute('data-back'));
        this.showStep(backStep);
    }

    // Show a specific step
    showStep(stepNumber) {
        this.steps.forEach(step => {
            if (parseInt(step.getAttribute('data-step')) === stepNumber) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        // Update Progress Indicators
        this.progressIndicators.forEach(indicator => {
            if (parseInt(indicator.getAttribute('data-step')) === stepNumber) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });

        this.currentStep = stepNumber;
    }

    // Validation Functions for Each Step
    validateStep1() {
        let isValid = true;
        // Reset previous errors
        this.eventTypeError.innerText = '';
        this.eventType.classList.remove('incorrectInput');

        // Validate Event Type
        if (this.eventType.value === '') {
            this.eventTypeError.innerText = 'Please select the type of the event.';
            this.eventType.classList.add('incorrectInput');
            isValid = false;
        }

        return isValid;
    }

    validateStep2() {
        let isValid = true;
        // Reset previous errors
        this.privateOptionsError.innerText = '';
        this.privateOptions.classList.remove('incorrectInput');

        // Validate Private Options
        if (this.privateOptions.value === '') {
            this.privateOptionsError.innerText = 'Please select a private option.';
            this.privateOptions.classList.add('incorrectInput');
            isValid = false;
        }

        return isValid;
    }

    validateStep3() {
        let isValid = true;
        // Reset previous errors
        this.occupancyOptionError.innerText = '';
        this.occupancyOption.classList.remove('incorrectInput');

        // Validate Occupancy Option
        if (this.occupancyOption.value === '') {
            this.occupancyOptionError.innerText = 'Please select an occupancy option.';
            this.occupancyOption.classList.add('incorrectInput');
            isValid = false;
        }

        return isValid;
    }

    validateStep4() {
        let isValid = true;
        // Reset previous errors
        this.seatOptionError.innerText = '';
        this.seatOption.classList.remove('incorrectInput');

        // Validate Seat Option
        if (this.seatOption.value === '') {
            this.seatOptionError.innerText = 'Please select how to get a seat.';
            this.seatOption.classList.add('incorrectInput');
            isValid = false;
        }

        return isValid;
    }

    validateStep5() {
        let isValid = true;
        // Reset previous errors
        this.eventCategoryError.innerText = '';
        this.eventCategory.classList.remove('incorrectInput');

        // Validate Event Category
        if (this.eventCategory.value === '') {
            this.eventCategoryError.innerText = 'Please choose a category.';
            this.eventCategory.classList.add('incorrectInput');
            isValid = false;
        }

        return isValid;
    }

    validateStep6() {
        let isValid = true;
        // Reset previous errors
        this.customCategoryError.innerText = '';
        this.customCategory.classList.remove('incorrectInput');

        // Validate Custom Category
        if (this.customCategory.value.trim() === '') {
            this.customCategoryError.innerText = 'Please enter a customized category.';
            this.customCategory.classList.add('incorrectInput');
            isValid = false;
        }

        return isValid;
    }

    validateStep7() {
        let isValid = true;
        // Reset previous errors
        this.eventTitleError.innerText = '';
        this.eventTitle.classList.remove('incorrectInput');

        // Validate Event Title
        if (this.eventTitle.value.trim() === '') {
            this.eventTitleError.innerText = 'Please enter a title for the event.';
            this.eventTitle.classList.add('incorrectInput');
            isValid = false;
        }

        return isValid;
    }

    validateStep8() {
        let isValid = true;
        // Reset previous errors
        this.eventDateError.innerText = '';
        this.eventDate.classList.remove('incorrectInput');

        // Validate Event Date
        if (this.eventDate.value === '') {
            this.eventDateError.innerText = 'Please select the date of the event.';
            this.eventDate.classList.add('incorrectInput');
            isValid = false;
        } else if (new Date(this.eventDate.value) < new Date()) {
            this.eventDateError.innerText = 'Event date cannot be in the past.';
            this.eventDate.classList.add('incorrectInput');
            isValid = false;
        }

        return isValid;
    }

    validateStep9() {
        let isValid = true;
        // Reset previous errors
        this.eventLocationError.innerText = '';
        this.eventLocation.classList.remove('incorrectInput');

        // Validate Event Location
        if (this.eventLocation.value.trim() === '') {
            this.eventLocationError.innerText = 'Please enter the location of the event.';
            this.eventLocation.classList.add('incorrectInput');
            isValid = false;
        }

        return isValid;
    }

    validateStep10() {
        let isValid = true;
        // Reset previous errors
        this.eventDescriptionError.innerText = '';
        this.eventDescription.classList.remove('incorrectInput');

        // Validate Event Description
        if (this.eventDescription.value.trim() === '') {
            this.eventDescriptionError.innerText = 'Please provide a description for the event.';
            this.eventDescription.classList.add('incorrectInput');
            isValid = false;
        }

        return isValid;
    }

    // Form Submission Handler
    handleSubmit(event) {
        event.preventDefault();
        if (this.validateStep10()) {
            // Prepare event data
            const eventData = {
                type: this.eventType.value,
                privateOptions: this.eventType.value === 'Private' ? this.privateOptions.value : null,
                occupancyOption: this.occupancyOption.value,
                seatOption: this.occupancyOption.value === 'Limited' ? this.seatOption.value : null,
                category: this.eventCategory.value === 'Other' ? this.customCategory.value.trim() : this.eventCategory.value,
                title: this.eventTitle.value.trim(),
                date: this.eventDate.value,
                location: this.eventLocation.value.trim(),
                description: this.eventDescription.value.trim()
            };

            // Dispatch custom event with event data
            this.dispatchEvent(new CustomEvent('event-created', {
                detail: { event: eventData },
                bubbles: true,
                composed: true
            }));

            // Show success message
            this.successMessage.innerText = 'Event created successfully!';

            // Reset the form and go back to Step 1
            this.form.reset();
            // Hide all conditional steps
            this.privateOptionsGroup.classList.remove('active');
            this.seatOptionGroup.classList.remove('active');
            this.customCategoryGroup.classList.remove('active');
            this.showStep(1);
        }
    }

    // Handler for Event Type Change
    handleEventTypeChange() {
        if (this.eventType.value === 'Private') {
            // Show Step 2
            // Note: In handleNext1, it decides to show Step 2 or skip
            // So no action needed here
        } else {
            // If Public, ensure Step 2 is skipped
            // Already handled in handleNext1
        }
    }

    // Handler for Occupancy Option Change
    handleOccupancyChange() {
        if (this.occupancyOption.value === 'Limited') {
            // Show Step 4
            // Controlled in handleNext3
        } else {
            // If Not limited, ensure Step 4 is skipped
            // Already handled in handleNext3
        }
    }

    // Handler for Category Change
    handleCategoryChange() {
        if (this.eventCategory.value === 'Other') {
            // Show Step 6
            // Controlled in handleNext5
        } else {
            // If not Other, ensure Step 6 is skipped
            // Already handled in handleNext5
        }
    }

    // Real-Time Validation Setup
    addRealTimeValidation() {
        // Step 1
        this.eventType.addEventListener('input', () => {
            if (this.eventType.value !== '') {
                this.eventTypeError.innerText = '';
                this.eventType.classList.remove('incorrectInput');
            }
        });

        // Step 2
        this.privateOptions.addEventListener('input', () => {
            if (this.privateOptions.value !== '') {
                this.privateOptionsError.innerText = '';
                this.privateOptions.classList.remove('incorrectInput');
            }
        });

        // Step 3
        this.occupancyOption.addEventListener('input', () => {
            if (this.occupancyOption.value !== '') {
                this.occupancyOptionError.innerText = '';
                this.occupancyOption.classList.remove('incorrectInput');
            }
        });

        // Step 4
        this.seatOption.addEventListener('input', () => {
            if (this.seatOption.value !== '') {
                this.seatOptionError.innerText = '';
                this.seatOption.classList.remove('incorrectInput');
            }
        });

        // Step 5
        this.eventCategory.addEventListener('input', () => {
            if (this.eventCategory.value !== '') {
                this.eventCategoryError.innerText = '';
                this.eventCategory.classList.remove('incorrectInput');
            }
        });

        // Step 6
        this.customCategory.addEventListener('input', () => {
            if (this.customCategory.value.trim() !== '') {
                this.customCategoryError.innerText = '';
                this.customCategory.classList.remove('incorrectInput');
            }
        });

        // Step 7
        this.eventTitle.addEventListener('input', () => {
            if (this.eventTitle.value.trim() !== '') {
                this.eventTitleError.innerText = '';
                this.eventTitle.classList.remove('incorrectInput');
            }
        });

        // Step 8
        this.eventDate.addEventListener('input', () => {
            if (this.eventDate.value !== '' && new Date(this.eventDate.value) >= new Date()) {
                this.eventDateError.innerText = '';
                this.eventDate.classList.remove('incorrectInput');
            }
        });

        // Step 9
        this.eventLocation.addEventListener('input', () => {
            if (this.eventLocation.value.trim() !== '') {
                this.eventLocationError.innerText = '';
                this.eventLocation.classList.remove('incorrectInput');
            }
        });

        // Step 10
        this.eventDescription.addEventListener('input', () => {
            if (this.eventDescription.value.trim() !== '') {
                this.eventDescriptionError.innerText = '';
                this.eventDescription.classList.remove('incorrectInput');
            }
        });
    }
}

customElements.define('event-maker-component', EventMakerComponent);
