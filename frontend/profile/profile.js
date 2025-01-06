const template = document.createElement("template");

const componentTemplates = [
    `
        <link rel="stylesheet" href="../profile/main.css">

        <div class="component-wrapper">
            <div class="profile-details">
                <div class="profile-left">
                    <img class="profile-img"></img>
                </div>
                <div class="profile-right">
                    <div class="profile-line-1">
                        <div class="profile-username"></div>
                        <div class="profile-options">
                            <button class="profile-edit-btn">Edit Profile</button>
                            <button class="profile-signout-btn">Sign Out</button>
                            <button class="profile-settings-btn">Set</button>
                        </div>
                    </div>

                    <div class="profile-line-2">
                        <div class="profile-event-number">5 events</div>
                        <div class="profile-follower-number">100 followers</div>
                        <div class="profile-following-number">659 following</div>
                    </div>

                    <div class="profile-line-3">
                        <div class="profile-name"></div>
                        <div class="profile-pronouns"></div>
                    </div>

                    <div class="profile-line-4">
                        <textarea readonly class="profile-bio"></textarea>
                    </div>
                </div>
            </div>

            <div class="profile-content">
                <div class="profile-viewing-options">
                    <button class="profile-viewing-current-option">Current</button>
                    <button class="profile-viewing-archived-option">Archived</button>
                </div>
                <event-list-component location="profile" id="event-list-component"></event-list-component>
            </div>
        </div>
    `,
    `
    <link rel="stylesheet" href="main.css">

    <div class="edit-component-wrapper">
        <div class="edit-profile-title">Edit Profile</div>

        <div class="edit-profile-top-bar">

            <div class="edit-profile-img-container">
                <img class="edit-profile-img"></img>
            </div>

            <div class="edit-profile-names">
                <div class="edit-profile-username"></div>
                <div class="edit-profile-name"></div>
            </div>

            <div class="edit-profile-change-photo-btn">
                <button class="change-photo-btn"> Change Photo</button>
            </div>
        </div>

        <div class="edit-profile-names-bar">
            <div class="edit-profile-username-bar">
                <div class="edit-profile-username-title">Username</div>
                <input class="edit-profile-username-input" type="text"></input>
            </div>
            <div class="edit-profile-name-bar">
                <div class="edit-profile-name-title">Name</div>
                <input class="edit-profile-name-input" type="text"></input>
            </div>
        </div>

        <div class="edit-profile-identity-bar">
            <div class="edit-profile-gender-bar">
                <div class="edit-profile-gender-title">Gender</div>
                <select class="edit-profile-gender-select">
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="nonbinary">Non-binary</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
            </div>

            <div class="edit-profile-pronoun-bar">
                <div class="edit-profile-pronoun-title">Pronouns</div>
                <input class="edit-profile-pronoun-input" type="text"></input>
            </div>  
        </div>

        <div class="edit-profile-links-bar">
            <div class="edit-profile-links-title">Links</div>
            <input class="edit-profile-links-input" type="text"></input>
        </div>

        <div class="edit-profile-bio-bar">
            <div class="edit-profile-bio-title">Bio</div>
            <textarea class="edit-profile-bio-input" maxlength="150"></textarea>
            <span class="edit-profile-bio-char-count">0 / 150</span>
        </div>

        <div class="edit-profile-submit-bar">
            <button class="edit-profile-submit-btn">Submit</button>
        </div>

    </div>
    `
]

