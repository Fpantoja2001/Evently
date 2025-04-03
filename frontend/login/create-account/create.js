const template = document.createElement("template")

const componentTemplates = [
    `
        <link rel="stylesheet" href="../login/create-account/create.css">
        <div class="logo">logo</div>
        <slot class="component-title">Enter account details</slot>

        <div class="component-container">
        <input type="text" class="component-input-one" id="userNameInput" placeholder=" ">
        <label for="userNameInput" class="component-placeholder-one">Username</label>
        <span class="component-form-error-one"></span>

        <input type="email" class="component-input-two" id="emailInput" placeholder=" ">
        <label for="emailInput" class="component-placeholder-two">Email Address</label>
        <span class="component-form-error-two"></span>

        <div class="component-input-three-wrapper">
            <input type="password" class="component-input-three" id="passwordInput" placeholder=" ">
            <label for="passwordInput" class="component-placeholder-three">Password</label>
            <div class="showPasswordBtn" active="false">
                <img src="./icons/show-password.svg" alt="show-password" class ="show-password-img"></img>
                <div class="show-password-hover-text" hidden="true">Show password</div>
             </div>
        </div>
        <span class="component-form-error-three"></span>

        <div class="component-input-four-wrapper">
            <input type="password" class="component-input-four" id="confirmPasswordInput" placeholder=" ">
            <label for="passwordInput" class="component-placeholder-four">Confirm Password</label>
            <div class="showConfPasswordBtn" active="false">
                <img src="./icons/show-password.svg" alt="show-password" class ="show-conf-password-img"></img>
                <div class="show-conf-password-hover-text" hidden="true">Show password</div>
            </div>
        </div>
        <span class="component-form-error-four"></span>

        <button class="continueBtn">Sign Up</button>
        </div>
`,
`
        <link rel="stylesheet" href="../login/create-account/create.css">
        <div class="logo">logo</div>
        <slot class="component-title">Enter your personal info</slot>

        <div class="component-container">
            <input type="text" class="component-input-one" id="firstNameInput" placeholder=" ">
            <label for="firstName" class="component-placeholder-one">First Name</label>
            <span class="component-form-error-one"></span>

            <input type="text" class="component-input-two" id="lastNameInput" placeholder=" ">
            <label for="lastName" class="component-placeholder-two">Last Name</label>
            <span class="component-form-error-two"></span>

            <input type="text" class="component-input-three" id="birthdayInput" placeholder=" ">
            <label for="lastName" class="component-placeholder-three">Birthday (MMDDYYYY)</label>
            <span class="component-form-error-three"></span>

            <button class="continueBtn">Continue</button>
            <span class="signInT ext">Already have an account?<span class="signInRoute"> Sign in </span></span>
        <div>
    `
];

template.innerHTML = componentTemplates[0];

