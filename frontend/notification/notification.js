const template = document.createElement("template")

template.innerHTML = 
`
    <link rel="stylesheet" href="../notification/notification.css">

    <div class="notification-component">
        <div class="notification-list">
            Notification List
        </div>
    </div>
`

class Notification extends HTMLElement {
    constructor(){
        super();
        const shadow =  this.attachShadow({mode:"open"})
        shadow.append(template.content.cloneNode(true))
    }

    connectedCallback(){
        console.log("Hello")
    }
}

customElements.define("notification-component", Notification)