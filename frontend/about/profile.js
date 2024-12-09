

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
                if (span === 'socialLinks') {
                    text.removeChild(document.getElementById('addButton'));
                    text.removeChild(document.getElementById('removeButton'));
                    isValid = true;
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

    console.log(spanArray);
}