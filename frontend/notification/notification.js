const template = document.createElement("template")

template.innerHTML = 
`
    <link rel="stylesheet" href="../notification/notification.css">

    <div class="notification-component">
        <div class="notification-list">
            Notification List
            <button class="send"></div>
        </div>
    </div>
`

class Notification extends HTMLElement {
    constructor(){
        super();
        const shadow =  this.attachShadow({mode:"open"})
        shadow.append(template.content.cloneNode(true))

        this.sendNotif = shadow.querySelector(".send")
    }

    connectedCallback(){
        console.log(this.sendNotif)
    }
}

customElements.define("notification-component", Notification)