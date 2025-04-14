const template = document.createElement("template");

const componentTemplates = [
    `
        <link rel="stylesheet" href="../login/login-sequence/login.css"">
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
        <link rel="stylesheet" href="../login/login-sequence/login.css"">
        <div class="logo">logo</div>
        <slot class="component-title">Enter your password</slot>

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
            <button type="" class="continueBtn">Continue</button>
            
            <span class="forgotPassRoute">Forgot password?</span>
            </form>
        </div>
    `
]

export class emailInputComponent extends HTMLElement {
    // Initializing Component
    constructor() {
        super();
        this.shadow = this.attachShadow({mode: "open"})
        template.innerHTML = componentTemplates[0]
        this.shadow.append(template.content.cloneNode(true))

        // Initialize Refs to Null
        this.continueBtn = null;
        this.inputComponent = null;
        this.errorComponent = null;
        this.componentPlaceholder = null;
        this.signUpRoute = null;
        this.page = null;
        this.loginContainer = null;
        this.loginComponent = null;
    }

    connectedCallback() {
        this.setUpDomReferences();
        this.attachListeners();
    }

    setUpDomReferences() {
        this.continueBtn = this.shadow.querySelector(".continueBtn")
        this.inputComponent = this.shadow.querySelector(".component-input")
        this.errorComponent = this.shadow.querySelector(".component-form-error")
        this.componentPlaceholder = this.shadow.querySelector(".component-placeholder")
        this.signUpRoute = this.shadow.querySelector(".signUpRoute")
        this.page = document.querySelector(".login-container");
        this.loginContainer = document.querySelector(".login-container")
        this.loginComponent = document.querySelector('email-input-component')
    }

    attachListeners() {
        if (this.continueBtn) {
            this.continueBtn.addEventListener("click", () => this.emailVerification())
        }

        if (this.signUpRoute) {
            this.signUpRoute.addEventListener("click", () => this.navigateToSignUpPage())
        }
    }

    async emailVerification() {
        const email = (this.inputComponent.value.trim()).toLowerCase();

        // will return false if the email address doesn't contain any text or a umass.edu after the @
        if(!email.includes("@umass.edu")){
            this.errorComponent.innerText = `Please enter a valid email`
            this.componentPlaceholder.style.color = "red"
            return;
        }
        try{
            const loginResponse = await fetch('http://localhost:3000/api/user/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({"email":email}),
            })

            const auth = await loginResponse.json()

            if(auth.validEmail){
                const passwordInputComponent = document.createElement('password-input-component');
                passwordInputComponent.classList.add("sign-up-component");
                passwordInputComponent.setAttribute('data-email', email);
                this.loginContainer.innerHTML = "";
                this.loginContainer.appendChild(passwordInputComponent);
            }else{
                this.errorComponent.innerText = auth.error;
                this.errorComponent.style.color = "red";
            }
        } catch(error){
            console.error("cant fetch data",error);
            this.errorComponent.innerText="Error connecting to server";
        }
    }

    navigateToSignUpPage() {
        const signUpComponent = document.createElement("create-account-component");
        signUpComponent.classList.add("sign-up-component");
        this.loginComponent.remove()
        this.loginContainer.appendChild(signUpComponent);
    }

    disconnectedCallback() {
        if (this.continueBtn) {
            this.continueBtn.removeEventListener("click", this.emailVerification);   
        }

        if (this.signUpRoute) {
            this.signUpRoute.removeEventListener("click", this.navigateToSignUpPage);  
        }
    }
}

class passwordInputComponent extends HTMLElement {
    constructor(){
        super();
        this.shadow = this.attachShadow({mode: "open"})
        template.innerHTML = componentTemplates[1]
        this.shadow.append(template.content.cloneNode(true))
        this.page = document.querySelector(".login-container")

        // Setting variables for ease of use
        this.inputComponent = null;
        this.errorComponent= null;
        this.continueBtn = null;
        this.showPasswordBtn = null;
        this.showPasswordHoverText = null;
        this.showPasswordImg = null;
        this.component = null;
        this.forgotPassRoute = null;
        this.continueBtn = null;
        this.email = null;
    }

