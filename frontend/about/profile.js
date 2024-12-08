//import data from './users.json' with { type: "json" };

const testUser = "b6a98677-a213-4aeb-a5a9-babff96cd3d1";
const profileWrapper = document.getElementById('profile_wrapper');

async function getUserData() {
    const response = await fetch(`/api/user/${testUser}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
}

const data = await getUserData();
console.log(data);

const divArray = [];
const displayData = {'name': 'Name', 'email': 'Email', 'phone': 'Phone', 'socialLinks': 'Social Links', 'skills': 'Skills', 'hobbies': 'Hobbies', 'bio': 'Bio', 'age': 'Age', 'gender': 'Gender', 'location': 'Location'};

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
        // if (info === 'username' || info === 'id' || info === 'profileImage' || info === 'preferences' || info === 'updatedAt' || info === 'createdAt') {
        //     continue;
        // }

        if (displayData[info] === undefined) {
            continue;
        }
        const label = document.createElement('strong');
        label.className = 'label';
        label.appendChild(document.createTextNode(displayData[info] + ': ')); 
        const text = document.createTextNode(data[info]);
        userBio.appendChild(label);

        // label links separately
        if (info === 'socialLinks') {
            const socialLinks = document.createElement('div');
            socialLinks.className = 'socialLinks';
            for (let link in data[info]) {
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
        userBio.appendChild(text);
        userBio.appendChild(document.createElement('br'));
    }
    userBioDiv.appendChild(userBio);
    divArray.push(userBioDiv);

    divArray.forEach((div) => {
        profileWrapper.appendChild(div);
    });
}