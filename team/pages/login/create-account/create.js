const template = document.createElement("template")

const componentTemplates = [
    `
        <link rel="stylesheet" href="../../../../team/pages/login/create-account/create.css">
        <div class="logo">logo</div>
        <slot class="component-title">Create an account</slot>

        <div class="component-container">
            <input type="text" class="component-input" id="usernameInput" placeholder=" ">
            <label for="username" class="component-placeholder">Username</label>
            <span class="component-form-error"></span>

            <input type="email" class="component-input" id="emailInput" placeholder=" ">
            <label for="email" class="component-placeholder">Email Address</label>
            <span class="component-form-error"></span>

            <input type="password" class="component-input" id="passwordInput" placeholder=" ">
            <label for="password" class="component-placeholder">Password</label>
            <span class="component-form-error"></span>

            <button class="continueBtn">Continue</button>
            <span class="signInText">Already have an account?<span class="signInRoute"> Sign in </span></span>
        </div>
    `,
    `
        <link rel="stylesheet" href="../../../../team/pages/login/create-account/create.css">
        <div class="logo">logo</div>
        <slot class="component-title">Account Created</slot>

        <div class="component-container">
            <div class="account-created-message">Your account has been successfully created!</div>
            <button class="continueBtn">Go to Login</button>
        </div>
    `
];


export class createAccount extends HTMLElement {
    constructor(){
        super()
        const shadow = this.attachShadow({mode: "open"})
        template.innerHTML = componentTemplates[0];
        shadow.append(template.content.cloneNode(true))


        this.continueBtn = shadow.querySelector(".continueBtn");
        this.usernameInput = shadow.querySelector("#usernameInput");
        this.emailInput = shadow.querySelector("#emailInput");
        this.passwordInput = shadow.querySelector("#passwordInput");
        this.errorComponents = shadow.querySelectorAll(".component-form-error");
    
    }

    connectedCallback() {
        this.continueBtn.addEventListener("click", (e) => {
            e.preventDefault();
            this.handleCreateAccount();
        });
    }

    disconnectedCallback(){
        console.log("Create account component disconnected")
    }
    handleCreateAccount(){
        let isValid=true;

        //user
        if (this.usernameInput.value.trim() === "") {
            this.errorComponents[0].innerText = "Please enter a username";
            this.usernameInput.classList.add("incorrectInput");
            isValid = false;
        } else {
            this.errorComponents[0].innerText = "";
            this.usernameInput.classList.remove("incorrectInput");
        }
        //email
        const emailInput = this.emailInput.value.trim().split("@");
        if (emailInput.length === 1 || emailInput[1] !== "umass.edu") {
            this.errorComponents[1].innerText = "Please enter a valid umass.edu email";
            this.emailInput.classList.add("incorrectInput");
            isValid = false;
        } else {
            this.errorComponents[1].innerText = "";
            this.emailInput.classList.remove("incorrectInput");
        }
        //password
        if (this.passwordInput.value.trim().length < 6) {
            this.errorComponents[2].innerText = "Password must be at least 6 characters long";
            this.passwordInput.classList.add("incorrectInput");
            isValid = false;
        } else {
            this.errorComponents[2].innerText = "";
            this.passwordInput.classList.remove("incorrectInput");
        }

        if (isValid) {
            this.showAccountCreatedMessage();
        }
    }

    //show success
    showAccountCreatedMessage() {
        const shadow = this.shadowRoot;
        template.innerHTML = componentTemplates[1]; // Switch to the "Account Created" template
        shadow.append(template.content.cloneNode(true));
        const continueBtn = shadow.querySelector(".continueBtn");
        
    }
}

customElements.define("create-account-component", createAccount);