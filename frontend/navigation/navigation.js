// Import Components
const template = document.createElement("template")

const componentTemplate = [
    `
    <link rel="stylesheet" href="../navigation/navigation.css">
    
    <div class="navigation-bar">
        <div class="navigation-logo">
            Logo
        </div>
        <div class="navigation-home-tab>
            <a href="" id="a" location="home">Home</a>
        </div>
        <div class="navigation-notification-tab>
            <a href="" id="a" location="notification">Notification</a>
        </div>
        <div class="navigation-search-tab>
            <a href="" id="a" location="search">Search</a>
        </div>
        <div class="navigation-messages-tab">
            <a href="" id="a" location="messages">Messages</a>
        </div>
        <div class="navigation-create-event-tab">
            <a href="" id="a" location="create">Create Event</a>
        </div>
        <div class="navigation-profile-tab>
            <a href="" id="a" location="profile">Profile</a>
        </div>
    </div>
    `
]

class Navigation extends HTMLElement {
    constructor(){
        super();
        const shadow =  this.attachShadow({mode:"open"})
        template.innerHTML = componentTemplate[0]
        shadow.append(template.content.cloneNode(true))

        // Putting Elements into variables

        this.navBarElements = shadow.querySelectorAll("#a");
        this.component = document.querySelector(".component-container");
    }

    connectedCallback() {
        this.navBarElements.forEach((el) => {
            el.addEventListener("click", (e) => {
                e.preventDefault()
                const text = el.textContent.trim()
                let path = ""

                switch (text) {
                    case "Home":
                        path = el.getAttribute("location")
                        break;
        
                    case "Search":
                        path = el.getAttribute("location")
                        break;
        
                    case "Messages":
                        path = el.getAttribute("location")
                        break;
        
                    case "Create Event":
                        path = el.getAttribute("location")
                        break;
        
                    case "Profile":
                        path = el.getAttribute("location")
                        break;

                    case "Notification":
                        path = el.getAttribute("location")
                        break;
                    
                    case "Messages":
                        path = el.getAttribute("location")
                        break;

                    case "Search":
                        path = el.getAttribute("location")
                        break;

                    default:
                        console.log("Unknown link clicked:", text);
                        break;
                }

                window.history.pushState({}, "", path)
                this.navigate(path)
            })
        })
    }

    navigate(path){

        if(path === "profile"){
            // removing old element
            this.component.innerHTML = "";

            // creating new element
            const newComponent = document.createElement("profile-view");
            newComponent.classList.add("profile-component");
            this.component.appendChild(newComponent);
        }

        if(path === "create"){
            this.component.innerHTML = "";

            const newComponent = document.createElement("event-maker");
            newComponent.classList.add("eventComponent");
            this.component.appendChild(newComponent);
        }

        if(path === "home"){
            // removing old element
            this.component.innerHTML = "";

            // creating new element
            const newComponent = document.createElement("event-list-component");
            newComponent.classList.add("event-list-component");
            newComponent.setAttribute("location", "home")
            this.component.appendChild(newComponent);
        }

        if(path === "notification"){
            this.component.innerHTML = "";

            const newComponent = document.createElement("notification-component");
            // newComponent.classList.add("eventComponent");
            this.component.appendChild(newComponent);
        }

        if(path === "messages"){
            this.component.innerHTML = "";

            const newComponent = document.createElement("messages-component");
            // newComponent.classList.add("eventComponent");
            this.component.appendChild(newComponent);
        }

        if(path === "search"){
            this.component.innerHTML = "";

            const newComponent = document.createElement("search-component");
            // newComponent.classList.add("eventComponent");
            this.component.appendChild(newComponent);
        }
    }
}

customElements.define("navigation-bar", Navigation)