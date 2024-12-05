import UserModel from './user-model.js';
const template = document.createElement("template")

const componentTemplates = [
    `
        <link rel="stylesheet" href="../../../../frontend/login/create-account/create.css">
        <div class="logo">logo</div>
        <slot class="component-title">Enter your personal info</slot>

        <div class="component-container">
            <input type="text" class="component-input-one" id="firstNameInput" placeholder=" ">
            <label for="firstName" class="component-placeholder-one">First Name</label>
            <span class="component-form-error-one"></span>

            <input type="text" class="component-input-two" id="lastNameInput" placeholder=" ">
            <label for="lastName" class="component-placeholder-two">Last Name</label>
            <span class="component-form-error-two"></span>

            <input type="text" class="component-input-three" id="birthdayInput" placeholder=" ">
            <label for="lastName" class="component-placeholder-three">Birthday (MMDDYYYY)</label>
            <span class="component-form-error-three"></span>

            <button class="continueBtn">Continue</button>
            <span class="signInT ext">Already have an account?<span class="signInRoute"> Sign in </span></span>
        <div>
    `,
    `
        <link rel="stylesheet" href="../../../../frontend/login/create-account/create.css">
        <div class="logo">logo</div>
        <slot class="component-title">Enter account details</slot>

        <div class="component-container">
            <input type="text" class="component-input-one" id="userNameInput" placeholder=" ">
            <label for="username" class="component-placeholder-one">Username</label>
            <span class="component-form-error-one"></span>

            <input type="email" class="component-input-two" id="emailInput" placeholder=" ">
            <label for="email" class="component-placeholder-two">Email Address</label>
            <span class="component-form-error-two"></span>

            <input type="password" class="component-input-three" id="passwordInput" placeholder=" ">
            <label for="password" class="component-placeholder-three">Password</label>
            <span class="component-form-error-three"></span>

            <button class="continueBtn">Continue</button>
            <span class="signInT ext">Already have an account?<span class="signInRoute"> Sign in </span></span>
        </div>
    `,
    `
        <link rel="stylesheet" href="../../../../frontend/login/create-account/create.css">
        <div class="logo">logo</div>
        <slot class="component-title">Account created</slot>

        <div class="component-container">
            <div class="account-created-message">Your account has been successfully created!</div>
            <button class="continueBtn">Go to Login</button>
        </div>
    `
];

template.innerHTML = componentTemplates[0];
/*
function setupIndexedDB(){
    return new Promise((resolve,reject) => {
    const request =indexedDB.open("UserDatabase",1) ;
    request.onupgradeneeded=function(event){ //handles first
        const db=event.target.result;
        if(!db.objectStoreNames.contains("users")){
            db.createObjectStore("users",{ keyPath: "id", autoIncrement:true});
        }
    };
    request.onsuccess=function(event){
        resolve(event.target.result);
    };
    request.onerror=function(){
        reject("Cant open indexedDB")
    };
    }) ;
}
*/

function addUserDB(db,user){
    return new Promise((resolve,reject) => {
        const transaction=db.transaction("users","readwrite");
        const store =transaction.objectStore("users");
        const request= store.add(user);
        request.onsuccess=function(){
            resolve();
        };
        request.onerror =function(){
            reject("cant add user");
        };
    });
}

export class createAccount extends HTMLElement {
    constructor(){
        super()
        const shadow = this.attachShadow({mode: "open"})
        shadow.append(template.content.cloneNode(true))
        this.page = document.querySelector(".login-container");
        this.currentStep = 0;
        this.continueBtn = shadow.querySelector(".continueBtn");
        this.db=null;
    }

    async connectedCallback() {
        console.log("create account component connected")
        await UserModel.createTable();
        //this.db=await setupIndexedDB();
        this.continueBtn.addEventListener("click", (e) => {
            e.preventDefault();

            // Will handle form validation before switching pages
            this.nextStep()
        });

        const currentComponent = document.querySelector(".sign-up-component")
        const shadowRoot = currentComponent.shadowRoot;

        this.signInRoute = shadowRoot.querySelector(".signInRoute")
        this.signInRoute.addEventListener("click", (e) => {
            e.preventDefault();

            const newC = document.createElement("email-input-component");
            newC.classList.add("login-component");
        
            this.component = document.querySelector(".sign-up-component")
            this.component.remove()

            this.page.appendChild(newC);
        }) 

        console.log("Create account component connected")
    }

