const template = document.createElement("template");

// Ensure template has the correct HTML for rendering
template.innerHTML = `
  <link rel="stylesheet" href="../login/create-account/create.css">
  <div class="logo">logo</div>
  <slot class="component-title">Enter your personal info</slot>

  <div class="component-container">
    <input type="text" class="component-input-one" id="userNameInput" placeholder=" ">
    <label for="userNameInput" class="component-placeholder-one">Username</label>
    <span class="component-form-error-one"></span>

    <input type="email" class="component-input-two" id="emailInput" placeholder=" ">
    <label for="emailInput" class="component-placeholder-two">Email Address</label>
    <span class="component-form-error-two"></span>

    <input type="password" class="component-input-three" id="passwordInput" placeholder=" ">
    <label for="passwordInput" class="component-placeholder-three">Password</label>
    <span class="component-form-error-three"></span>

    <button class="continueBtn">Sign Up</button>
  </div>
`;
export class createAccount extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
        this.shadow.append(template.content.cloneNode(true));
        this.continueBtn = this.shadow.querySelector(".continueBtn");
        this.page = document.querySelector(".login-container");
        console.log("Shadow DOM initialized.");
    }

    async connectedCallback() {
        console.log("create account component connected");

        if (!this.continueBtn) {
            console.error("Button not found in the shadow DOM.");
        }

        this.continueBtn.addEventListener("click", async (e) => {
            e.preventDefault();
            await this.handleCreateAccount();
        });

        console.log("Event listener connected.");
    }

    async handleCreateAccount() {
        let isValid = true;

        const userNameInput = this.shadow.querySelector("#userNameInput");
        const emailInput = this.shadow.querySelector("#emailInput");
        const passwordInput = this.shadow.querySelector("#passwordInput");

        const formErrorOne = this.shadow.querySelector(".component-form-error-one");
        const formErrorTwo = this.shadow.querySelector(".component-form-error-two");
        const formErrorThree = this.shadow.querySelector(".component-form-error-three");

        //uesr
        if (userNameInput?.value.trim() === "") {
            formErrorOne.innerText = "Please enter a valid username.";
            userNameInput.classList.add("incorrectInput");
            isValid = false;
        } else {
            formErrorOne.innerText = "";
            userNameInput.classList.remove("incorrectInput");
        }
        //email
        if (!emailInput?.value.includes("@umass.edu")) {
            formErrorTwo.innerText = "Please enter a valid umass.edu email.";
            emailInput.classList.add("incorrectInput");
            isValid = false;
        } else {
            formErrorTwo.innerText = "";
            emailInput.classList.remove("incorrectInput");
        }
        //password
        if (passwordInput?.value.length < 6) {
            formErrorThree.innerText = "Password must be at least 6 characters.";
            passwordInput.classList.add("incorrectInput");
            isValid = false;
        } else {
            formErrorThree.innerText = "";
            passwordInput.classList.remove("incorrectInput");
        }

        console.log({
            name: userNameInput.value.trim(),
            email: emailInput.value.trim(),
            password: passwordInput.value.trim()
        })

        if (isValid) {
            console.log("Form passed validation. Attempting user creation...");
            const userData = {
                name: userNameInput.value.trim(),
                email: emailInput.value.trim(),
                password: passwordInput.value.trim()
            };

            try {
                const response = await fetch('http://localhost:3000/api/user/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData)
                });


                if (!response.ok) {
                    throw new Error('Error');
                } else {
                    console.log("response ok")
                }

                const result = await response.json();
                console.log('Server response:', result);

                if (result) {
                    // alert('Account created successfully!');
                    this.navigateToNextStep();
                } else {
                    console.error('Failed to create account: ' + (result.message || 'Unknown error'));
                }
            } catch (error) {
                console.error('Error during account creation:', error);
                
            }
        } else {
            console.log("Form validation failed.");
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