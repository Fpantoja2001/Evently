const template = document.createElement("template")

template.innerHTML = 
`
    <link rel="stylesheet" href="../messages/messages.css">

    <div class="messages-component">
        <div class="messages-list">
            messages List
        </div>
    </div>
`

class Messages extends HTMLElement {
    constructor(){
        super();
        const shadow =  this.attachShadow({mode:"open"})
        shadow.append(template.content.cloneNode(true))
    }

    connectedCallback(){
        console.log("Hello")
    }
}

customElements.define("messages-component", Messages)