    nextStep() {
        // Selecting Shadow element to change its inner html
        const currentComponent = document.querySelector(".sign-up-component")
        const shadowRoot = currentComponent.shadowRoot;

        // Checking possible form errors + creating value portability

        if (this.currentStep == 0){
            // /^[a-zA-Z-'. ]+$/ reg ex allows names with Hyphens, periods and apostrophes ex Dr. O'brian Mc-Conell 

            // Selecting first name input + label
            this.firstNameInput = shadowRoot.getElementById("firstNameInput");
            this.firstNameLabel = shadowRoot.querySelector(".component-placeholder-one");

            // Selecting last name input + label 
            this.lastNameInput = shadowRoot.getElementById("lastNameInput");
            this.lastNameLabel = shadowRoot.querySelector(".component-placeholder-two");

            // Selecting Birthday Input Value + label
            this.birthDayInput = shadowRoot.getElementById("birthdayInput");
            this.birthDayLabel = shadowRoot.querySelector(".component-placeholder-three");

            if (!/^[a-zA-Z-'. ]+$/.test(this.firstNameInput.value) || this.firstNameInput.value.length < 1){
                this.formErrorOne = shadowRoot.querySelector(".component-form-error-one");
                this.formErrorOne.innerText = `Please enter a valid first name`;
                this.firstNameInput.classList.add(".incorrectInput")
                this.firstNameInput.style.borderColor = "red";
                this.firstNameLabel.style.color = "red";
                this.firstNameLabel.style.transition = "top 0.3s ease, left 0.3s ease, font-size 0.3s ease, padding 0.3s ease";
            } else if (!/^[a-zA-Z-'. ]+$/.test(this.lastNameInput.value) || this.lastNameInput.value.length < 1) { 
                this.formErrorTwo= shadowRoot.querySelector(".component-form-error-two");
                this.formErrorTwo.innerText = `Please enter a valid last name`;
                this.lastNameInput.classList.add(".incorrectInput")
                this.lastNameInput.style.borderColor = "red";
                this.lastNameLabel.style.color = "red";
                this.lastNameLabel.style.transition = "top 0.3s ease, left 0.3s ease, font-size 0.3s ease, padding 0.3s ease";
            } else if (!/^[0-9]*$/.test(this.birthDayInput.value) || this.birthDayInput.value.length != 8){
                this.formErrorTwo= shadowRoot.querySelector(".component-form-error-three");
                this.formErrorTwo.innerText = `Please enter a valid Birthday`;
                this.birthDayInput.classList.add(".incorrectInput")
                this.birthDayInput.style.borderColor = "red";
                this.birthDayLabel.style.color = "red";
                this.birthDayLabel.style.transition = "top 0.3s ease, left 0.3s ease, font-size 0.3s ease, padding 0.3s ease";
            } else {
                // Calculate Age
                const birthdayMonth = Number(this.birthDayInput.value.slice(0,2));
                const birthdayDay = Number(this.birthDayInput.value.slice(2,4));
                const birthdayYear = Number(this.birthDayInput.value.slice(4,8));

                const currentMonth = new Date().getUTCMonth() + 1
                const currentDay = new Date().getUTCDate()
                const currentYear = new Date().getUTCFullYear()

                let userAge = 0;

                if (birthdayMonth <= currentMonth && birthdayDay <= currentDay){
                    userAge = (currentYear - birthdayYear) + 1
                } else {
                    userAge = (currentYear - birthdayYear)
                }

                console.log(`valid inputs, this users data is:\nfirstName: ${this.firstNameInput.value}\nlastName: ${this.lastNameInput.value}\nAge: ${userAge}\nBirthday: ${this.birthDayInput.value}`)

                // Changing the inner html of shadow element to it's next one
                this.currentStep ++;
                shadowRoot.innerHTML = componentTemplates[this.currentStep];

                // Adding event listener to current next button in shadow element
                this.nextBtn = shadowRoot.querySelector(".continueBtn")
                this.nextBtn.addEventListener("click", () => this.nextStep())

                this.signInRoute = shadowRoot.querySelector(".signInRoute")
                this.signInRoute.addEventListener("click", (e) => {
                    e.preventDefault();
        
                    const newC = document.createElement("email-input-component");
                    newC.classList.add("login-component");
                
                    this.component = document.querySelector(".sign-up-component")
                    this.component.remove()
        
                    this.page.appendChild(newC);
                })  

                console.log("next")
            }
        } else if (this.currentStep == 1) {
            this.handleCreateAccount()
        } else if (this.currentStep == 2) {
            // initializing new component to pass in
            const newC = document.createElement("email-input-component");
            newC.classList.add("login-component");

            // removing current component
            this.component = document.querySelector(".sign-up-component")
            this.component.remove()

            // adding new component
            this.page.appendChild(newC);
        }
    }

    disconnectedCallback(){
        console.log("Create account component disconnected")
    }

    async handleCreateAccount(){
        let isValid=true;

        // Because inner html changes, you have to always fetch most current shadowRoot

        const currentComponent = document.querySelector(".sign-up-component")
        const shadowRoot = currentComponent.shadowRoot;

        this.userNameInput = shadowRoot.getElementById("userNameInput");
        this.emailInput = shadowRoot.getElementById("emailInput");
        this.passwordInput = shadowRoot.getElementById("passwordInput");

        this.userNameLabel = shadowRoot.querySelector(".component-placeholder-one");
        this.emailLabel = shadowRoot.querySelector(".component-placeholder-two");
        this.passwordLabel = shadowRoot.querySelector(".component-placeholder-three");

        this.formErrorOne = shadowRoot.querySelector(".component-form-error-one");
        this.formErrorTwo = shadowRoot.querySelector(".component-form-error-two");
        this.formErrorThree = shadowRoot.querySelector(".component-form-error-three");

        //user
        if (this.userNameInput.value.trim() === "") {
            this.formErrorOne.innerText = `Please enter a valid user`;
            this.userNameInput.classList.add("incorrectInput");
            this.userNameInput.style.borderColor = "red";
            this.userNameLabel.style.color = "red";
            this.userNameLabel.style.transition = "top 0.3s ease, left 0.3s ease, font-size 0.3s ease, padding 0.3s ease";
            isValid = false;
        } else {
            this.formErrorOne.innerText = "";
            this.userNameInput.classList.remove("incorrectInput");
        }
        //email
        const emailInput = this.emailInput.value.trim().split("@");

        if (emailInput.length === 1 || emailInput[1] !== "umass.edu") {
            this.formErrorTwo.innerText = `Please enter a valid umass.edu email`;
            this.emailInput.classList.add("incorrectInput");
            this.emailInput.style.borderColor = "red";
            this.emailLabel.style.color = "red";
            this.emailLabel.style.transition = "top 0.3s ease, left 0.3s ease, font-size 0.3s ease, padding 0.3s ease";
            isValid = false;
        } else {
            this.formErrorTwo.innerText = "";
            this.emailInput.classList.remove("incorrectInput");
        }
        //password
        if (this.passwordInput.value.trim().length < 6) {
            this.formErrorThree.innerText = "Password must be at least 6 characters long";
            this.passwordInput.classList.add("incorrectInput");
            this.passwordInput.style.borderColor = "red";
            this.passwordLabel.style.color = "red";
            this.passwordLabel.style.transition = "top 0.3s ease, left 0.3s ease, font-size 0.3s ease, padding 0.3s ease";
            isValid = false;
        } else {
            this.formErrorThree.innerText = "";
            this.passwordInput.classList.remove("incorrectInput");
        }

        if (isValid) {
            const user={
                username:this.userNameInput.value.trim(),
                email: this.emailInput.value.trim(),
                password: this.passwordInput.value.trim(),
            };
            try{
                await UserModel.create(user);

                // Changing the inner html of shadow element to it's next one
                this.currentStep ++;
                shadowRoot.innerHTML = componentTemplates[this.currentStep];

                // Adding event listener to current next button in shadow element
                this.nextBtn = shadowRoot.querySelector(".continueBtn")
                this.nextBtn.addEventListener("click", () => this.nextStep())

                console.log("Account created successfully")
            } catch (error){
                console.error("Failed to save user", error)
            }
        }
    }
}

customElements.define("create-account-component", createAccount);