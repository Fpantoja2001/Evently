const template = document.createElement("template")

template.innerHTML =
`
    <link rel="stylesheet" href="../../../../team/pages/login/create-account/create.css">

`

export class createAccount extends HTMLElement {
    constructor(){
        super()
        const shadow = this.attachShadow({mode: "open"})
        shadow.append(template.content.cloneNode(true))
    }

    connectedCallback(){
        console.log("Create account component connected")
    }

    disconnectedCallback(){
        console.log("Create account component disconnected")
    }
}

customElements.define("create-account-component", createAccount);