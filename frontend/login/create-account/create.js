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
        <div class="navBack">
            <img src="./icons/arrow-left.svg" alt="arrow-left" id="navBack" class ="navBack-img"></img>
        </div>
        <div class="logo">logo</div>
        
        <slot class="component-title">Enter your personal info</slot>

        <div class="component-container">
            <input type="text" class="component-input-one" id="firstNameInput" placeholder=" ">
            <label for="firstName" class="component-placeholder-one">First Name</label>

            <input type="text" class="component-input-two" id="lastNameInput" placeholder=" ">
            <label for="lastName" class="component-placeholder-two">Last Name</label>

            <input type="text" class="component-input-three" id="birthdayInput" placeholder=" ">
            <label for="lastName" class="component-placeholder-three">Birthday (MMDDYYYY)</label>

            <div class="component-form-error" hidden="true"></div>

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
        this.page = document.querySelector(".login-container")

        // Bind all methods that will be used as event listeners
        // this.viewField = this.viewField.bind(this);
        // this.removeHidden = this.removeHidden.bind(this);
        // this.setHidden = this.setHidden.bind(this);
        this.validateFields = this.validateFields.bind(this);
        this.handleCreateAccount = this.handleCreateAccount.bind(this);

        // Initialize refs to null
        this.continueBtn = null;
        this.showPasswordBtn = null;
        this.showConfPasswordBtn = null;
        this.emailInput = null;
        this.passwordInput = null;
        this.confirmPasswordInput = null;
        this.userNameInput = null;
        this.loginRoute = null;
        this.navBack = null;
        this.formReq = null;
        this.emailReqLine = null;
        this.charReqLine = null;
        this.passReqLine = null;
        this.specialReqLine = null;
        this.numReqLine = null;
        this.upperReqLine = null;
        this.passEqualReqLine = null;
        this.formError = null;
        this.firstNameInput = null;
        this.lastNameInput = null;
        this.birthdayInput = null;

        this.currentStep = 0;
        this.userData = null;
        this.personalData = null;
        this.addEvent = true;
    }

    async connectedCallback() {
        this.setupDOMReferences();
        this.attachListeners();
    }

    setupDOMReferences() {
        this.continueBtn = this.shadow.querySelector(".continueBtn");
        this.showPasswordBtn = this.shadow.querySelector(".showPasswordBtn");
        this.showConfPasswordBtn = this.shadow.querySelector(".showConfPasswordBtn");
        this.emailInput = this.shadow.querySelector("#emailInput");
        this.passwordInput = this.shadow.querySelector("#passwordInput");
        this.confirmPasswordInput = this.shadow.querySelector("#confirmPasswordInput");
        this.userNameInput = this.shadow.querySelector("#userNameInput");
        this.loginRoute = this.shadow.querySelector(".loginRoute");
        this.navBack = this.shadow.getElementById("navBack");
        this.formReq = this.shadow.querySelector('.fieldReqBox');
        this.emailReqLine = this.shadow.querySelector('#emailReqLine');
        this.charReqLine = this.shadow.querySelector('#charReqLine');
        this.passReqLine = this.shadow.querySelector('#passReqLine');
        this.specialReqLine = this.shadow.querySelector('#specialReqLine');
        this.numReqLine = this.shadow.querySelector('#numReqLine');
        this.upperReqLine = this.shadow.querySelector('#upperReqLine');
        this.passEqualReqLine = this.shadow.querySelector('#passEqualReqLine');
        this.formError = this.shadow.querySelector(".component-form-error");

        if(this.currentStep === 1) {
            this.firstNameInput = this.shadow.getElementById("firstNameInput");
            this.lastNameInput = this.shadow.getElementById("lastNameInput");
            this.birthdayInput = this.shadow.getElementById("birthdayInput");
        }
    }

    attachListeners() {
        if (this.showPasswordBtn && this.currentStep === 0) {
          this.showPasswordBtn.addEventListener("click", this.viewField);
          this.showPasswordBtn.addEventListener("mouseover", this.removeHidden);
          this.showPasswordBtn.addEventListener("mouseleave", this.setHidden);
        }
    
        if (this.showConfPasswordBtn && this.currentStep === 0) {
          this.showConfPasswordBtn.addEventListener("click", this.viewField);
          this.showConfPasswordBtn.addEventListener("mouseover", this.removeHidden);
          this.showConfPasswordBtn.addEventListener("mouseleave", this.setHidden);
        }
    
        if (this.emailInput && this.currentStep === 0) {
          this.emailInput.addEventListener("input", this.validateFields);
        }
    
        if (this.passwordInput && this.currentStep === 0) {
          this.passwordInput.addEventListener("input", this.validateFields);
        }
    
        if (this.confirmPasswordInput && this.currentStep === 0) {
          this.confirmPasswordInput.addEventListener("input", this.validateFields);
        }
    
        if (this.loginRoute) {
          this.loginRoute.addEventListener("click", (e) => {
            e.preventDefault();
            const newC = document.createElement("email-input-component");
            newC.classList.add("login-component");
            this.page.innerHTML = "";
            this.page.appendChild(newC);
          });
        }
    
        if (this.navBack && this.currentStep === 1) {
            this.navBack.addEventListener("click", this.handleNavBack);
        }
    
        if (this.continueBtn && !this.addEvent) {
            this.continueBtn.addEventListener("click", this.handleCreateAccount);
        }
    }
    
    handleNavBack = () => {
        this.personalData = {
            firstName: this.firstNameInput.value.trim(),
            lastName: this.lastNameInput.value.trim(),
            birthday: this.birthdayInput.value.trim()
        }
        this.currentStep--;
        this.shadow.innerHTML = componentTemplates[this.currentStep];
        this.addEvent = true;
        
        setTimeout(() => {
            this.setupDOMReferences();
            this.attachListeners();
            if (this.userData) {
                this.userNameInput.value = this.userData.username;
                this.emailInput.value = this.userData.email;
                this.passwordInput.value = this.userData.password; 
            }
            this.validateFields();
        }, 0);
    };

    setHidden() {
        // Sets hover texts hidden
        const component = document.querySelector(".sign-up-component");
        const shadow = component.shadowRoot;
        const element = this.className.includes("Conf") ? "conf" : "pass";
        const hoverText = shadow.querySelector(`div[${element}="3"]`)
        hoverText.setAttribute("hidden", true)
    }

    removeHidden() {
        // Sets hover text visible
        const component = document.querySelector(".sign-up-component");
        const shadow = component.shadowRoot;
        const element = this.className.includes("Conf") ? "conf" : "pass";
        const hoverText = shadow.querySelector(`div[${element}="3"]`)
        hoverText.removeAttribute("hidden");
    }

    viewField() { 
        // Enabling the view field functionality for conf and pass
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
        // Validating all first page fields are correct
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

            if(this.addEvent) {
                this.userData = {
                    username: this.userNameInput.value.trim(),
                    email: (this.emailInput.value.trim()).toLowerCase(),
                    password: this.passwordInput.value.trim(),
                };

                this.continueBtn.addEventListener("click", async (e) => {
                    e.preventDefault();
                    await this.handleCreateAccount();
                });
                this.addEvent =  false;
            } 
        } else {
            this.formReq.classList.remove("hidden")
        }
    }

    async handleCreateAccount() {
        if (this.currentStep === 0) {
            // Refills data in case of page switch
            if (this.userData) {
                this.userNameInput.value = this.userData.username;
                this.emailInput.value = this.userData.email;
                this.passwordInput.value = this.userData.password;
            }
    
            this.formError.innerHTML = "";
            const usernameLabel = this.shadow.querySelector(".component-placeholder-one");
            const emailLabel = this.shadow.querySelector(".component-placeholder-two");
    
            // Verifying Username and Email are both Available
            try {
                const response = await fetch('http://localhost:3000/api/user/check', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(this.userData)
                });
    
                this.userNameInput.classList.remove("incorrectInput");
                this.emailInput.classList.remove("incorrectInput");
                usernameLabel.classList.remove("incorrectInputLabel");
                emailLabel.classList.remove("incorrectInputLabel");
    
                if (!response.ok) {
                    const error = await response.json();
                    const errorMessage = document.createElement("div");
                    this.formError.classList.add("visible");
    
                    if (error.error === "username and email unavailable") {
                        errorMessage.innerText = "• username & email unavailable";
                        this.userNameInput.classList.add("incorrectInput");
                        this.emailInput.classList.add("incorrectInput");
                        usernameLabel.classList.add("incorrectInputLabel");
                        emailLabel.classList.add("incorrectInputLabel");
                    } else if (error.error === "username unavailable") {
                        errorMessage.innerText = "• " + error.error;
                        this.userNameInput.classList.add("incorrectInput");
                        usernameLabel.classList.add("incorrectInputLabel");
                    } else if (error.error === "email unavailable") {
                        errorMessage.innerHTML = "• email unavailable";
                        this.emailInput.classList.add("incorrectInput");
                        emailLabel.classList.add("incorrectInputLabel");
                    }
                    this.formError.appendChild(errorMessage);
                    this.userData = null;
                } else {
                    // Clearing current Field changes
                    this.formError.innerHTML = '';
                    this.formError.classList.remove("visible");
                    this.userNameInput.classList.remove("incorrectInput");
                    this.emailInput.classList.remove("incorrectInput");
                    usernameLabel.classList.remove("incorrectInputLabel");
                    emailLabel.classList.remove("incorrectInputLabel");
    
                    // Loading Second Step Fields
                    
                    this.userData = {
                        username: this.userNameInput.value.trim(),
                        email: (this.emailInput.value.trim()).toLowerCase(),
                        password: this.passwordInput.value.trim(),
                    }; 

                    this.currentStep++;
                    this.shadow.innerHTML = componentTemplates[this.currentStep];
                    
                    // Use setTimeout to ensure DOM is ready before setting up
                    setTimeout(() => {
                        this.setupDOMReferences();
                        this.attachListeners();

                        // Set up continue button for step 1
                        if (this.continueBtn) {
                            this.continueBtn.addEventListener("click", this.handleCreateAccount);
                        }

                        console.log(this.userData)

                        

                        // Set up back navigation
                        if (this.navBack) {
                            this.navBack.addEventListener("click", this.handleNavBack);
                        }

                        if(this.personalData){
                            this.firstNameInput.value = this.personalData.firstName;
                            this.lastNameInput.value = this.personalData.lastName;
                            this.birthdayInput.value = this.personalData.birthday;
                        }
                    }, 0);
                }
            } catch (error) {
                console.error('Error during account creation:', error);  
            }
        } else if (this.currentStep === 1) {
            // Getting Basic Personal Info
            this.formError.innerHTML = ""
            let userAge = 0;
            let isValid = true; 

            const firstNameErrorMessage = document.createElement("div")
            if (this.firstNameInput.value.trim() === "" || /\d/.test(this.firstNameInput.value.trim())) {
                firstNameErrorMessage.innerText = "• invalid first name";
                this.formError.appendChild(firstNameErrorMessage)
                this.firstNameInput.classList.add("incorrectInput");
                isValid = false;
            } else {
                this.firstNameInput.classList.remove("incorrectInput");
                isValid = true;
            }

            const lastNameErrorMessage = document.createElement("div")
            if (this.lastNameInput.value.trim() === "" || /\d/.test(this.lastNameInput.value.trim())) {
                lastNameErrorMessage.innerText = "• invalid last name";
                this.formError.appendChild(lastNameErrorMessage)
                this.lastNameInput.classList.add("incorrectInput");
                isValid = false;
            } else {
                this.lastNameInput.classList.remove("incorrectInput");
                isValid = true;
            }

            const birthdayErrorMessage = document.createElement("div")
            if (this.birthdayInput.value.trim() === "" || /[A-Za-z]/.test(this.birthdayInput.value.trim()) || this.birthdayInput.value.trim().length < 8 || this.birthdayInput.value.trim().length > 8) {
                birthdayErrorMessage.innerText = "• invalid birthday format"
                this.formError.appendChild(birthdayErrorMessage)
                this.birthdayInput.classList.add("incorrectInput");
                isValid = false;
            } else {
                this.birthdayInput.classList.remove("incorrectInput");
                isValid = true
                // Valid Birthday Check
                const month = this.birthdayInput.value.trim().slice(0,2)
                const day = this.birthdayInput.value.trim().slice(2,4)
                const year =  this.birthdayInput.value.trim().slice(4,8)
                const today = new Date()

                userAge = today.getFullYear() - year;

                const monthDifference =  today.getMonth() - month;
                const dayDifference = today.getDay() - day; 

                if (monthDifference < 0 || monthDifference === 0 && dayDifference < 0) {
                    userAge--; 
                }

                if (userAge <= 0) { // age limit 13 idk? 
                    birthdayErrorMessage.innerText = "• invalid birthday"
                    this.formError.appendChild(birthdayErrorMessage)
                    this.birthdayInput.classList.add("incorrectInput");
                    isValid = false;
                }
            }

            if(this.formError.innerHTML != ""){
                this.formError.classList.add("visible");
            }

            if (isValid) {
                console.log("Form validation passed, updating account details");
                // Adding new Data Fields
                this.userData.name = this.firstNameInput.value.trim() + " " + this.lastNameInput.value.trim();
                this.userData.age = userAge; // Need to add birthday field
    
                const response = await fetch(`/api/user/create`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(this.userData), // Fixed: use this.userData
                });
    
                if (response.ok) {
                    const result = await response.json(); 
                    localStorage.setItem("auth", JSON.stringify({userId: result.id}));
                    console.log("User created successfully", result);
                    this.navigateToNextStep();
                } else {
                    console.log("Unknown Error")
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
        // Clean up all event listeners
        if (this.showPasswordBtn) {
            this.showPasswordBtn.removeEventListener("click", this.viewField);
            this.showPasswordBtn.removeEventListener("mouseover", this.removeHidden);
            this.showPasswordBtn.removeEventListener("mouseleave", this.setHidden);
        }
    
        if (this.showConfPasswordBtn) {
            this.showConfPasswordBtn.removeEventListener("click", this.viewField);
            this.showConfPasswordBtn.removeEventListener("mouseover", this.removeHidden);
            this.showConfPasswordBtn.removeEventListener("mouseleave", this.setHidden);
        }
    
        if (this.emailInput) {
            this.emailInput.removeEventListener("input", this.validateFields);
        }
    
        if (this.passwordInput) {
            this.passwordInput.removeEventListener("input", this.validateFields);
        }
    
        if (this.confirmPasswordInput) {
            this.confirmPasswordInput.removeEventListener("input", this.validateFields);
        }
    
        if (this.loginRoute) {
            this.loginRoute.removeEventListener("click", this.handleLoginRoute);
        }
    
        if (this.navBack) {
            this.navBack.removeEventListener("click", this.handleNavBack);
        }
    
        if (this.continueBtn) {
            this.continueBtn.removeEventListener("click", this.handleCreateAccount);
        }
    }
    
}

customElements.define("create-account-component", createAccount);