export class createAccount extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
        this.shadow.append(template.content.cloneNode(true));
        this.continueBtn = this.shadow.querySelector(".continueBtn");
        this.page = document.querySelector(".login-container");

        //
        this.showPasswordBtn = this.shadow.querySelector(".showPasswordBtn")
        this.showPasswordHoverText = this.shadow.querySelector(".show-password-hover-text")
        this.showPasswordImg = this.shadow.querySelector(".show-password-img")
        //
        this.showConfPasswordBtn = this.shadow.querySelector(".showConfPasswordBtn")
        this.showConfPasswordHoverText = this.shadow.querySelector(".show-conf-password-hover-text")
        this.showConfPasswordImg = this.shadow.querySelector(".show-conf-password-img")

        this.passwordInput = this.shadow.querySelector("#passwordInput");
        this.confirmPasswordInput = this.shadow.querySelector("#confirmPasswordInput");
        
        console.log("Shadow DOM initialized.");
        this.currentStep = 0;
    }

    async connectedCallback() {
        console.log("create account component connected");

        if (!this.continueBtn) {
            console.error("Button not found in the shadow DOM.");
        }

        this.continueBtn.addEventListener("click", async (e) => {
            e.preventDefault();
            await this.handleCreateAccount();
        });

        console.log("Event listener connected.");

        // Password View Functionality
        this.showPasswordBtn.addEventListener("click", () => {
            const currentActive = this.showPasswordBtn.getAttribute("active")

            if(currentActive === "true"){
                this.showPasswordBtn.setAttribute("active", "false")
                this.showPasswordImg.setAttribute("src","./icons/show-password.svg")
                this.showPasswordHoverText.innerText = "Show password"
                this.passwordInput.setAttribute("type", "password")
            } else {
                this.showPasswordBtn.setAttribute("active", "true")
                this.showPasswordImg.setAttribute("src","./icons/hide-password.svg")
                this.showPasswordHoverText.innerText = "Hide password"
                this.passwordInput.setAttribute("type", "text")
            }
        })

        this.showPasswordBtn.addEventListener("mouseover", () => {
            this.showPasswordHoverText.removeAttribute("hidden")
            
        })

        this.showPasswordBtn.addEventListener("mouseleave", () => {
            this.showPasswordHoverText.setAttribute("hidden", true);
        });

        // Confirm Password View Functionality
        this.showConfPasswordBtn.addEventListener("click", () => {
            const currentActive = this.showConfPasswordBtn.getAttribute("active")

            if(currentActive === "true"){
                this.showConfPasswordBtn.setAttribute("active", "false")
                this.showConfPasswordImg.setAttribute("src","./icons/show-password.svg")
                this.showConfPasswordHoverText.innerText = "Show password"
                this.confirmPasswordInput.setAttribute("type", "password")
            } else {
                this.showConfPasswordBtn.setAttribute("active", "true")
                this.showConfPasswordImg.setAttribute("src","./icons/hide-password.svg")
                this.showConfPasswordHoverText.innerText = "Hide password"
                this.confirmPasswordInput.setAttribute("type", "text")
            }
        })

        this.showConfPasswordBtn.addEventListener("mouseover", () => {
            this.showConfPasswordHoverText.removeAttribute("hidden")
            
        })

        this.showConfPasswordBtn.addEventListener("mouseleave", () => {
            this.showConfPasswordHoverText.setAttribute("hidden", true);
        });
    }

    async handleCreateAccount() {
        if(this.currentStep === 0) {
            let isValid = true;

            const userNameInput = this.shadow.querySelector("#userNameInput");
            const emailInput = this.shadow.querySelector("#emailInput");
            const passwordInput = this.shadow.querySelector("#passwordInput");
            const confirmPasswordInput = this.shadow.querySelector("#confirmPasswordInput");

            const formErrorOne = this.shadow.querySelector(".component-form-error-one");
            const formErrorTwo = this.shadow.querySelector(".component-form-error-two");
            const formErrorThree = this.shadow.querySelector(".component-form-error-three");
            const formErrorFour = this.shadow.querySelector(".component-form-error-four");

            //user
            if (userNameInput?.value.trim() === "") {
                formErrorOne.innerText = "Please enter a valid username.";
                userNameInput.classList.add("incorrectInput");
                isValid = false;
            } else {
                formErrorOne.innerText = "";
                userNameInput.classList.remove("incorrectInput");
            }
            //email
            if (!emailInput?.value.includes("@umass.edu")) {
                formErrorTwo.innerText = "Please enter a valid umass.edu email.";
                emailInput.classList.add("incorrectInput");
                isValid = false;
            } else {
                formErrorTwo.innerText = "";
                emailInput.classList.remove("incorrectInput");
            }
            //password
            if (passwordInput?.value.length < 6) {
                formErrorThree.innerText = "Password must be at least 6 characters.";
                passwordInput.classList.add("incorrectInput");
                isValid = false;
            } else {
                formErrorThree.innerText = "";
                passwordInput.classList.remove("incorrectInput");
            }
            //confirm password 
            if(confirmPasswordInput.value != passwordInput.value){
                formErrorFour.innerText = "Passwords must be the same";
                confirmPasswordInput.classList.add("incorrectInput");
                isValid = false;
            } else {
                formErrorFour.innerText = "";
                confirmPasswordInput.classList.remove("incorrectInput");
            }

            // console.log({
            //     name: userNameInput.value.trim(),
            //     email: emailInput.value.trim(),
            //     password: passwordInput.value.trim()
            // })

            if (isValid) {
                console.log("Form passed validation. Attempting user creation...");
                const userData = {
                    username: userNameInput.value.trim(),
                    email: (emailInput.value.trim()).toLowerCase(),
                    password: passwordInput.value.trim(),
                };

                try {
                    console.log(JSON.stringify(userData))

                    const response = await fetch('http://localhost:3000/api/user/create', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(userData)
                    });


                    if (!response.ok) {
                        throw new Error('Error');
                    } else {
                        console.log("response ok")
                    }

                    const result = await response.json();
                    localStorage.setItem("auth", JSON.stringify({userId: result.id}))

                    if (result) {
                        this.currentStep ++;
                        this.shadow.innerHTML = componentTemplates[this.currentStep];
                        const continueBtn = this.shadow.querySelector('.continueBtn')
                        continueBtn.addEventListener("click", () => this.handleCreateAccount())
                    } else {
                        console.error('Failed to create account: ' + (result.message || 'Unknown error'));
                    }
                } catch (error) {
                    console.error('Error during account creation:', error);  
                }
            } else {
                console.log("Form validation failed.");
            }  
        } else if (this.currentStep === 1){
            // Turning Fields into Variables

            const firstNameInput = this.shadow.getElementById("firstNameInput")
            const lastNameInput = this.shadow.getElementById("lastNameInput")
            const BirthdayInput = this.shadow.getElementById("birthdayInput")

            const formErrorOne = this.shadow.querySelector(".component-form-error-one");
            const formErrorTwo = this.shadow.querySelector(".component-form-error-two");
            const formErrorThree = this.shadow.querySelector(".component-form-error-three");
            let userAge = 0;
            let isValid = true; 

            if (firstNameInput.value.trim() === "" || /\d/.test(firstNameInput.value.trim())) {
                formErrorOne.innerText = "Please enter a valid Name.";
                firstNameInput.classList.add("incorrectInput");
                isValid = false;
            } else {
                formErrorOne.innerText = "";
                firstNameInput.classList.remove("incorrectInput");
                isValid = true;
            }

            if (lastNameInput.value.trim() === "" || /\d/.test(lastNameInput.value.trim())) {
                formErrorTwo.innerText = "Please enter a valid Last Name.";
                lastNameInput.classList.add("incorrectInput");
                isValid = false;
            } else {
                formErrorTwo.innerText = "";
                lastNameInput.classList.remove("incorrectInput");
                isValid = true;
            }

            if (BirthdayInput.value.trim() === "" || /[A-Za-z]/.test(BirthdayInput.value.trim()) || BirthdayInput.value.trim().length < 8 || BirthdayInput.value.trim().length > 8) {
                formErrorThree.innerText = "Please enter a valid Birthdate.";
                BirthdayInput.classList.add("incorrectInput");
                isValid = false;
            } else {
                formErrorThree.innerText = "";
                BirthdayInput.classList.remove("incorrectInput");
                isValid = true

                // Valid Birthday Check
                const month = BirthdayInput.value.trim().slice(0,2)
                const day = BirthdayInput.value.trim().slice(2,4)
                const year =  BirthdayInput.value.trim().slice(4,8)
                
                const today = new Date()

                userAge = today.getFullYear() - year;

                const monthDifference =  today.getMonth() - month;
                const dayDifference = today.getDay() - day; 

                if (monthDifference < 0 || monthDifference === 0 && dayDifference < 0) {
                    userAge--; 
                }

                if (userAge <= 0) { // age limit 13 idk? 
                    formErrorThree.innerText = "Please enter a valid Birthdate.";
                    BirthdayInput.classList.add("incorrectInput");
                    isValid = false;
                }
            }
            
            if (isValid) {
                console.log("Form validation passed, updating account details")

                const userData = {
                    name: firstNameInput.value.trim() + " " + lastNameInput.value.trim(),
                    age: userAge,  
                }

                const userId = JSON.parse(localStorage.getItem("auth")).userId

                const response = await fetch(`/api/user/${userId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userData),
                });

                if (response.ok) {
                    const result = await response.json(); 
                    console.log("User's name and age added successfully", result)
                    this.navigateToNextStep()
                } else {
                    // error handling TBA
                }   
            }
            
        }
        
    }

    navigateToNextStep() {
        console.log("Navigating to the next step...");

        const component = document.querySelector('create-account-component')

        // initializing new component to pass in
        const newC = document.createElement("email-input-component");
        newC.classList.add("login-component");

        // removing current component
        component.remove();

        // adding new component
        this.page.appendChild(newC); 
    }

    disconnectedCallback() {
        console.log("Cleaned up from DOM.");
    }
}

customElements.define("create-account-component", createAccount);