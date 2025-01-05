const auth = JSON.parse(localStorage.getItem('auth'))
const token = auth.userId

if (!token) {
    console.log('User token not found.');
    window.localStorage.href = '../login';
}

// Fetch user data
async function getUserData() {
    try {
        const response = await fetch(`/api/user/${token}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch user data:', error);
        profileWrapper.textContent = 'Error loading profile. Please try again later.';
        return null;
    }
}

const profileWrapper = document.getElementById('profile_wrapper');

const displayData = {
    'name': 'Name',
    'email': 'Email',
    'phoneNumber': 'Phone Number',
    'bio': 'Bio',
    'age': 'Age',
    'gender': 'Gender',
};

// update user data on the server
async function updateUserData(updatedData) {
    try {
        const response = await fetch(`/api/user/${token}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        });
        if (!response.ok) {
            throw new Error(`HTTP error. status: ${response.status}`);
        }
        const result = await response.json();
        console.log('User updated successfully:', result);
        return result;
    } catch (error) {
        console.error('Error updating user data:', error);
    }
}


function renderList(list, className) {
    const lists = document.createElement('div');
    lists.className = className;
    for (let l of list) {
        const listDiv = document.createElement('div');
        listDiv.className = 'skill';
        listDiv.appendChild(document.createTextNode(l));
        lists.appendChild(listDiv);
    }
    return lists;
}

function renderSocialLinks(links) {
    const socialLinks = document.createElement('div');
    socialLinks.className = 'socialLinks';
    for (let link in JSON.parse(links)) {
        const a = document.createElement('a');
        a.href = links[link];
        a.appendChild(document.createTextNode(link));
        a.appendChild(document.createElement('br'));
        socialLinks.appendChild(a);
    }
    return socialLinks;
}


const data = await getUserData();


const divArray = [];
const spanArray = [];

