document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("eventForm");
    const steps = document.querySelectorAll(".step");
    const progressIndicators = document.querySelectorAll(".step-indicator");
    let currentStep = 0;

    const eventType = document.getElementById("eventType");
    const privateOptionsGroup = document.getElementById("privateOptionsGroup");
    const occupancyOption = document.getElementById("occupancyOption");
    const seatOptionGroup = document.getElementById("seatOptionGroup");
    const eventCategory = document.getElementById("eventCategory");
    const customCategoryGroup = document.getElementById("customCategoryGroup");

    // Navigation Buttons
    document.getElementById("nextBtn").addEventListener("click", () => moveStep(1));
    document.getElementById("backBtn").addEventListener("click", () => moveStep(-1));

    // Show or hide elements based on selections
    eventType.addEventListener("change", () => {
        privateOptionsGroup.style.display = eventType.value === "Private" ? "block" : "none";
    });

    occupancyOption.addEventListener("change", () => {
        seatOptionGroup.style.display = occupancyOption.value === "Limited" ? "block" : "none";
    });

    eventCategory.addEventListener("change", () => {
        customCategoryGroup.style.display = eventCategory.value === "Other" ? "block" : "none";
    });

    function moveStep(direction) {
        if (direction === 1 && !validateStep(currentStep)) return; // Prevent next step if validation fails
        steps[currentStep].classList.add("hidden");
        progressIndicators[currentStep].classList.remove("active");

        currentStep += direction;

        steps[currentStep].classList.remove("hidden");
        progressIndicators[currentStep].classList.add("active");
    }

    function validateStep(step) {
        let valid = true;
        const fields = steps[step].querySelectorAll("select[required], input[required], textarea[required]");
        fields.forEach(field => {
            if (!field.value) {
                valid = false;
                document.getElementById(`${field.id}Error`).textContent = "This field is required.";
            } else {
                document.getElementById(`${field.id}Error`).textContent = "";
            }
        });
        return valid;
    }

    // Form submission
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!validateStep(currentStep)) return;
        
        document.getElementById("successMessage").textContent = "Event created successfully!";
        form.reset();
        currentStep = 0;
        moveStep(0); // Reset to the first step
    });
});
