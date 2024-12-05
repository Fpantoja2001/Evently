import "../create-account/create.js";

const template = document.createElement("template");

template.innerHTML = `
    <link rel="stylesheet" href="../login/landing-page/landing.css">
    <div class="left-side-component">
        <div class="animation-component">animation tbd</div>
    </div>
    <div class="right-side-component">
        <div class="logo">logo</div>
        <div class="button-component-container">
            <div class="loginBtn">Login</div>
            <div class="createAccountBtn">Sign up</div>
        </div>
    </div>
`;

class landingPage extends HTMLElement {
    constructor (){
        super()
        const shadow = this.attachShadow({mode: "open"})
        shadow.append(template.content.cloneNode(true))
        this.loginBtn = shadow.querySelector(".loginBtn");
        this.page = document.querySelector(".login-container");
        this.component = document.querySelector(".landing-page-component");
        this.createAccountBtn = shadow.querySelector(".createAccountBtn");

    }

    connectedCallback() {
        console.log("landing page component connected");

        if (this.loginBtn) {
            this.loginBtn.addEventListener("click", () => {
                // initializing new component to pass in
                const newC = document.createElement("email-input-component");
                newC.classList.add("login-component");

                // removing current component
                this.component.remove();

                // adding new component
                this.page.appendChild(newC);
            });
        }

        if (this.createAccountBtn) {
            this.createAccountBtn.addEventListener("click", () => {
                const signUpComponent = document.createElement("create-account-component");
                signUpComponent.classList.add("sign-up-component");
                this.component.remove();
                this.page.appendChild(signUpComponent);
            });
        }
    }

    disconnectedCallback() {
        console.log("landing page component disconnected");
    }
}

customElements.define("landing-page", landingPage);