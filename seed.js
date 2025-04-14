//mockdata for the frontend
const { Sequelize } = require('sequelize');
const Event = require('./backend/model/eventModel.js'); // Adjust the path as needed
const User = require('./backend/model/userModel.js'); // Adjust the path as needed

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: '../database.sqlite', // Adjust path if necessary
});

async function seedDatabase() {
    try {
        // Sync models with the database
        await sequelize.sync({ force: true });
        console.log('Database synced.');

        // Seed users
        const users = await User.bulkCreate([
            {
                name: 'Felix Pantoja',
                email: 'fpantoja@umass.edu',
                username: 'fpant',
                password: 'Curlyquail4',
                emailVerified: true,
                bio: 'Event enthusiast and tech geek.',
                phoneNumber: '555-1234',
                age: 23,
                gender: 'Male',
                socialLinks: JSON.stringify({ twitter: '@alicej', linkedin: 'linkedin.com/in/fpantoja'}),
                skills: JSON.stringify(['Networking', 'Event Planning']),
                hobbies: JSON.stringify(['Hiking', 'Cooking']),
                currentEvents: null,
                pastEvents: null,
                pronouns: null,
                followers: null,
                following: null,
                friends: null,
            },
            {
                name: 'Mayla Neri',
                email: 'mayla@umass.edu',
                username: 'MaylaN',
                password: 'Curlyquail4',
                emailVerified: true,
                bio: 'Cinnamon Bun Lover',
                phoneNumber: '555-1234',
                age: 20,
                gender: 'Female',
                socialLinks: JSON.stringify({ twitter: '@alicej', linkedin: 'linkedin.com/in/fpantoja'}),
                skills: JSON.stringify(['Networking', 'Event Planning']),
                hobbies: JSON.stringify(['Hiking', 'Cooking']),
                currentEvents: null,
                pastEvents: null,
                pronouns: null,
                followers: null,
                following: null,
                friends: null,
            },
            {
                name: 'Maja Linden',
                email: 'maja@umass.edu',
                username: 'MajaL',
                password: 'Curlyquail4',
                emailVerified: true,
                bio: 'I like silly',
                phoneNumber: '555-1235',
                age: 20,
                gender: 'Female',
                socialLinks: JSON.stringify({ twitter: '@alicej', linkedin: 'linkedin.com/in/fpantoja'}),
                skills: JSON.stringify(['Networking', 'Event Planning']),
                hobbies: JSON.stringify(['Hiking', 'Cooking']),
                currentEvents: null,
                pastEvents: null,
                pronouns: null,
                followers: null,
                following: null,
                friends: null,
            },
        ]);

        console.log(`${users.length} users created.`);

        // Seed events
        const events = await Event.bulkCreate([
            {
                eventName: 'Tech Meetup',
                eventDate: '2024-12-20',
                //eventTime: '18:00',
                privacy: 'Public',
                inviteOption: 'Anyone',
                eventLimit: 50,
                eventCategory: 'Technology',
                reservation: true,
                eventCreator: users[0].id, // Assume User IDs start from 1
                eventAddress: '123 Tech Street, Silicon Valley, CA',
                eventDescription: 'A meetup for tech enthusiasts to share and learn.',
                //eventImage: 'https://example.com/tech-meetup.jpg',
                eventImage: 'https://cdn.prod.website-files.com/64f989999025f3e47402a969/65433da3841c29ac9e3fc41b_Accelerate-your-career-by-attending-tech-meetups.jpeg',
            },
            {
                eventName: 'Cooking Workshop',
                eventDate: '2024-12-15',
                //eventTime: '14:00',
                privacy: 'Private',
                inviteOption: 'Invite Only',
                eventLimit: 20,
                eventCategory: 'Cooking',
                reservation: false,
                eventCreator: users[1].id,
                eventAddress: '456 Culinary Lane, Food City, CA',
                eventDescription: 'Hands-on cooking experience with a professional chef.',
                //eventImage: 'https://example.com/cooking-workshop.jpg',
                eventImage: 'https://www.allculinaryschools.com/wp-content/uploads/2016/12/culinary-arts-find-a-cooking-class.jpg',
            },
        ]);

        console.log(`${events.length} events created.`);
        console.log('Database seeding completed.');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await sequelize.close();
        console.log('Database connection closed.');
    }
};

module.exports = seedDatabase