export class Profile extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({mode: "open"});
        template.innerHTML = componentTemplates[0];
        shadow.appendChild(template.content.cloneNode(true));

        // Profile fields
        this.profileDetails = shadow.querySelector('.profile-details');
        this.profileImg = shadow.querySelector(".profile-img");
        this.profileUsername = shadow.querySelector(".profile-username");
        this.profileOptions = shadow.querySelector(".profile-options");
        this.profileEventNumber = shadow.querySelector(".profile-event-number");
        this.profileFollowerNumber= shadow.querySelector(".profile-follower-number");
        this.profileFollowingNumber = shadow.querySelector(".profile-following-number");
        this.profileName = shadow.querySelector(".profile-name");
        this.profilePronouns = shadow.querySelector(".profile-pronouns")
        this.profileBio = shadow.querySelector(".profile-bio");

        // Adjusting bio size 

        this.profileBio.style.height = 'auto'
        this.profileBio.style.height = `calc(1.8rem + ${this.profileBio.scrollHeight}px)`
        this.profileBio.style.alignItems = `center`;

        // Profile Buttons

        this.profileEditBtn = shadow.querySelector(".profile-edit-btn");
        this.profileSignoutBtn = shadow.querySelector(".profile-signout-btn");
        this.profileSettingsBtn = shadow.querySelector(".profile-settings-btn");
        this.profileCurrentEventsOptionBtn = shadow.querySelector(".profile-viewing-current-option");
        this.profileArchivedEventsOptionBtn = shadow.querySelector(".profile-viewing-archived-option");

        // Button Event Listeners

        this.profileEditBtn.addEventListener("click", this.editProfile)
        this.profileSignoutBtn.addEventListener("click", this.signOut)
        this.profileSettingsBtn.addEventListener("click", this.changeSettings)
        this.profileCurrentEventsOptionBtn.addEventListener("click", () => this.currentViewOption())
        this.profileArchivedEventsOptionBtn.addEventListener("click", () => this.archivedViewOption())

        // Event Component 
        this.eventComponent = shadow.getElementById("event-list-component");
        
    }

    async connectedCallback() {
        // check if user is checking their own profile
        const auth = JSON.parse(localStorage.getItem('auth'))
        let token = auth.userId
        
        if (!token) {
            console.log('User token not found.');
            window.localStorage.href = '../login';
        }
        // somehow when ever someone clicks on an account 
        // thats not theirs, that accounts ID gets passed in so this code
        // can check that, TBA

        if (this._data && this._data.id != token) {
            console.log("I am not viewing my own profile")
            token = this._data.id;
        }
        
        // Retrieving the person currently logged in

        // Retrieving the data of the desired profile

        let userData = {};

        console.log(token)

        try {
            const response = await fetch(`/api/user/${token}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            userData = await response.json()
        } catch (error) {

            console.error('Failed to fetch user data:', error);
            // profileWrapper.textContent = 'Error loading profile. Please try again later.';
        }

        // Filling in Profile Details

        console.log(userData)

        this.profileUsername.textContent = userData.username;
        this.profileName.textContent = userData.name;
        this.profileBio.textContent = userData.bio === null ? "": userData.bio;
        this.profileImg.src = userData.pfpImage === null ? '../profile/defaultpfp.jpg' : `data:image/jpeg;base64,${userData.pfpImage}`; 
        this.profilePronouns.textContent = userData.pronouns === null ? null : userData.pronouns;
        this.profileEventNumber.textContent = `${userData.currentEvents.length} events`
    }   

    editProfile(){
        // Parent component in dom
        this.component = document.querySelector(".profile-component");
        this.componentParent = document.querySelector(".components")

        // Creating new component to mount
        const editProfileComponent = document.createElement("edit-profile-view");
        editProfileComponent.classList.add(".random-class");

        // Removing old and adding new component
        this.component.remove()
        this.componentParent.appendChild(editProfileComponent);
        console.log("edit profile button clicked");
    }

    changeSettings() {
        console.log("change settings button clicked")
    }

    async signOut(){
        console.log("Signout button clicked")
        const logoutResponse = await fetch('http://localhost:3000/api/user/logout')
        console.log(logoutResponse)
        localStorage.removeItem('auth');
        location.reload(); // Reload to reflect changes
        window.location.href = '../login/index.html';
    }

    currentViewOption(){
        console.log(this.eventComponent)
    }

    archivedViewOption(){
        console.log(this.eventComponent)
    }

    /**
     * @param {any} data
     */
    set viewerData(data) {
        this._data = data;
    }

    
}

class EditProfile extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({mode: "open"});
        template.innerHTML = componentTemplates[1];
        shadow.appendChild(template.content.cloneNode(true));

        // Profile Fields
        this.editProfileImg = shadow.querySelector(".edit-profile-img");
        this.editProfileUsername = shadow.querySelector(".edit-profile-username");
        this.editProfileName = shadow.querySelector(".edit-profile-name");
        this.editProfileUsernameInput = shadow.querySelector(".edit-profile-username-input");
        this.editProfileNameInput = shadow.querySelector(".edit-profile-name-input");
        this.editProfileLinksInput =  shadow.querySelector(".edit-profile-links-input");
        this.editProfileBioInput =  shadow.querySelector(".edit-profile-bio-input");
        this.editProfileBioCharCount =  shadow.querySelector(".edit-profile-bio-char-count");
        this.editProfileGenderSelect = shadow.querySelector(".edit-profile-gender-select");
        this.editProfilePronounInput = shadow.querySelector(".edit-profile-pronoun-input");
        this.editProfileSubmitBtn = shadow.querySelector(".edit-profile-submit-btn");

        // Adding Event Listeners
        this.editProfileBioInput.addEventListener("input", () => this.handleCharCount());
        this.editProfileSubmitBtn.addEventListener("click", () => this.handleSubmitBtn());
    }

    async connectedCallback() {
        const user =  JSON.parse(localStorage.getItem("auth")).userId
        
        // somehow when ever someone clicks on an account 
        // thats not theirs, that accounts ID gets passed in so this code
        // can check that, TBA

        const placeholder = null; 

        // Load in profile details
        this.fillInProfileFields()
    }
    
    disconnectedCallback() {
        console.log("Edit Profile Component Disconnected")
    }

    handleCharCount(){
        this.editProfileBioCharCount.textContent = `${this.editProfileBioInput.value.length} / 150`
        this.editProfileBioInput.style.height = `auto`
        this.editProfileBioInput.style.height = `calc(1.8rem + ${this.editProfileBioInput.scrollHeight}px)`
    }

    async handleSubmitBtn(){
        const updatedUserData = {}

        // Fetch User Data
        const token =  JSON.parse(localStorage.getItem("auth")).userId
        
        let userData = {};

        try {
            const response = await fetch(`/api/user/${token}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            userData = await response.json()
        } catch (error) {
            console.error('Failed to fetch user data:', error);
            // profileWrapper.textContent = 'Error loading profile. Please try again later.';
        }

        // Only submitting new fields
        if (this.editProfileLinksInput.value.trim() != "" && userData.socialLinks.includes(this.editProfileLinksInput.value.trim())){
            userData.socialLinks.push(this.editProfileLinksInput.value.trim())
            updatedUserData['socialLinks'] = userData.socialLinks
        }

        if (this.editProfileBioInput.value.trim() != userData.bio){
            updatedUserData['bio'] = this.editProfileBioInput.value.trim();
        }

        if (this.editProfileGenderSelect.value.trim() != "" && this.editProfileGenderSelect.value.trim() != userData.gender){
            updatedUserData['gender'] = this.editProfileGenderSelect.value.trim();
        }

        if (this.editProfilePronounInput.value.trim() != "" && this.editProfilePronounInput.value.trim() != userData.pronouns){
            updatedUserData['pronouns'] = this.editProfilePronounInput.value.trim();
        }

        console.log(updatedUserData)

        // Checking if username can be updated

        if (this.editProfileUsernameInput.value.trim() != "" && this.editProfileUsernameInput.value.trim() != userData.username){
            const response = await fetch(`/api/user/check`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username: editProfileUsernameInput.value.trim()}),
            }); 
            
            if (response.ok){
                const result = await response.json()
                if (result.exists){
                    updatedUserData['username'] = this.editProfileUsernameInput.value.trim();
                }
            }
        }

        if (this.editProfileNameInput.value.trim() != "" && this.editProfileNameInput.value.trim() != userData.name){
            updatedUserData['name'] = this.editProfileNameInput.value.trim();
        }
        
        // Update Server with new info
        if (Object.keys(updatedUserData).length != 0){
            const response = await fetch(`/api/user/${token}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedUserData),
            }); 
            
            if (response.ok) {
                console.log(await response.json())

                // Re-load new profile fields 
                this.fillInProfileFields()
            }
        } else {
            console.log("Nothing to Update")
        }
    }

    async fillInProfileFields() {
        // Retrieving the person currently logged in

        const auth = JSON.parse(localStorage.getItem('auth'))
        const token = auth.userId

        if (!token) {
            console.log('User token not found.');
            window.localStorage.href = '../login';
        }

        // Retrieving the data of the desired profile
        let userData = {};

        try {
            const response = await fetch(`/api/user/${token}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            userData = await response.json()
        } catch (error) {
            console.error('Failed to fetch user data:', error);
            // profileWrapper.textContent = 'Error loading profile. Please try again later.';
        }

        // Filling in Profile Details

        this.editProfileImg.src = userData.pfpImage === null ? '../profile/defaultpfp.jpg' : `data:image/jpeg;base64,${userData.pfpImage}`;
        this.editProfileUsername.textContent = userData.username;
        this.editProfileName.textContent = userData.name;
        this.editProfileLinksInput.value = userData.socialLinks;
        this.editProfileBioInput.textContent = userData.bio;
        this.editProfileGenderSelect.value = this.editProfileGenderSelect.value != null ? userData.gender: "";
        this.editProfileUsernameInput.value = userData.username;
        this.editProfileNameInput.value = userData.name;
        this.editProfilePronounInput.value = userData.pronouns;

        // need to add dynamic link adding / editing
    }


}

customElements.define("profile-view", Profile);
customElements.define("edit-profile-view", EditProfile);

