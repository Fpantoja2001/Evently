// const { Server } = require('socket.io');
// const express = require('express');
// const path = require('path');
// const { createServer } = require('node:http');
// const cors = require('cors');

// const app = express()
// const server = createServer(app);

// app.use(cors({
//     origin: 'http://localhost:3000',
//     methods: ['GET', 'POST', 'PUT'],
//     credentials: true
// }));

// const io = new Server(server, {
//     cors: {
//         origin: "http://localhost:3000",
//         methods: ["GET", "POST","PUT"]
//       }
// });



// app.use(express.static(path.join(__dirname, '../frontend'))); // Serve frontend files
// app.use(express.json({ limit: '10mb' }));
// app.options('*', cors())

// app.listen(3000, () => {
//     console.log(`Server started on http://localhost:${3000}`);
// });


// io.on("connection", (socket) => {
//     console.log("a user connected", socket)
// })

const socket = io('http://localhost:3000'); // Connect to the server

window.socket = socket;

// Listen for connection
socket.on('connect', async () => {
    const token = JSON.parse(localStorage.getItem("auth")).userId
    let userData = {};

    try {
        const response = await fetch(`/api/user/${token}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        userData = await response.json()
    } catch (error) {
        console.error('Failed to fetch user data:', error);
    }

    console.log(`user ${userData.name} connected on socket ${socket.id}`);
});

export default socket;