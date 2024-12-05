const template = document.createElement("template");

const componentTemplates = [
    `
        <link rel="stylesheet" href="../../../../team/pages/login/create-account-sequence/create.css">
        <div class="logo">logo</div>
        <slot class="component-title">Welcome</slot>

        <div class="component-container">
            <input type="text" class="component-input" id="emailInput" placeholder=" ">
            <label for="email" class="component-placeholder">Enter your email</label>

            <input type="text" class="component-input2" id="secondEmailInput" placeholder=" ">
            <label for="email" class="component-placeholder2">Confirm your email</label>
            
            <span class="component-form-error"></span>
            <button class="continueBtn">Continue</button>
        </div>
    `,
    `
        <link rel="stylesheet" href="../../../../team/pages/login/create-account-sequence/create.css">
        <div class="logo">logo</div>
        <slot class="component-title">Enter your password</slot>
        <div class="password-requirement-text">password must, be longer than 8 characters,<br>contain at least a capital letter and a number.</div>


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

            <input type="password" class="component-input2" id="passwordInput2" placeholder=" " required>
            <label for="email" class="component-placeholder2">Confirm password</label>
            
            <span class="component-form-error"></span>
            <button type="submit" class="continueBtn">Continue</button>
            </form>
        </div>
    ` 
]

export class enterEmailComponent extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({mode: "open"})
        template.innerHTML = componentTemplates[0]
        shadow.append(template.content.cloneNode(true))

        this.continueBtn = shadow.querySelector(".continueBtn")
        this.inputComponent = shadow.querySelector(".component-input")
        this.inputComponent2 = shadow.querySelector(".component-input2")
        this.errorComponent = shadow.querySelector(".component-form-error")

        this.componentPlaceholder = shadow.querySelector(".component-placeholder")
        this.componentPlaceholder2 = shadow.querySelector(".component-placeholder2")

        this.loginContainer = document.querySelector(".login-container")
        this.loginComponent = document.querySelector(".login-component")
    }

    connectedCallback() {
        this.continueBtn.addEventListener("click", (e) => {
            e.preventDefault()
            const emailInput = this.inputComponent.value.trim().split("@")
            const secondEmailInput = this.inputComponent2.value;

            // will return false if the email address doesn't contain any text or a umass.edu after the @
            if(emailInput.length == 1){
                this.errorComponent.innerText = `Please enter a valid email`
                this.inputComponent.classList.add("incorrectInput")
                this.inputComponent2.classList.add("incorrectInput")
                this.componentPlaceholder.style.color = "red"
                this.componentPlaceholder.style.transition = "none"
            } else if (emailInput[1] != "umass.edu"){
                this.errorComponent.innerText = `Please enter a valid umass email`
                this.inputComponent.classList.add("incorrectInput")

                this.componentPlaceholder.style.color = "red"
                this.componentPlaceholder.style.transition = "none"
            } else if (this.inputComponent.value != secondEmailInput) {
                this.errorComponent.innerText = `Both emails must match`

                this.inputComponent.classList.add("incorrectInput")
                this.inputComponent2.classList.add("incorrectInput2")

                this.componentPlaceholder.style.color = "red"
                this.componentPlaceholder.style.transition = "none"

                this.componentPlaceholder2.style.color = "red"
                this.componentPlaceholder2.style.transition = "none"
            } else {
                const loginComponent = document.querySelector(".login-component")
                loginComponent.remove()
                const passwordInputComponent = document.createElement('enter-password-component')
                passwordInputComponent.classList.add("login-component")
                this.loginContainer.appendChild(passwordInputComponent) 
            }

        })
    }

    disconnectedCallback() {
        
    }
}


class enterPasswordInputComponent extends HTMLElement {
    constructor(){
        super();
        // Initiating shadow dom

        const shadow = this.attachShadow({mode: "open"})
        template.innerHTML = componentTemplates[1]
        shadow.append(template.content.cloneNode(true))

        // Setting variables for ease of use
        this.inputComponent = shadow.querySelector(".component-input")
        this.inputComponent2 = shadow.querySelector(".component-input2")

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
            const componentPlaceholder2 = shadowRoot.querySelector(".component-placeholder2")

            const pass1 = this.inputComponent.value.trim()
            const pass2 = this.inputComponent2.value.trim()

            console.log(pass1.includes("[0-9]"))

            // will return false if password is incorrect
            if (pass1.length < 8) {
                errorComponent.innerText = `Password is too short`
                this.inputComponent.classList.add("incorrectInput")
                componentPlaceholder.style.color = "red"
                componentPlaceholder.style.transition = "none"
                this.showPasswordBtn.style.borderColor = "red";
            } else if (!/[0-9]/.test(pass1)){
                errorComponent.innerText = `Password must include a number`
                this.inputComponent.classList.add("incorrectInput")
                componentPlaceholder.style.color = "red"
                componentPlaceholder.style.transition = "none"
                this.showPasswordBtn.style.borderColor = "red";

            } else if (!/[A-Z]/.test(pass1)){
                errorComponent.innerText = `Password must include a capital letter`
                this.inputComponent.classList.add("incorrectInput")
                componentPlaceholder.style.color = "red"
                componentPlaceholder.style.transition = "none"
                this.showPasswordBtn.style.borderColor = "red";
            } else if (pass1 != pass2){
                errorComponent.innerText = `Passwords must be the same`

                this.inputComponent.classList.add("incorrectInput")
                this.inputComponent2.classList.add("incorrectInput")

                componentPlaceholder.style.color = "red"
                componentPlaceholder.style.transition = "none"

                componentPlaceholder2.style.color = "red"
                componentPlaceholder2.style.transition = "none"

                this.showPasswordBtn.style.borderColor = "red";
            } else {
                console.log("success")
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

customElements.define("enter-password-component", enterPasswordInputComponent)
customElements.define("enter-email-component", enterEmailComponent)