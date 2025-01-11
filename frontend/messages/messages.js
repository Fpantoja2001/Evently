const template = document.createElement("template")

const componentTemplates = [
    `
    <link rel="stylesheet" href="../messages/messages.css">

    <div class="messages-component">
        
        <div class="messages-list">
            <div class="messages-list-user-options">
                <div class="messages-list-user"></div>
                <div class="messages-list-search">
                    <button class="messages-list-search-btn">Search</button>
                </div>
            </div>
            <div class="messages-list-title">Messages</div>
        </div>
        <div class="message-view-component"></div>
    </div>
    `,
    `
    <link rel="stylesheet" href="../messages/messages.css">

    <div class="message">
        <div class="messenger-profile-img-container">
            <img class="messenger-profile-img" src=""></img>
        </div>
        <div class="messenger-preview-container">
            <div class="messenger-name"></div>
            <div class="message-preview"></div>
        </div>
    </div>
    `,
    `
    <link rel="stylesheet" href="../messages/messages.css">

    <div class="messages-expanded">
        <div class="messenger-expanded-info">
            <img class="messenger-expanded-profile-img"></img>
            <div class="messenger-expanded-name"></div>
        </div>
        <div class="messages-expanded-view"></div>
        <div class="messages-expanded-send">
            <input class="message-expanded-input" placeholder="Message..."></input>
        </div>
    </div>
    ` ,
    `
    <link rel="stylesheet" href="../messages/messages.css">

    <div class="text-message">
        <img class="text-message-sender-profile-img"></img>
        <div class="text-message-content"></div>
    </div>
    `
];

class Messages extends HTMLElement {
    constructor(){
        super();
        const shadow =  this.attachShadow({mode:"open"});
        template.innerHTML = componentTemplates[0];
        shadow.append(template.content.cloneNode(true));

        // Variables
        this.messageList = shadow.querySelector(".messages-list");
        this.messageListUser = shadow.querySelector(".messages-list-user");
        this.messageListSearchBtn = shadow.querySelector(".messages-list-search-btn");

        // Adding Event Handlers
        this.messageListSearchBtn.addEventListener("click", () => {
            console.log("Hello search was clicked")
        })
    }

    async connectedCallback(){
        this.loadMessageInbox()
    }

    async loadMessageInbox(){
        // Load current users details
        const currentUserId = JSON.parse(localStorage.getItem("auth")).userId
        const currentUserData = await this.loadUserData(currentUserId)
        this.messageListUser.textContent = currentUserData.username

        // Load current users conversations

        const getConversations = async () => {
            try {
                const response  = await fetch(`/api/conversations/${currentUserId}`);
                return await response.json();
            } catch (error) {
                console.error('Failed to fetch user conversations:', error);
            }
        }

        const arr = await getConversations()

        // If there are no messages condition handling
        if (arr.length === 0) {
            return;
        }

        // Set up their info 

        // Load Messengers details
        for(let i = 0; i< arr.length-1; i++){
            const messenger = document.createElement('messenger-component');
            messenger.classList.add("message");
            messenger.messengerData = {senderData: await this.loadUserData(arr[i].members[1]), conversationData: arr[i]}
            this.messageList.appendChild(messenger)
        }

    }

    async loadUserData(userId){
        try {
            const response = await fetch(`/api/user/${userId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json()
        } catch (error) {
            console.error('Failed to fetch user data:', error);
        }
    }
}

class Messenger extends HTMLElement {
    constructor(){
        super();
        const shadow =  this.attachShadow({mode:"open"})
        template.innerHTML = componentTemplates[1];
        shadow.append(template.content.cloneNode(true))
        

        // Variables
        this.messengerProfileImg = shadow.querySelector(".messenger-profile-img")
        this.messengerName = shadow.querySelector(".messenger-name")
        this.messengerLatest = shadow.querySelector(".message-preview")

        this.addEventListener("click", () => {
            // Creating Expanded Element
            const expandedMessages = document.createElement("messages-expanded-component")
            expandedMessages.expandedMessengerData = this._data;
            expandedMessages.classList.add("messages-expanded")

            // Finding div to append element to
            const messageComponentContainer = document.querySelector(".messages-component").shadowRoot
            const expandedMessagesContainer = messageComponentContainer.querySelector('.message-view-component')

            // Clearing div and appending new element
            expandedMessagesContainer.innerHTML = ""
            expandedMessagesContainer.appendChild(expandedMessages)
        })
    }

    loadMessengerData(userData){
        this.messengerProfileImg.src = userData.pfpImage === null ? '../profile/defaultpfp.jpg' : `data:image/jpeg;base64,${userData.pfpImage}`; 
        this.messengerName.textContent = userData.name;
        this.messengerLatest.textContent = `I guess it depends on the person tbh yes hello`
    }

    /**
     * @param {any} data
     */
    set messengerData(data){
        this._data = data
        this.loadMessengerData(data.senderData)
    }
}

class MessagesExpanded extends HTMLElement {
    constructor(){
        super();
        const shadow =  this.attachShadow({mode:"open"})
        template.innerHTML = componentTemplates[2];
        shadow.append(template.content.cloneNode(true))

        this.messengerExpandedProfileImg = shadow.querySelector(".messenger-expanded-profile-img");
        this.messengerExpandedName = shadow.querySelector(".messenger-expanded-name");
        this.messengerExpandedView = shadow.querySelector(".messages-expanded-view");
    }

    connectedCallback(){
        this.loadMessages()
    }

    loadMessengerData(userData){
        this.messengerExpandedProfileImg.src = userData.pfpImage === null ? '../profile/defaultpfp.jpg' : `data:image/jpeg;base64,${userData.pfpImage}`; 
        this.messengerExpandedName.textContent = userData.name;
    }

    async loadMessages() {
        const response = await fetch(`/api/message/${this._data.conversationData.conversationId}`);
        
        (await response.json()).forEach(async element => {
            const newText = document.createElement("text-message-component");
            const currentUser = JSON.parse(localStorage.getItem("auth")).userId;
            if (element.senderId != currentUser){  
                newText.textMessageData = {
                    pfpImg: '../profile/defaultpfp.jpg',
                    text: element.text,
                    user: false
                }
            } else {
                newText.textMessageData = {
                    pfpImg: null,
                    text: element.text,
                    user: true
                }
            }
            this.messengerExpandedView.appendChild(newText)
        });

    }

    /**
     * @param {any} data
     */
    set expandedMessengerData(data){
        this._data = data
        this.loadMessengerData(this._data.senderData)
    }
}

class textMessage extends HTMLElement{
    constructor(){
        super();
        const shadow =  this.attachShadow({mode:"open"})
        template.innerHTML = componentTemplates[3];
        shadow.append(template.content.cloneNode(true));

        this.textMessage = shadow.querySelector(".text-message");
        this.textMessageSenderImg = shadow.querySelector(".text-message-sender-profile-img");
        this.textMessageContent = shadow.querySelector(".text-message-content");
    }

    setTextData(data){
        this.textMessageSenderImg.src = '../profile/defaultpfp.jpg'// gotta get sender pfp image
        this.textMessageContent.textContent = data.text;

        data.user ?  this.textMessage.classList.add("user"): this.textMessage.classList.add("sender");
    }

    /**
     * @param {any} data
     */
    set textMessageData(data){
        this._data = data;
        this.setTextData(this._data);
    }
}


customElements.define("messages-component", Messages)
customElements.define("messenger-component", Messenger)
customElements.define("messages-expanded-component", MessagesExpanded)
customElements.define("text-message-component", textMessage)