if (profileWrapper) {
    // make a div for profile image
    const profileImageWrapper = document.createElement('div');
    profileImageWrapper.className = 'profileImageWrapper';

    const profileImage = document.createElement('div');
    profileImage.className = 'profileImage';
    const pfp = document.createElement('img');
    pfp.className = 'profileImageTag';

    if (data.pfpImage) {
        pfp.src = `data:image/jpeg;base64,${data.pfpImage}`;
    } else {
        pfp.src = '../profile/defaultpfp.jpg';
    }

    profileImage.appendChild(pfp);

    const imageUploadInput = document.createElement('input');
    imageUploadInput.type = 'file';
    imageUploadInput.accept = 'image/*';
    imageUploadInput.className = 'editInput';
    imageUploadInput.style.display = 'none'; // Hidden by default
    profileImageWrapper.appendChild(profileImage);
    profileImageWrapper.appendChild(imageUploadInput);


    divArray.push(profileImageWrapper);

    let changeImage = false;
    const desiredChange = {};

    // Handle image upload
    imageUploadInput.addEventListener('change', (event) => {
        const file = event.target.files[0]; // Get the uploaded file
        if (file) {
            const reader = new FileReader();
    
            reader.onloadend = () => {
                const base64String = reader.result.split(",")[1]; // Extract Base64 string (without the prefix)
                pfp.src = reader.result;
                changeImage = true;
                desiredChange['pfpImage'] = base64String;
                console.log("Base64 string:", base64String);
            };
    
            reader.readAsDataURL(file); // Convert the file to a Base64 string
        }
    });

    const userDiv = document.createElement('div');
    userDiv.className = 'userDiv';
    const usernameSpan = document.createElement('span');
    const at = document.createElement('span');
    at.textContent = '@';
    usernameSpan.textContent = data.username;
    usernameSpan.id = 'username';
    const username = document.createElement('h2');
    username.className = 'username';
    username.appendChild(at);
    username.appendChild(usernameSpan);
    // username.appendChild(document.createTextNode(data.username));
    // usernameSpan.appendChild(username);
    // userDiv.appendChild(usernameSpan);
    userDiv.appendChild(username);
    divArray.push(userDiv);
    spanArray.push(usernameSpan.id);

    const userBioDiv = document.createElement('div');
    const userBio = document.createElement('p');
    userBio.className = 'userBio';
    for (let info in data) {
        if (displayData[info] === undefined) {
            continue;
        }
        const label = document.createElement('strong');
        label.className = 'label';
        label.appendChild(document.createTextNode(displayData[info] + ': ')); 
        const text = document.createElement('span');
        text.id = info; // give each span an id for editing later
        spanArray.push(text.id); // append it to an array to loop later

        text.appendChild(document.createTextNode(data[info]));
        userBio.appendChild(label);

        if (info === 'socialLinks') {
            const text = document.createElement('span');
            text.id = info; 
            spanArray.push(text.id); 
        
            const rendered = renderSocialLinks(data[info]);
            text.appendChild(rendered); // Append the rendered links inside the span
            userBio.appendChild(text);
            userBio.appendChild(document.createElement('br'));
            continue;
        }

        if (info === "skills" || info === "hobbies") {
            const text = document.createElement('span');
            text.id = info;
            spanArray.push(text.id);

            const rendered = renderList(data[info], info);
            userBio.appendChild(rendered);
            userBio.appendChild(document.createElement('br'));
            continue;
        }

        userBio.appendChild(text); // append the text information later
        userBio.appendChild(document.createElement('br'));
    }

    // make an edit button
    const editButton = document.createElement('button');
    editButton.className = 'editButton';
    editButton.appendChild(document.createTextNode('Edit'));
    editButton.onclick = async function() {
        if (editButton.textContent === 'Edit') {
            editButton.textContent = 'Save';
            
            imageUploadInput.style.display = 'inline'; // Show the image upload input

            spanArray.forEach((span) => {
                const text = document.getElementById(span);
                if (!text) {
                    console.warn(`Element with ID '${span}' not found.`);
                    return;
                }

                let input;
                if (span === 'age') {
                    input = document.createElement('input');
                    input.type = 'number';
                    input.min = '18';
                    input.max = '120';
                    input.step = '1';
                } else if (span === 'email') {
                    input = document.createElement('input');
                    input.type = 'email';
                } else if (span == 'gender'){
                    input = document.createElement('select');
                    const options = [
                        { value: '', text: 'Select Gender' },
                        { value: 'male', text: 'Male' },
                        { value: 'female', text: 'Female' },
                        { value: 'nonbinary', text: 'Non-binary' },
                        { value: 'other', text: 'Other' },
                        { value: 'prefer-not-to-say', text: 'Prefer not to say' }
                    ];

                    options.forEach(optionData => {
                        const option = document.createElement('option');
                        option.value = optionData.value;
                        option.textContent = optionData.text;
                        if (text.textContent.toLowerCase() === optionData.text.toLowerCase()) {
                            option.selected = true; 
                        }
                        input.appendChild(option);
                    });
                } else if (span === "phoneNumber") {
                    input = document.createElement('input');
                    input.type = 'number';
                } else if (span === "socialLinks") {
                    const addButton = document.createElement('button');
                    addButton.className = 'editButton';
                    addButton.id = 'addButton';
                    addButton.appendChild(document.createTextNode('Add'));
                    addButton.onclick = function() {
                        input = document.createElement('input');
                        input.type = 'text';
                    }

                    const removeButton = document.createElement('button');
                    removeButton.className = 'editButton';
                    removeButton.id = 'removeButton';
                    removeButton.appendChild(document.createTextNode('Remove'));
                    removeButton.onclick = function() {
                        input = document.createElement('input');
                        input.type = 'text';
                    }
                    text.appendChild(addButton);
                    text.appendChild(removeButton);
                } else {
                    input = document.createElement('input');
                    input.type = 'text';
                }
                input.value = text.textContent;
                text.textContent = '';
                text.appendChild(input);
            });
        } else {
            let isValid = true;
            const updatedData = {};
            imageUploadInput.style.display = 'none'; // Hide the image upload input

            spanArray.forEach((span) => {
                const text = document.getElementById(span);
                if (!text) {
                    console.warn(`Element with ID '${span}' not found.`);
                    return; 
                }
                const input = text.querySelector('input');
                const select = text.querySelector('select');
                if (input) {
                    if (input.value.trim() === '') {
                        isValid = false;
                        input.style.border = '1px solid red';
                    } else {
                        console.log(input.value.trim());
                        updatedData[span] = input.value.trim();
                        text.textContent = input.value.trim();
                    }
                } else if (select) {
                    if (select.selectedIndex === 0 || select.value.trim() === '') {
                        isValid = false;
                        select.style.border = '1px solid red';
                    } else {
                        updatedData[span] = select.value.trim();
                        text.textContent = select.options[select.selectedIndex].text;
                    }
                } 
                if (span === 'socialLinks') {
                    const addButton = document.getElementById('addButton');
                    const removeButton = document.getElementById('removeButton');
                    
                    if (addButton) text.removeChild(addButton); 
                    if (removeButton) text.removeChild(removeButton); 
                }
            });         
            if (isValid) {
                if (updatedData.age) {
                    const parsedAge = parseInt(updatedData.age, 10);
                    if (!isNaN(parsedAge)) {
                        updatedData.age = parsedAge;
                    } else {
                        delete updatedData.age;
                    }
                }
                
                if (Array.isArray(updatedData.skills)) {
                    updatedData.skills = JSON.stringify(updatedData.skills);
                }
                
                if (typeof updatedData.socialLinks === 'object') {
                    updatedData.socialLinks = JSON.stringify(updatedData.socialLinks);
                }

                if (changeImage) {
                    updatedData['pfpImage'] = desiredChange['pfpImage'];
                }

                const result = await updateUserData(updatedData);
                console.log(updatedData);

                if (result) {
                    console.log('User data updated successfully:', result);
                
                    // Update the UI with the new data
                    spanArray.forEach((span) => {
                        const text = document.getElementById(span);
                        if (text) {
                            text.textContent = result[span] || ""; // Update each span with the returned value
                        }
                    });
                
                    // Update the profile image if it was changed
                    if (result.pfpImage) {
                        profileImage.src = result.pfpImage; // Update the image src to the new profile picture
                    }
                    editButton.textContent = 'Edit';
                    alert('Profile updated successfully!');
                } else {
                    alert('Failed to update profile. Please try again.');
                } 
            }
        }
    };

    // Signout button
    
    const signOutBtn =  document.createElement("button")
    signOutBtn.textContent = "Sign Out"
    signOutBtn.classList = "signoutButton"
    signOutBtn.onclick = async function() {
        const logoutResponse = await fetch('http://localhost:3000/api/user/logout')
        console.log(logoutResponse)
        localStorage.removeItem('auth');
        location.reload(); // Reload to reflect changes
        window.location.href = '../login/index.html';
    }

    const options = document.createElement('div');
    options.classList = "options"
    options.appendChild(editButton);
    options.appendChild(signOutBtn);


    userDiv.appendChild(options)
    userBioDiv.appendChild(userBio);
    divArray.push(userBioDiv);

    divArray.forEach((div) => {
        profileWrapper.appendChild(div);
    });  

    console.log(spanArray);
}

