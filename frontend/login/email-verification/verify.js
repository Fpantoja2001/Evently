const template = document.createElement("template");

template.innerHTML =  `
    <link rel="stylesheet" href="../login/email-verification/verify.css">
    <div class="logo">logo</div>
    <slot class="component-title">Confirm your Email</slot>
    <div class="component-container">
    <div class="verification-input-wrapper">
        <input type="text" class="component-input-one" id="verificationCodeInput" placeholder=" ">
        <label for="verificationCode" class="component-placeholder-one">Code</label>
        <span class="codeExpirationBox" id="expirationClock"> </span>
    </div>

    <div class="component-form-error" hidden="true"></div>

    <button class="continueBtn" id="submitCodeBtn">Verify Code</button>
    <span class="requestNewCodeT">Didn't receive a code?<span class="newCodeBtn" id="newCodeBtn">Request a new one.</span></span>
    </div>
    `;

class VerificationPage extends HTMLElement {
    constructor (){
        super()
        this.shadow = this.attachShadow({mode: "open"})
        this.page = document.querySelector(".login-container")
        this.shadow.append(template.content.cloneNode(true))
        
        // Initialize Refs to Null
        this.verificationInput = null;
        this.requestCodeBtn = null;
        this.submitCodeBtn = null;
        this.expirationClock = null;
        this.formError = null;
        this.timerId = null;
    }

    connectedCallback() {
        this.setupDOMReferences();
        this.attachListeners();
        this.requestCode();
    }

    setupDOMReferences() {
        this.verificationInput = this.shadow.getElementById("verificationCodeInput")
        this.requestCodeBtn = this.shadow.getElementById("newCodeBtn")
        this.submitCodeBtn = this.shadow.getElementById("submitCodeBtn")
        this.expirationClock = this.shadow.getElementById("expirationClock")
        this.formError = this.shadow.querySelector(".component-form-error");
        this.timerId = null;
    }

    attachListeners() {
        if (this.submitCodeBtn) {
            this.submitCodeBtn.addEventListener("click", () => this.verifyCode())
        }

        if (this.requestCodeBtn) {
            this.requestCodeBtn.addEventListener("click", () => this.requestCode())
        }
    }

    async requestCode () {
        const user = JSON.parse(localStorage.getItem("auth"))

        try {
            const response = await fetch('http://localhost:3000/api/verification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({requester: user.userId})
            });

            if (response.ok) {
                const verificationCode = await response.json()

                const userFetch = await fetch(`http://localhost:3000/api/user/${user.userId}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                const userData = await userFetch.json()

                const sendEmail = () => {
                    emailjs.send(
                        'service_bdc7lbn',
                        'template_sq6rrqc',
                        {
                            name: userData.name,
                            message: verificationCode.verificationCode,
                            email: "pantojafelix8@gmail.com"
                        }
                    )
                }
                sendEmail()
                this.startExpirationClock()
            }
            
        } catch (error) {
            console.error('Error during verification code request:', error);  
        }
    }

    async verifyCode () {
        try {
            const codeToCheck = this.verificationInput.value.trim()
            const user = JSON.parse(localStorage.getItem("auth"))

            const response = await fetch(`http://localhost:3000/api/verification/${user.userId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                const realCode = await response.json();
                
                if (codeToCheck == realCode.verificationCode){
                    clearInterval(this.timerId);
                    // Updating account to reflect it is verified
                    const response = await fetch(`/api/user/${user.userId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({emailVerified: true}),
                    }); 

                    if (response.ok){
                        console.log("Email Successfully Verified")

                        // take user to login if not logged in already
                        if (user.isAuth) {
                            console.log("redirecting to home...");
                            window.location.href = 'http://localhost:3000';
                        } else {
                            this.navigateToNextStep()  
                        }
                    } else {
                        console.log("Error in updating account verification")
                    }

                } else {
                    const errorMessage = document.createElement("div");
                    errorMessage.innerText = "Incorrect Code";
                    this.formError.classList.add("visible");
                    this.formError.appendChild(errorMessage);
                }
            } else {
                // some error handling
            }
        } catch (error){
            console.error('Error during verification code verification:', error);  
        }
    }

    async startExpirationClock () {
        let remainingTime = 60;
        const user = JSON.parse(localStorage.getItem("auth"))
        this.expirationClock.innerText = `code expires in: ${remainingTime}s`

        this.timerId = setInterval( async () => {
            remainingTime --; 
            this.expirationClock.innerText = `code expires in: ${remainingTime}s`

            if(remainingTime <= 0) {
                clearInterval(this.timerId)
                this.expirationClock.innerText = `code expired.`

                console.log()

                try {
                    const response = await fetch(`http://localhost:3000/api/verification/delete/${user.userId}`, {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                    });

                    if(!response.ok) {
                        console.log("Error during verification code deletion")
                    }
                } catch (error) {
                    console.error('Error during verification code request:', error); 
                }
            }
        }, 1000)
    }

    navigateToNextStep() {
        const component = document.querySelector('verification-component')

        // initializing new component to pass in
        const newC = document.createElement("email-input-component");
        newC.classList.add("login-component");

        // removing current component
        component.remove();

        // adding new component
        this.page.appendChild(newC); 
    }

    disconnectedCallback() {
        // Clear all events
        if (this.submitCodeBtn) {
            this.submitCodeBtn.removeEventListener("click", this.verifyCode)
        }

        if (this.requestCodeBtn) {
            this.requestCodeBtn.removeEventListener("click", this.requestCode)
        }
    }
}

customElements.define("verification-component", VerificationPage);