    connectedCallback() {
        this.setUpDomReferences();
        this.attachListeners();
    }

    setUpDomReferences() {
        this.inputComponent = this.shadow.querySelector(".component-input");
        this.errorComponent= this.shadow.querySelector(".component-form-error");
        this.continueBtn = this.shadow.querySelector(".continueBtn");
        this.showPasswordBtn = this.shadow.querySelector(".showPasswordBtn");
        this.showPasswordHoverText = this.shadow.querySelector(".show-password-hover-text");
        this.showPasswordImg = this.shadow.querySelector(".show-password-img");
        this.component = document.querySelector('password-input-component');
        this.userEmail = this.component.getAttribute('data-email')
        this.forgotPassRoute = this.shadow.querySelector(".forgotPassRoute")
        this.email = null;
    }

    attachListeners() {
        if (this.continueBtn) {
            this.continueBtn.addEventListener("click", (e) => this.passwordVerification(e))
        }

        if (this.forgotPassRoute) {
            this.forgotPassRoute.addEventListener("click", () => this.navigateToForgotPasswordPage())
        }

        if (this.showPasswordBtn) {
            this.showPasswordBtn.addEventListener("click", () => this.toggleViewPassword());
            this.showPasswordBtn.addEventListener("mouseover", () => this.removeHidden());
            this.showPasswordBtn.addEventListener("mouseleave", () => this.setHidden()); 
        }
    }

    async passwordVerification(e) {
        e.preventDefault()
        const password = this.inputComponent.value.trim();

        if(!password){
            this.errorComponent.innerText = "Password cannot be empty"
            return;
        }
            
        try{
            const body = {"email": this.userEmail.toLowerCase(), "password": password}

            const loginResponse = await fetch('http://localhost:3000/api/user/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })

            const auth = await loginResponse.json()

            if(auth.isAuth){
                // Saves Session Data
                localStorage.setItem("auth", JSON.stringify(auth))
    
                // Sends user to home if email is verified, and to verification if not
                if (auth.userData.emailVerified) {
                    console.log("redirecting to home...");
                    window.location.href = 'http://localhost:3000'; 
                } else {
                    this.navigateToEmailVerificationPage()
                }
            } else {
                this.errorComponent.innerText = auth.error
            }
            
        }catch(error){
            console.error("cant validate password",error);
            this.errorComponent.innerText="cant connect to server";
        }
    }

    toggleViewPassword() {
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
    }

    setHidden() {
        this.showPasswordHoverText.setAttribute("hidden", true);
    }

    removeHidden() {
        this.showPasswordHoverText.removeAttribute("hidden")
    }

    navigateToForgotPasswordPage() {
        console.log("To be implemented");
    }

    navigateToEmailVerificationPage() {
        const component = document.querySelector('password-input-component')
        // initializing new component to pass in
        const verification = document.createElement("verification-component");
        verification.classList.add("verification-component");

        // removing current component
        component.remove();

        // adding new component
        this.page.appendChild(verification); 
    }

    disconnectedCallback(){
        // Clearing all events
        if (this.continueBtn) {
            this.continueBtn.removeEventListener("click", this.passwordVerification);
        }
        
        if (this.forgotPassRoute) {
            this.forgotPassRoute.removeEventListener("click", this.navigateToForgotPasswordPage); 
        }

        if (this.showPasswordBtn) {
            this.showPasswordBtn.removeEventListener("click", this.toggleViewPassword);
            this.showPasswordBtn.removeEventListener("mouseover", this.removeHidden);
            this.showPasswordBtn.removeEventListener("mouseleave", this.setHidden);   
        }
    }
}

customElements.define("email-input-component", emailInputComponent)
customElements.define("password-input-component", passwordInputComponent)