

const testUser = "8cda6dcf-3f34-47f1-990c-7a304f7a3f7a";
const profileWrapper = document.getElementById('profile_wrapper');

const displayData = {
    'name': 'Name',
    'email': 'Email',
    'phone': 'Phone',
    'socialLinks': 'Social Links',
    'skills': 'Skills',
    'hobbies': 'Hobbies',
    'bio': 'Bio',
    'age': 'Age',
    'gender': 'Gender',
    'location': 'Location'
};

// Fetch user data
async function getUserData() {
    try {
        const response = await fetch(`/api/user/${testUser}`);
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

// Create a field with editable functionality
function createField(labelText, value, editable = true) {
    const fieldWrapper = document.createElement('div');
    fieldWrapper.className = 'fieldWrapper';

    const label = document.createElement('strong');
    label.className = 'label';
    label.textContent = labelText + ': ';
    fieldWrapper.appendChild(label);

    const textWrapper = document.createElement('span');
    textWrapper.textContent = value;
    fieldWrapper.appendChild(textWrapper);

    if (editable) {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = value;
        input.className = 'editInput';
        input.style.display = 'none';
        fieldWrapper.appendChild(input);

        const editButton = document.createElement('button');
        editButton.className = 'editButton';
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => {
            textWrapper.style.display = 'none';
            input.style.display = 'inline';
            editButton.style.display = 'none';
            saveButton.style.display = 'inline';
        });
        fieldWrapper.appendChild(editButton);

        const saveButton = document.createElement('button');
        saveButton.className = 'saveButton';
        saveButton.textContent = 'Save';
        saveButton.style.display = 'none';
        saveButton.addEventListener('click', () => {
            value = input.value;
            textWrapper.textContent = value;
            textWrapper.style.display = 'inline';
            input.style.display = 'none';
            editButton.style.display = 'inline';
            saveButton.style.display = 'none';
        });
        fieldWrapper.appendChild(saveButton);
    }

    return fieldWrapper;
}

function renderSocialLinks(links) {
    const socialLinksWrapper = document.createElement('div');
    socialLinksWrapper.className = 'socialLinks';

    // Parse JSON string if needed
    if (typeof links === 'string') {
        try {
            links = JSON.parse(links);
        } catch (e) {
            console.error('Invalid JSON for socialLinks:', links);
            const errorText = document.createElement('p');
            errorText.textContent = 'Invalid social links data.';
            socialLinksWrapper.appendChild(errorText);
            return socialLinksWrapper;
        }
    }

    // Render each link with edit functionality
    for (let [platform, url] of Object.entries(links)) {
        const linkWrapper = document.createElement('div');
        linkWrapper.className = 'socialLinkItem';

        const linkText = document.createElement('span');
        linkText.textContent = `${platform}: `;
        linkWrapper.appendChild(linkText);

        const link = document.createElement('a');
        link.href = url;
        link.textContent = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.style.color = '#007bff';
        linkWrapper.appendChild(link);

        const editButton = document.createElement('button');
        editButton.className = 'editButton';
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => {
            const inputPlatform = document.createElement('input');
            inputPlatform.type = 'text';
            inputPlatform.value = platform;
            inputPlatform.className = 'editInput';

            const inputUrl = document.createElement('input');
            inputUrl.type = 'text';
            inputUrl.value = url;
            inputUrl.className = 'editInput';

            linkWrapper.replaceChild(inputPlatform, linkText);
            linkWrapper.replaceChild(inputUrl, link);

            editButton.textContent = 'Save';
            editButton.onclick = () => {
                const newPlatform = inputPlatform.value.trim();
                const newUrl = inputUrl.value.trim();

                linkText.textContent = `${newPlatform}: `;
                link.textContent = newUrl;
                link.href = newUrl;

                linkWrapper.replaceChild(linkText, inputPlatform);
                linkWrapper.replaceChild(link, inputUrl);

                editButton.textContent = 'Edit';
                editButton.onclick = null; // Reset functionality
                renderSocialLinks(links); // Re-render for consistency
            };
        });

        linkWrapper.appendChild(editButton);
        socialLinksWrapper.appendChild(linkWrapper);
    }

    return socialLinksWrapper;
}


// Render skills
function renderSkills(skills) {
    const skillsWrapper = document.createElement('div');
    skillsWrapper.className = 'skills';
    skills.forEach(skill => {
        const skillDiv = document.createElement('div');
        skillDiv.className = 'skill';
        skillDiv.textContent = skill;
        skillsWrapper.appendChild(skillDiv);
    });
    return skillsWrapper;
}



// Render hobbies
function renderHobbies(hobbies) {
    const hobbiesWrapper = document.createElement('div');
    hobbiesWrapper.className = 'hobbies';
    hobbies.forEach(hobby => {
        const hobbyDiv = document.createElement('div');
        hobbyDiv.className = 'hobby';
        hobbyDiv.textContent = hobby;
        hobbiesWrapper.appendChild(hobbyDiv);
    });
    return hobbiesWrapper;
}


// Render user profile fields
function renderField(info, value) {
    const fieldWrapper = document.createElement('div');
    fieldWrapper.className = `${info}Wrapper`;

    // Add a header for the section
    if (info === 'socialLinks' || info === 'skills' || info === 'hobbies') {
        const header = document.createElement('strong');
        header.className = 'label';
        header.textContent = displayData[info];
        fieldWrapper.appendChild(header);
    }

    // Append the specific content
    if (info === 'socialLinks') {
        const socialLinksContent = renderSocialLinks(value);
        fieldWrapper.appendChild(socialLinksContent);
    } else if (info === 'skills') {
        const skillsContent = renderSkills(value);
        fieldWrapper.appendChild(skillsContent);
    } else if (info === 'hobbies') {
        const hobbiesContent = renderHobbies(value);
        fieldWrapper.appendChild(hobbiesContent);
    } else {
        const standardField = createField(displayData[info], value);
        fieldWrapper.appendChild(standardField);
    }

    return fieldWrapper;
}


// Render the profile UI
async function renderProfile() {
    const data = await getUserData();
    if (!data || !profileWrapper) return;

    // Profile Image
    const profileImage = document.createElement('div');
    profileImage.className = 'profileImage';
    const pfp = document.createElement('img');
    pfp.src = '../about/defaultpfp.jpg';
    profileImage.appendChild(pfp);
    profileWrapper.appendChild(profileImage);

    // Username
    const userDiv = document.createElement('div');
    const username = document.createElement('h2');
    username.className = 'username';
    username.textContent = '@' + data.username;
    userDiv.appendChild(username);
    profileWrapper.appendChild(userDiv);

    // User Details
    const userBioDiv = document.createElement('div');
    const userBio = document.createElement('p');
    userBio.className = 'userBio';

    for (let [info, value] of Object.entries(data)) {
        if (displayData[info] !== undefined) {
            const field = renderField(info, value);
            userBio.appendChild(field);
        }
    }

    userBioDiv.appendChild(userBio);
    profileWrapper.appendChild(userBioDiv);
}

// Run the rendering process
renderProfile();
