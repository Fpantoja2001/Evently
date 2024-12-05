import openDatabase from "../../../model/SQLiteConnection.js";
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

/* function setupIndexedDB(){
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
/*
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
    */



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

        this.db=await openDatabase("UserDatabase");
        await this.setupSQLite();
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

    async setupSQLite(){
        const query=`
            CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
            );`;
        await this.db.run(query)
    }

    async addUser(user){
        const query=`
        INSERT INTO users (username, email, password)
        VALUES (?, ?, ?);`;
        const { username, email, password } = user;
        await this.db.run(query, [username, email, password]); 
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
                await this.addUser(user);

                // Changing the inner html of shadow element to it's next one
                this.currentStep ++;
                shadowRoot.innerHTML = componentTemplates[this.currentStep];

                // Adding event listener to current next button in shadow element
                this.nextBtn = shadowRoot.querySelector(".continueBtn")
                this.nextBtn.addEventListener("click", () => this.nextStep())

                console.log("next")
            } catch (error){
                console.error("Failed to save user", error)
            }
        }
    }
    disconnectedCallback() {
        console.log("Create account component disconnected");
    }
}

customElements.define("create-account-component", createAccount);