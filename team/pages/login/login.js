const template = document.createElement("template");

const componentTemplates = [
    `
        <link rel="stylesheet" href="login.css">
        <slot class="component-title"></slot>

        <div class="component-container">
            <input type="text" class="component-input" id="0" placeholder=" ">
            <label for="email" class="component-placeholder">Email Address</label>
            <span class="component-form-error"></span>
            <button class="continueBtn">Continue</button>
            <span class="signUpText">Don't have an account?<span class="signUpRoute"> Sign up </span></span>
        </div>
    `,
    `
        <link rel="stylesheet" href="login.css">
        <slot class="component-title"></slot>

        <div class="component-container">
            <form class="component-password-form">
            <input type="password" class="component-input" id="1" placeholder=" " required>
            <label for="email" class="component-placeholder">Password</label>
            <span class="component-form-error"></span>
            <button type="submit" class="continueBtn">Continue</button>
            <span class="forgotPassRoute">Forgot password?</span>
            </form>
        </div>
    `
]

class emailInputComponent extends HTMLElement {
    // Initializing Component
    constructor() {
        super();
        const shadow = this.attachShadow({mode: "open"})
        template.innerHTML = componentTemplates[0]
        shadow.append(template.content.cloneNode(true))
    }

    connectedCallback() {
        const loginComponent = document.querySelector(".login-component");
        const shadowRoot = loginComponent.shadowRoot;
        shadowRoot.querySelector(".continueBtn")
        const continueBtn = shadowRoot.querySelector(".continueBtn")

        // Validates Input

        continueBtn.addEventListener("click", (e) => {
            e.preventDefault()
            const inputComponent = shadowRoot.querySelector(".component-input")
            const errorComponent = shadowRoot.querySelector(".component-form-error")
            const componentPlaceholder = shadowRoot.querySelector(".component-placeholder")
            const loginContainer = document.querySelector(".login-container")

            const emailInput = inputComponent.value.trim().split("@")

            // will return false if the email address doesn't contain any text or a umass.edu after the @
            if(emailInput.length == 1){
                errorComponent.innerText = `Please enter a valid email`
                inputComponent.classList.add("incorrectInput")
                componentPlaceholder.style.color = "red"
                componentPlaceholder.style.transition = "none"

            } else if (emailInput[1] != "umass.edu"){
                errorComponent.innerText = `Please enter a valid umass email`
                inputComponent.classList.add("incorrectInput")
                componentPlaceholder.style.color = "red"
                componentPlaceholder.style.transition = "none"
            } else {
                loginComponent.remove()
                const passwordInputComponent = document.createElement('password-input-component')
                passwordInputComponent.innerText = "Enter your password"
                passwordInputComponent.classList.add("login-component")
                loginContainer.appendChild(passwordInputComponent) 
            }

        })
    }
    disconnectedCallback(){
        console.log("removed")
    }
}

class passwordInputComponent extends HTMLElement {
    constructor(){
        super();
        const shadow = this.attachShadow({mode: "open"})
        template.innerHTML = componentTemplates[1]
        shadow.append(template.content.cloneNode(true))
    }

    connectedCallback() {
        const shadowRoot = this.shadowRoot
        shadowRoot.querySelector(".continueBtn")
        const continueBtn = shadowRoot.querySelector(".continueBtn")

        // Validates Input
        continueBtn.addEventListener("click", (e) => {
            e.preventDefault()
            const inputComponent = shadowRoot.querySelector(".component-input")
            const errorComponent = shadowRoot.querySelector(".component-form-error")
            const componentPlaceholder = shadowRoot.querySelector(".component-placeholder")

            // will return false if password is incorrect
            if (inputComponent.value.trim() == "testPass") {
                console.log("login success")
            } else {
                errorComponent.innerText = `Incorrect password`
                inputComponent.classList.add("incorrectInput")
                componentPlaceholder.style.color = "red"
                componentPlaceholder.style.transition = "none"
            }
        })
    }
}

customElements.define("email-input-component", emailInputComponent)
customElements.define("password-input-component", passwordInputComponent)