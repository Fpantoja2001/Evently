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
        this.signUpRoute = shadow.querySelector(".signUpRoute")
        this.page = document.querySelector(".login-container");
        this.loginContainer = null;
        this.loginComponent = null;
    }

    connectedCallback() {
        this.loginContainer = document.querySelector(".login-container")
        this.loginComponent = document.querySelector('email-input-component')

        // Validates Input
        this.continueBtn.addEventListener("click", async (e) => {
            e.preventDefault()
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
                    const passwordInputComponent=document.createElement('password-input-component');
                    passwordInputComponent.classList.add("sign-up-component");
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
            const signUpComponent = document.createElement("create-account-component");
            signUpComponent.classList.add(".sign-up-component");
            this.loginComponent.remove()
            this.loginContainer.appendChild(signUpComponent);
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
        this.inputComponent = shadow.querySelector(".component-input");
        this.errorComponent=shadow.querySelector(".component-form-error");
        this.continueBtn = shadow.querySelector(".continueBtn");
        this.showPasswordBtn = shadow.querySelector(".showPasswordBtn")
        this.showPasswordHoverText = shadow.querySelector(".show-password-hover-text")
        this.showPasswordImg = shadow.querySelector(".show-password-img")
        this.component = null;
        this.email = null;
    }

    connectedCallback() {
        this.component = document.querySelector('password-input-component')
        const userEmail = this.component.getAttribute('data-email')
        this.continueBtn.addEventListener("click", async (e) => {
            e.preventDefault()
            const password=this.inputComponent.value.trim();
            if(!password){
                this.errorComponent.innerText="Password cannot be empty"
                return;
            }

            try{
                const body = {"email": userEmail.toLowerCase(), "password": password}

                const loginResponse = await fetch('http://localhost:3000/api/user/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                })

                const auth = await loginResponse.json()

                if(auth.isAuth){
                    // Saves Session Data
                    this.errorComponent.innerText="Login successful";
                    localStorage.setItem("auth", JSON.stringify(auth))
                    
                    // Redirects User to home
                    console.log("redirecting to home...");
                    window.location.href = 'http://localhost:3000';
                } else {
                    console.log("cannot validate password")
                }
                
            }catch(error){
                console.error("cant validate password",error);
                this.errorComponent.innerText="cant connect to server";
            }
        });

        // forgotPassRoute.addEventListener("click", () => {
        //     console.log("forgotPassRoute clicked")
        //     // to be implemented with backend
        // })

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