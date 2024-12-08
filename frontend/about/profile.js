

const testUser = "8cda6dcf-3f34-47f1-990c-7a304f7a3f7a";
const profileWrapper = document.getElementById('profile_wrapper');

const displayData = {
    'name': 'Name',
    'email': 'Email',
    'phoneNumber': 'Phone Number',
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

const data = await getUserData();

const divArray = [];
const spanArray = [];

if (profileWrapper) {
    // make a div for profile image
    const profileImage = document.createElement('div');
    profileImage.className = 'profileImage';
    const pfp = document.createElement('img');
    pfp.src = '../about/defaultpfp.jpg';
    profileImage.appendChild(pfp);
    divArray.push(profileImage);

    const userDiv = document.createElement('div');
    const username = document.createElement('h2');
    username.className = 'username';
    username.appendChild(document.createTextNode('@' + data.username));
    userDiv.appendChild(username);
    divArray.push(userDiv);

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

        // label links separately
        if (info === 'socialLinks') {
            const socialLinks = document.createElement('div');
            socialLinks.className = 'socialLinks';
            for (let link in JSON.parse(data[info])) {
                const a = document.createElement('a');
                a.href = data[info][link];
                a.appendChild(document.createTextNode(link));
                a.appendChild(document.createElement('br'));
                socialLinks.appendChild(a);
            }
            userBio.appendChild(socialLinks);
            continue;
        }  

        // format the skills
        if (info === "skills") {
            const skills = document.createElement('div');
            skills.className = 'skills';
            for (let skill of data[info]) {
                const skillDiv = document.createElement('div');
                skillDiv.className = 'skill';
                skillDiv.appendChild(document.createTextNode(skill));
                skills.appendChild(skillDiv);
            }
            userBio.appendChild(skills);
            continue;
        }

        // format hobbies
        if (info === 'hobbies') {
            const hobbies = document.createElement('div');
            hobbies.className = 'hobbies';
            for (let hobby of data[info]) {
                const hobbyDiv = document.createElement('div');
                hobbyDiv.className = 'hobby';
                hobbyDiv.appendChild(document.createTextNode(hobby));
                hobbies.appendChild(hobbyDiv);
            }
            userBio.appendChild(hobbies);
            continue
        }
        userBio.appendChild(text); // append the text information later
        userBio.appendChild(document.createElement('br'));
    }

    // make an edit button
    const editButton = document.createElement('button');
    editButton.className = 'editButton';
    editButton.appendChild(document.createTextNode('Edit'));
    editButton.onclick = function() {
        if (editButton.textContent === 'Edit') {
            editButton.textContent = 'Save';
            spanArray.forEach((span) => {
                const text = document.getElementById(span);
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
                        const updatedValue = input.value;
                        text.textContent = updatedValue;
                    }
                } else if (select) {
                    if (select.selectedIndex === 0 || select.value.trim() === '') {
                        isValid = false;
                        select.style.border = '1px solid red';
                    } else {
                        const updatedValue = select.options[select.selectedIndex].text;
                        text.textContent = updatedValue;
                    }
                } 
            });
            if (isValid) {
                editButton.textContent = 'Edit';
            }
        }
    };

    userBioDiv.appendChild(editButton);
    userBioDiv.appendChild(userBio);
    divArray.push(userBioDiv);

    divArray.forEach((div) => {
        profileWrapper.appendChild(div);
    });
}