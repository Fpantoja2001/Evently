const template = document.createElement("template");

const componentTemplates = [
    `
        <link rel="stylesheet" href="login.css">
        <slot class="component-title"></slot>

        <div class="component-container">
            <input type="email" class="component-input" placeholder=" " required>
            <label for="email" class="component-placeholder">Email Address</label>
        </div>
    `,
    `
        <link rel="stylesheet" href="login.css">
        <slot class="component-title"></slot>

        <div class="component-container">
            <input type="email" class="component-input" placeholder=" ">
            <label for="email" class="component-placeholder">Password</label>
        </div>
    `
]

template.innerHTML = componentTemplates[0]


class Login extends HTMLElement {
    // Initializing Component
    constructor() {
        super();
        const shadow = this.attachShadow({mode: "open"})
        shadow.append(template.content.cloneNode(true))
    }
}

// Handling continue button clicks
const continueBtn = document.querySelector(".continueBtn")
continueBtn.addEventListener("click", handleClick) 


function handleClick(e){
    // curr Component correlates to whatever text is in it.
    const currComponent = document.querySelector(".login-component");

    // list of all Components names
    const components = ["Welcome Back", "Enter your password"]

    // finds what current Component is displaying
    if (components.includes(currComponent.innerHTML)){

        // sets next Component based on the one previously shown, (simulating sequential progress)
        if(components.indexOf(currComponent.innerHTML) == components.length -1 ){
            console.log("successful login")
        } else {
            // Preparing component for template change
            const loginComponent = document.querySelector(".login-component");
            const shadowRoot = loginComponent.shadowRoot;

            //  sets the innerHtml text to the following component in sequence
            currComponent.innerHTML = components[components.indexOf(currComponent.innerHTML) + 1];
            shadowRoot.innerHTML = componentTemplates[components.indexOf(currComponent.innerHTML)];
        }
    }
}

customElements.define("login-component", Login)