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
        this.signUpRoute = shadow.querySelector(".signUpRoute")
        this.page = document.querySelector(".login-container");
    }

    connectedCallback() {

        // Validates Input
        this.continueBtn.addEventListener("click", async (e) => {
            e.preventDefault()
            const email = this.inputComponent.value.trim();

            // will return false if the email address doesn't contain any text or a umass.edu after the @
            if(!email.includes("@umass.edu")){
                this.errorComponent.innerText = `Please enter a valid email`
                this.componentPlaceholder.style.color = "red"
                return;

            }
            try{
                const response=await fetch('user/getAll');
                const users=await response.json();
                const userExists=users.some(user => user.email === email);
                
                
                if(userExists){
                    const passwordInputComponent=document.createElement('password-input-component');
                    passwordInputComponent.setAttribute('data-email', email);
                    this.loginContainer.innerHTML = "";
                    this.loginContainer.appendChild(passwordInputComponent);
                }else{
                    this.errorComponent.innerText="No account found w/ this email";
                    this.errorComponent.style.color="red";
                }
            }catch(error){
                console.error("cant fetch data",error);
                this.errorComponent.innerText="Error connecting to server";
            }
        });
        this.signUpRoute.addEventListener("click", (e) => {
            e.preventDefault();
            const signUpComponent=document.createElement("create-account-component");
            signUpComponent.classList.add("sign-up-component");
            this.loginComponent.innerHTML="";
            this.loginComponent.appendChild(signUpComponent);
        });
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
        this.errorComponent=shadow.querySelector(".component-form-error");
        this.email=this.getAttribute('data-email');
    }

    connectedCallback() {
        const continueBtn = shadowRoot.querySelector(".continueBtn")

        continueBtn.addEventListener("click", async (e) => {
            e.preventDefault()
            const password=this.inputComponent.value.trim();
            if(!password){
                this.errorComponent.innerText="Password cant be empty"
                return;
            }
            try{
                const response=await fetch('http://localhost:3000/api/user/getAll');
                const users=await response.json();
                const user=users.find(user => user.email === this.email);

                if(user && user.password===password){
                    console.log("login succ");
                    this.errorComponent.innerText="Login successful";
                }else{
                    this.errorComponent.innerText="Invalid pass";
                    this.errorComponent.style.color="red";
                }
            }catch(error){
                console.error("cant validate password",error);
                this.errorComponent.innerText="cant connect to server";
            }
        });
    }
}

customElements.define("email-input-component", emailInputComponent)
customElements.define("password-input-component", passwordInputComponent)