const template = document.createElement("template");

const componentTemplates = [
    `
        <link rel="stylesheet" href="main.css">

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
                        <div class="profile-name">Felix Manuel Pantoja</div>
                    </div>

                    <div class="profile-line-4">
                        <div class="profile-bio">Wanderlust, coffee enthusiast, and eternal optimist. Turning late-night ideas into early-morning adventures, one step at a time.</div>
                    </div>
                </div>
            </div>

            <div class="profile-content"></div>
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

        <div class="edit-profile-website-bar">
            <div class="edit-profile-website-title">Website</div>
            <input class="edit-profile-website-input" type="text"></input>
        </div>

        <div class="edit-profile-bio-bar">
            <div class="edit-profile-bio-title">Bio</div>
            <textarea class="edit-profile-bio-input" maxlength="150"></textarea>
            <span class="edit-profile-bio-char-count">0 / 150</span>
        </div>
    </div>
    `
]

class Profile extends HTMLElement {
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
        this.profileBio = shadow.querySelector(".profile-bio");

        // Profile Buttons

        this.profileEditBtn = shadow.querySelector(".profile-edit-btn");
        this.profileSignoutBtn = shadow.querySelector(".profile-signout-btn");
        this.profileSettingsBtn = shadow.querySelector(".profile-settings-btn");

        // Button Event Listeners

        this.profileEditBtn.addEventListener("click", this.editProfile)
        this.profileSignoutBtn.addEventListener("click", this.signOut)
        this.profileSettingsBtn.addEventListener("click", this.changeSettings)
    }

    async connectedCallback() {
        // check if user is checking their own profile

        const user =  JSON.parse(localStorage.getItem("auth")).userId
        
        // somehow when ever someone clicks on an account 
        // thats not theirs, that accounts ID gets passed in so this code
        // can check that, TBA

        const placeholder = null; 
        
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

        console.log(userData)

        this.profileUsername.textContent = userData.username;
        this.profileName.textContent = userData.name;
        this.profileBio.textContent = userData.bio === null ? "": userData.bio;
        this.profileImg.src = userData.pfpImage === null ? '../profile/defaultpfp.jpg' : `data:image/jpeg;base64,${userData.pfpImage}`; 
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
        this.editProfileBioInput =  shadow.querySelector(".edit-profile-bio-input");
        this.editProfileBioCharCount =  shadow.querySelector(".edit-profile-bio-char-count");

        // Adding Event Listeners for char count

        this.editProfileBioInput.addEventListener("input", () => {
            this.editProfileBioCharCount.textContent = `${this.editProfileBioInput.value.length} / 150`
            this.editProfileBioInput.style.height = `auto`
            this.editProfileBioInput.style.height = `${this.editProfileBioInput.scrollHeight}px`
        })
    }

    async connectedCallback() {
        const user =  JSON.parse(localStorage.getItem("auth")).userId
        
        // somehow when ever someone clicks on an account 
        // thats not theirs, that accounts ID gets passed in so this code
        // can check that, TBA

        const placeholder = null; 
        
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
    }
    
    disconnectedCallback() {
        console.log("Edit Profile Component Disconnected")
    }

}

customElements.define("profile-view", Profile);
customElements.define("edit-profile-view", EditProfile);

