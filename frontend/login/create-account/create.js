const template = document.createElement("template")

const componentTemplates = [
    `
        <link rel="stylesheet" href="../login/create-account/create.css">
        <div class="logo">logo</div>
        <slot class="component-title">Enter account details</slot>

        <div class="component-container">
        <input type="text" class="component-input-one" id="userNameInput" placeholder=" ">
        <label for="userNameInput" class="component-placeholder-one">Username</label>

        <input type="email" class="component-input-two" id="emailInput" placeholder=" ">
        <label for="emailInput" class="component-placeholder-two">Email Address</label>

        <div class="component-input-three-wrapper">
            <input type="password" class="component-input-three" pass="1" id="passwordInput" placeholder=" ">
            <label for="passwordInput" class="component-placeholder-three">Password</label>
            <div class="showPasswordBtn" active="false">
                <img src="./icons/show-password.svg" alt="show-password" pass="2" class ="show-password-img"></img>
                <div class="show-password-hover-text" pass="3" hidden="true">Show password</div>
             </div>
        </div>

        <div class="component-input-four-wrapper">
            <input type="password" class="component-input-four" id="confirmPasswordInput" conf="1" placeholder=" ">
            <label for="passwordInput" class="component-placeholder-four">Confirm Password</label>
            <div class="showConfPasswordBtn" active="false">
                <img src="./icons/show-password.svg" conf="2" alt="show-password" class ="show-conf-password-img"></img>
                <div class="show-conf-password-hover-text" conf="3" hidden="true">Show password</div>
            </div>
        </div>

        <div class="fieldReqBox">
            <div>&bull; Email must end with @umass.edu.<span id="emailReqLine"></span></div>
            <div>&bull; Password must be at least 8 characters long.<span id="charReqLine"></span></div>
            <div>&bull; Password must include at least;<span id="passReqLine"></span></div>
            <div>&emsp;- one special character,<span id="specialReqLine"></span></div>
            <div>&emsp;- one number,<span id="numReqLine"></span></div>
            <div>&emsp;- one uppercase letter.<span id="upperReqLine"></span></div>
            <div>&bull; Passwords must be equivalent.<span id="passEqualReqLine"></span></div>
        </div>

        <div class="component-form-error" hidden="true"></div>

        <button class="continueBtn">Sign Up</button>
        <span class="loginText">Already have an account?<span class="loginRoute"> Login </span></span>
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

/*
<div>&emsp;- one special character,<span id="specialReqLine">e</span></div>
<div>&emsp;- one number,<span id="numReqLine">e</span></div>
<div>&emsp;- one uppercase letter.<span id="upperReqLine">e</span></div>
*/ 

template.innerHTML = componentTemplates[0];

export class createAccount extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
        this.shadow.append(template.content.cloneNode(true));
        this.continueBtn = this.shadow.querySelector(".continueBtn");
        this.page = document.querySelector(".login-container");
        // Show Pass Vars
        this.showPasswordBtn = this.shadow.querySelector(".showPasswordBtn")
        //Conf Pass Vars
        this.showConfPasswordBtn = this.shadow.querySelector(".showConfPasswordBtn")
        //Other Field Vars
        this.passwordInput = this.shadow.querySelector("#passwordInput");
        this.confirmPasswordInput = this.shadow.querySelector("#confirmPasswordInput");
        this.emailInput = this.shadow.querySelector("#emailInput");
        this.userNameInput = this.shadow.querySelector("#userNameInput");
        //Req Field Vars 
        this.formReq = this.shadow.querySelector('.fieldReqBox')
        this.emailReqLine = this.shadow.querySelector('#emailReqLine')
        this.charReqLine = this.shadow.querySelector('#charReqLine')
        this.passReqLine = this.shadow.querySelector('#passReqLine')
        this.specialReqLine = this.shadow.querySelector('#specialReqLine')
        this.numReqLine = this.shadow.querySelector('#numReqLine')
        this.upperReqLine = this.shadow.querySelector('#upperReqLine')
        this.passEqualReqLine = this.shadow.querySelector('#passEqualReqLine')
        // Login Route
        this.loginRoute = this.shadow.querySelector(".loginRoute")
        
        console.log("Shadow DOM initialized.");
        this.currentStep = 0;
    }

    async connectedCallback() {
        console.log("create account component connected");

        if (!this.continueBtn) {
            console.error("Button not found in the shadow DOM.");
        }

        console.log("Event listener connected.");

        // Password View Functionality
        this.showPasswordBtn.addEventListener("click", this.viewField)
        this.showPasswordBtn.addEventListener("mouseover", this.removeHidden)
        this.showPasswordBtn.addEventListener("mouseleave", this.setHidden);

        // Confirm Password View Functionality
        this.showConfPasswordBtn.addEventListener("click", this.viewField)
        this.showConfPasswordBtn.addEventListener("mouseover", this.removeHidden)
        this.showConfPasswordBtn.addEventListener("mouseleave", this.setHidden);

        // Live Req Updates
        this.emailInput.addEventListener("input", () => {this.validateFields()})
        this.passwordInput.addEventListener("input", () => {this.validateFields()})
        this.confirmPasswordInput.addEventListener("input", () => {this.validateFields()})
        
        // Login Route
        this.loginRoute.addEventListener("click", (e) => {
            e.preventDefault()
            const newC = document.createElement("email-input-component")
            newC.classList.add("login-component")
            this.page.innerHTML = ""
            this.page.appendChild(newC)
        })
    }

    setHidden() {
        const component = document.querySelector(".sign-up-component");
        const shadow = component.shadowRoot;
        const element = this.className.includes("Conf") ? "conf" : "pass";
        const hoverText = shadow.querySelector(`div[${element}="3"]`)
        hoverText.setAttribute("hidden", true)
    }

    removeHidden() {
        const component = document.querySelector(".sign-up-component");
        const shadow = component.shadowRoot;
        const element = this.className.includes("Conf") ? "conf" : "pass";
        const hoverText = shadow.querySelector(`div[${element}="3"]`)
        hoverText.removeAttribute("hidden");
    }

    viewField() { 
        const currentActive = this.getAttribute("active")
        const component = document.querySelector(".sign-up-component");
        const shadow = component.shadowRoot;
        const element = this.className.includes("Conf") ? "conf" : "pass";

        // Selecting Elements
        const input = shadow.querySelector(`input[${element}="1"]`)
        const img = shadow.querySelector(`img[${element}="2"]`)
        const hoverText = shadow.querySelector(`div[${element}="3"]`)
        
        if(currentActive === "true"){
            this.setAttribute("active", "false")
            img.setAttribute("src","./icons/show-password.svg")
            hoverText.innerText = "Show password"
            input.setAttribute("type", "password")
        } else {
            this.setAttribute("active", "true")
            img.setAttribute("src","./icons/hide-password.svg")
            hoverText.innerText = "Hide password"
            input.setAttribute("type", "text")
        }
    }

    validateFields() {
        const email = this.emailInput.value.split("@")
        const emailValid = email.length == 2 && email[1] == "umass.edu" && email[0] != "";
        const passwordLenValid = this.passwordInput.value.length >= 8
        const passwordReqValid = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(this.passwordInput.value)
        const passEqual = this.passwordInput.value === this.confirmPasswordInput.value
        const usernameValid = this.userNameInput.value.trim() != "";

        if(emailValid){
            this.emailReqLine.classList.add("reqSatisfied")
            this.emailReqLine.parentNode.setAttribute("hidden", true);
        } else {
            this.emailReqLine.classList.remove("reqSatisfied")
            this.emailReqLine.parentNode.removeAttribute("hidden");
        }

        if(passwordLenValid){
            this.charReqLine.classList.add("reqSatisfied")
            this.charReqLine.parentNode.setAttribute("hidden", true);
        } else {
            this.charReqLine.classList.remove("reqSatisfied")
            this.charReqLine.parentNode.removeAttribute("hidden");
        }

        if(passwordReqValid){
            this.passReqLine.classList.add("reqSatisfied")
            this.passReqLine.parentNode.setAttribute("hidden", true);
            this.numReqLine.parentNode.setAttribute("hidden", true);
            this.specialReqLine.parentNode.setAttribute("hidden", true);
            this.upperReqLine.parentNode.setAttribute("hidden", true);
        } else {
            this.passReqLine.classList.remove("reqSatisfied")
            this.passReqLine.parentNode.removeAttribute("hidden");
            this.numReqLine.parentNode.removeAttribute("hidden");
            this.specialReqLine.parentNode.removeAttribute("hidden");
            this.upperReqLine.parentNode.removeAttribute("hidden");
        }

        if (passEqual) {
            this.passEqualReqLine.classList.add("reqSatisfied")
            this.passEqualReqLine.parentNode.setAttribute("hidden", true);
        } else {
            this.passEqualReqLine.classList.remove("reqSatisfied")
            this.passEqualReqLine.parentNode.removeAttribute("hidden");
        }

        if(emailValid && passwordLenValid && passwordReqValid && passEqual && usernameValid){
            this.formReq.classList.add("hidden")

            this.continueBtn.addEventListener("click", async (e) => {
                e.preventDefault();
                await this.handleCreateAccount();
            });
        } else {
            this.formReq.classList.remove("hidden")
        }
    }

    async handleCreateAccount() {
        if(this.currentStep === 0) {
            const formError = this.shadow.querySelector(".component-form-error");
            const usernameLabel = this.shadow.querySelector(".component-placeholder-one")
            const emailLabel = this.shadow.querySelector(".component-placeholder-two")

            console.log("Form passed validation. Attempting user creation...");
            const userData = {
                username: this.userNameInput.value.trim(),
                email: (this.emailInput.value.trim()).toLowerCase(),
                password: this.passwordInput.value.trim(),
            };

            try {
                console.log(JSON.stringify(userData))

                const response = await fetch('http://localhost:3000/api/user/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData)
                });


                if (!response.ok) {
                    const error = await response.json()
                    const errorMessage = document.createElement("div")
                    formError.classList.add("visible")

                    if (error.error === "username and email unavailable") {
                        errorMessage.innerText = "username & email unavailable";
                        this.userNameInput.classList.add("incorrectInput");
                        this.emailInput.classList.add("incorrectInput");
                        usernameLabel.classList.add("incorrectInputLabel");
                        emailLabel.classList.add("incorrectInputLabel");
                    } else if (error.error === "username unavailable") {
                        errorMessage.innerText = error.error;
                        this.userNameInput.classList.add("incorrectInput");
                        usernameLabel.classList.add("incorrectInputLabel");
                    } else if (error.error === "email unavailable") {
                        errorMessage.innerText = "email unavailable";
                        this.emailInput.classList.add("incorrectInput");
                        emailLabel.classList.add("incorrectInputLabel");
                    }
                    formError.appendChild(errorMessage)
                } else {
                    formError.innerHTML = '';
                    formError.classList.remove("visible")
                    this.userNameInput.classList.remove("incorrectInput");
                    this.emailInput.classList.remove("incorrectInput");
                    usernameLabel.classList.remove("incorrectInputLabel");
                    emailLabel.classList.remove("incorrectInputLabel");

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
                }
            } catch (error) {
                console.error('Error during account creation:', error);  
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