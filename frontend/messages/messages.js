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
            <div class="message-text-preview-container">
                <div class="message-preview"></div>
                <div class="message-preview-time-elapsed"></div>
            </div>
        </div>
        <div class="message-preview-status"></div>
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

        // Load Messengers details
        for(let i = 0; i< arr.length; i++){
            // Finding who the receiver is dynamically 
            const receiver = arr[i].members.filter(id => id != currentUserId)

            // Making and mounting new component
            const messenger = document.createElement('messenger-component');
            messenger.classList.add("message");
            messenger.messengerData = {senderData: await this.loadUserData(receiver[0]), conversationData: arr[i]}
            this.messageList.appendChild(messenger);
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
        this.messengerLatestStatus = shadow.querySelector(".message-preview-status")
        this.messengerElapsed = shadow.querySelector(".message-preview-time-elapsed")

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

        this.socket = window.socket;
        this.currentUser = JSON.parse(localStorage.getItem("auth")).userId
    }

    connectedCallback() {
        this.socket.on("loadNewInboxes", async (data) => {
            // Get conversation
            const response = await fetch(`/api/conversations/c/${data.conversationId}`, {method: 'GET'})
            const members = (await response.json()).members

            if (members.includes(this.currentUser)){
                this.loadMessengerData(this._data.senderData)
            }

            setInterval(async () => {
                if (members.includes(this.currentUser)){
                    this.loadMessengerData(this._data.senderData)
                }
            }, 60000)
        })
    }

    async loadMessengerData(userData){
        this.messengerProfileImg.src = userData.pfpImage === null ? '../profile/defaultpfp.jpg' : `data:image/jpeg;base64,${userData.pfpImage}`; 
        this.messengerName.textContent = userData.name;
        // Get latest data
        this.messengerLatest.textContent = (await this.getLatestMessage()).text;
        this.messengerElapsed.textContent = `• ${(await this.getLatestMessage()).time}`;
    }

    async getLatestMessage(){
        // Get Current User
        const currentUser = JSON.parse(localStorage.getItem("auth")).userId

        // Get latest message in conversation 
        const response = await fetch(`/api/message/${this._data.conversationData.conversationId}`)

        // Take latest message
        const messages = await response.json()
        const lastMessage = messages[messages.length - 1];

        // can eventually add a unread messages counter by traversing messages
        // backwards and checking status field

        const createdTime = new Date(lastMessage.createdAt).getTime()
        const elapsedTime = Date.now() - createdTime;

        // check the seen field then edit the box to show it
        if (lastMessage.status != "seen") {
            this.messengerLatestStatus.textContent = "•"
        } else {
            this.messengerLatestStatus.textContent = " "
        }

        if (elapsedTime / 1000 < 60) {
            // Less than a minute
            return { text: lastMessage.textMessage, time: '1m' };
        } else if (elapsedTime / (1000 * 60) < 60) {
            // Less than an hour
            return { text: lastMessage.textMessage, time: `${Math.floor(elapsedTime / (1000 * 60))}m` };
        } else if (elapsedTime / (1000 * 60 * 60) < 24) {
            // Less than 24 hours
            return { text: lastMessage.textMessage, time: `${Math.floor(elapsedTime / (1000 * 60 * 60))}h` };
        } else {
            // More than 24 hours
            return { text: lastMessage.textMessage, time: `${Math.floor(elapsedTime / (1000 * 60 * 60 * 24))}d` };
        } 
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
        this.messengerExpandedInput = shadow.querySelector(".message-expanded-input");
    }

    connectedCallback(){
        // Get window socket
        this.socket = window.socket;
        this.room = null;

        // Connect to conversation room
        this.socket.on("joinedRoom", (room) => {
            console.log(`connected you to room: ${room}`)
            this.room = room;
        })

        // Reload Messages
        this.socket.on("loadNewMessages", async (data) => {
            // Load Current User
            const currentUser = JSON.parse(localStorage.getItem("auth")).userId

            // Fetch the message sent
            if (data.conversationId === this._data.conversationData.conversationId) {
                const message = await fetch(`/api/message/m/${data.messageId}`);
                const newText = document.createElement("text-message-component");
                const newTextContent = await message.json()

                if (currentUser != newTextContent.senderId) {
                    newText.textMessageData = {
                        pfpImg: null,
                        text: newTextContent.textMessage,
                        user: false
                    }
                } else {
                    newText.textMessageData = {
                        pfpImg: null,
                        text: newTextContent.textMessage,
                        user: true,
                    }
                }
                this.messengerExpandedView.appendChild(newText)
                this.messengerExpandedView.scrollTo({
                    top: this.messengerExpandedView.scrollHeight,
                    behavior: 'smooth',
                });

                if (newTextContent.status != "seen") {
                    const response = await fetch(`/api/message/u/${data.messageId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({status: "seen"})
                    });

                    if (!response.ok) {
                        console.log("error updating delivered status")
                    }
                }
            }
        })

        // Create new room for conversation
        this.socket.emit("conversationRoom", this._data.conversationData.conversationId);
        // Load messages
        this.loadMessages()
        // Submit message
        this.messengerExpandedInput.addEventListener("keydown", async (event) => {
            if (event.key === "Enter") {
                try {
                    const response = await fetch(`/api/message`, {
                        method: "POST",
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            conversationId: this._data.conversationData.conversationId,
                            senderId: JSON.parse(localStorage.getItem("auth")).userId,
                            textMessage: this.messengerExpandedInput.value,
                            status: "delivered"
                        })
                    });

                    if (!response.ok) {console.log("error")} else {
                        this.messengerExpandedInput.value = " ";
                        this.socket.emit("newMessage", {conversationId: this._data.conversationData.conversationId, messageId: (await response.json()).messageId})
                    }
                } catch (error) {
                    console.log("error sending message", error);
                }
            }
        });

        // scroll to bottom on window resize
        window.addEventListener("resize", () => {
            this.messengerExpandedView.scrollTo({
                top: this.messengerExpandedView.scrollHeight,
                behavior: 'smooth',
            });
        })
    }

    loadMessengerData(userData){
        this.messengerExpandedProfileImg.src = userData.pfpImage === null ? '../profile/defaultpfp.jpg' : `data:image/jpeg;base64,${userData.pfpImage}`; 
        this.messengerExpandedName.textContent = userData.name;
    }

    async loadMessages() {
        const response = await fetch(`/api/message/${this._data.conversationData.conversationId}`);
        
        (await response.json()).forEach(async element => {
            if (element.textMessage != null) {
                const newText = document.createElement("text-message-component");
                const currentUser = JSON.parse(localStorage.getItem("auth")).userId;
                if (element.senderId != currentUser){  
                    newText.textMessageData = {
                        pfpImg: '../profile/defaultpfp.jpg',
                        text: element.textMessage,
                        user: false
                    }
                } else {
                    newText.textMessageData = {
                        pfpImg: null,
                        text: element.textMessage,
                        user: true
                    }
                } 

                if (element.status != "seen") {
                    const response = await fetch(`/api/message/u/${element.messageId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({status: "seen"})
                    })

                    if (!response.ok) {
                        console.log("error updating delivered status")
                    }

                    // send an update to socket
                }
                // If element has delivered status, change it to seen
                this.messengerExpandedView.appendChild(newText)
            } 
        });

        this.messengerExpandedView.scrollTop = this.messengerExpandedView.scrollHeight
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

        // Add styling on whether message is from current user or not
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