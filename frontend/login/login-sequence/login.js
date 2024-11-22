const template = document.createElement("template");

const componentTemplates = [
    `
        <link rel="stylesheet" href="../../../frontend/login/login-sequence/login.css"">
        <div class="logo">logo</div>
        <slot class="component-title">Welcome back</slot>

        <div class="component-container">
            <input type="text" class="component-input" id="emailInput" placeholder=" ">
            <label for="email" class="component-placeholder">Email Address</label>
            <span class="component-form-error"></span>
            <button class="continueBtn">Continue</button>
            <span class="signUpText">Don't have an account?<span class="signUpRoute"> Sign up </span></span>
        </div>
    `,
    `
        <link rel="stylesheet" href="../../../frontend/login/login-sequence/login.css"">
        <div class="logo">logo</div>
        <slot class="component-title"></slot>

        <div class="component-container">
            <form class="component-password-form">
            
            <div class="component-input-wrapper">
                <input type="password" class="component-input" id="passwordInput" placeholder=" " required>
                <label for="email" class="component-placeholder">Password</label>
                <div class="showPasswordBtn" active="false">
                    <img src="./icons/show-password.svg" alt="show-password" class ="show-password-img"></img>
                    <div class="show-password-hover-text" hidden="true">Show password</div>
                </div>
            </div>
            
            <span class="component-form-error"></span>
            <button type="submit" class="continueBtn">Continue</button>
            
            <span class="forgotPassRoute">Forgot password?</span>
            </form>
        </div>
    `
]

export class emailInputComponent extends HTMLElement {
    // Initializing Component
    constructor() {
        super();
        const shadow = this.attachShadow({mode: "open"})
        template.innerHTML = componentTemplates[0]
        shadow.append(template.content.cloneNode(true))

        // Setting variables for ease of use
        this.continueBtn = shadow.querySelector(".continueBtn")
        this.inputComponent = shadow.querySelector(".component-input")
        this.errorComponent = shadow.querySelector(".component-form-error")
        this.componentPlaceholder = shadow.querySelector(".component-placeholder")
        this.loginContainer = document.querySelector(".login-container")
        this.loginComponent = document.querySelector(".login-component")

    }

    connectedCallback() {

        // Validates Input
        this.continueBtn.addEventListener("click", (e) => {
            e.preventDefault()
            const emailInput = this.inputComponent.value.trim().split("@")

            // will return false if the email address doesn't contain any text or a umass.edu after the @
            if(emailInput.length == 1){
                this.errorComponent.innerText = `Please enter a valid email`
                this.inputComponent.classList.add("incorrectInput")
                this.componentPlaceholder.style.color = "red"
                this.componentPlaceholder.style.transition = "none"

            } else if (emailInput[1] != "umass.edu"){
                this.errorComponent.innerText = `Please enter a valid umass email`
                this.inputComponent.classList.add("incorrectInput")
                this.componentPlaceholder.style.color = "red"
                this.componentPlaceholder.style.transition = "none"
            } else {
                const loginComponent = document.querySelector(".login-component")
                loginComponent.remove()
                const passwordInputComponent = document.createElement('password-input-component')
                passwordInputComponent.innerText = "Enter your password"
                passwordInputComponent.classList.add("login-component")
                this.loginContainer.appendChild(passwordInputComponent) 
            }

        })
    }
    disconnectedCallback(){
        console.log("email component removed")
    }
}

class passwordInputComponent extends HTMLElement {
    constructor(){
        super();
        // Initiating shadow dom

        const shadow = this.attachShadow({mode: "open"})
        template.innerHTML = componentTemplates[1]
        shadow.append(template.content.cloneNode(true))

        // Setting variables for ease of use
        this.inputComponent = shadow.querySelector(".component-input")
        this.showPasswordBtn = shadow.querySelector(".showPasswordBtn")
        this.showPasswordHoverText = shadow.querySelector(".show-password-hover-text")
        this.showPasswordImg = shadow.querySelector(".show-password-img")
    }

    connectedCallback() {
        const shadowRoot = this.shadowRoot
        shadowRoot.querySelector(".continueBtn")
        const continueBtn = shadowRoot.querySelector(".continueBtn")

        // Validates Input
        continueBtn.addEventListener("click", (e) => {
            e.preventDefault()
            const errorComponent = shadowRoot.querySelector(".component-form-error")
            const componentPlaceholder = shadowRoot.querySelector(".component-placeholder")

            // will return false if password is incorrect
            if (this.inputComponent.value.trim() == "testPass") {
                console.log("login success")
            } else {
                errorComponent.innerText = `Incorrect password`
                this.inputComponent.classList.add("incorrectInput")
                componentPlaceholder.style.color = "red"
                componentPlaceholder.style.transition = "none"
                this.showPasswordBtn.style.borderColor = "red";
            }
        })

        this.showPasswordBtn.addEventListener("click", () => {
            const currentActive = this.showPasswordBtn.getAttribute("active")

            if(currentActive === "true"){
                this.showPasswordBtn.setAttribute("active", "false")
                this.showPasswordImg.setAttribute("src","./icons/show-password.svg")
                this.showPasswordHoverText.innerText = "Show password"
                this.inputComponent.setAttribute("type", "password")
            } else {
                this.showPasswordBtn.setAttribute("active", "true")
                this.showPasswordImg.setAttribute("src","./icons/hide-password.svg")
                this.showPasswordHoverText.innerText = "Hide password"
                this.inputComponent.setAttribute("type", "text")
            }
        })

        this.showPasswordBtn.addEventListener("mouseover", () => {
            this.showPasswordHoverText.removeAttribute("hidden")
            
        })

        this.showPasswordBtn.addEventListener("mouseleave", () => {
            this.showPasswordHoverText.setAttribute("hidden", true);
        });
    }

    disconnectedCallback(){
        console.log("password component removed")
    }
}

customElements.define("email-input-component", emailInputComponent)
customElements.define("password-input-component", passwordInputComponent)