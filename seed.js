//mockdata for the frontend
const { Sequelize } = require('sequelize');
const Event = require('./backend/model/eventModel.js'); // Adjust the path as needed
const User = require('./backend/model/userModel.js'); // Adjust the path as needed

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite', // Adjust path if necessary
});

const seedDatabase = async () => {
    try {
        // Sync models with the database
        await sequelize.sync({ force: true });
        console.log('Database synced.');

        // Seed users
        const users = await User.bulkCreate([
            {
                name: 'Alice Johnson',
                email: 'alice@example.com',
                password: 'password123',
                bio: 'Event enthusiast and tech geek.',
                phoneNumber: '555-1234',
                age: 30,
                gender: 'Female',
                socialLinks: JSON.stringify({ twitter: '@alicej', linkedin: 'linkedin.com/in/alicej' }),
                skills: JSON.stringify(['Networking', 'Event Planning']),
                hobbies: JSON.stringify(['Hiking', 'Cooking']),
                pfpImage: 'https://example.com/alice.jpg',
            },
            {
                name: 'Bob Smith',
                email: 'bob@example.com',
                password: 'password123',
                bio: 'Avid traveler and foodie.',
                phoneNumber: '555-5678',
                age: 25,
                gender: 'Male',
                socialLinks: JSON.stringify({ instagram: '@bobtravel' }),
                skills: JSON.stringify(['Photography', 'Graphic Design']),
                hobbies: JSON.stringify(['Traveling', 'Photography']),
                pfpImage: 'https://example.com/bob.jpg',
            },
        ]);

        console.log(`${users.length} users created.`);

        // Seed events
        const events = await Event.bulkCreate([
            {
                eventName: 'Tech Meetup',
                eventDate: '2024-12-20',
                eventTime: '18:00',
                privacy: 'Public',
                inviteOption: 'Anyone',
                eventLimit: 50,
                eventCategory: 'Technology',
                reservation: true,
                eventCreator: users[0].id, // Assume User IDs start from 1
                eventAddress: '123 Tech Street, Silicon Valley, CA',
                eventDescription: 'A meetup for tech enthusiasts to share and learn.',
                eventImage: 'https://example.com/tech-meetup.jpg',
            },
            {
                eventName: 'Cooking Workshop',
                eventDate: '2024-12-15',
                eventTime: '14:00',
                privacy: 'Private',
                inviteOption: 'Invite Only',
                eventLimit: 20,
                eventCategory: 'Cooking',
                reservation: false,
                eventCreator: users[1].id,
                eventAddress: '456 Culinary Lane, Food City, CA',
                eventDescription: 'Hands-on cooking experience with a professional chef.',
                eventImage: 'https://example.com/cooking-workshop.jpg',
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

seedDatabase();
