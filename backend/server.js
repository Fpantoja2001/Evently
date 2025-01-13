const express = require('express');
const sequelize = require('./db.js'); // Sequelize instance
const EventRoutes = require('./routes/eventRoutes.js'); // Event routes
const UserRoutes = require('./routes/userRoutes.js'); // User routes
const ReviewRoutes = require('./routes/reviewRoutes.js'); // Review routes
const ConversationRoutes = require('./routes/conversationRoutes.js'); //  Conversation routes
const MessageRoutes = require('./routes/messageRoutes.js'); // Message routes
const session = require('express-session')
const store = new session.MemoryStore();
const path = require('path');
const seedDatabase = require('../seed.js');
const cors = require('cors');
const http = require('http'); // Required for wrapping Express app
const { Server } = require('socket.io'); // Import Socket.IO

class LocalServer {
    constructor() {
        this.app = express();
        this.server = http.createServer(this.app); // Create an HTTP server
        this.io = new Server(this.server, {
            cors: {
                origin: 'http://localhost:3000', // Allow requests from frontend
                methods: ['GET', 'POST', 'PUT'],
                credentials: true
            }
        });

        this.configureMiddleware();
        this.setupRoutes();
        this.syncDatabase();
        this.runSeed();
        this.setUpSession();
        this.setupSocket();
    }

    // Configure middleware
    configureMiddleware() {
        this.app.use(express.static(path.join(__dirname, '../frontend'))); // Serve frontend files
        this.app.use(express.json({ limit: '10mb' })); // Parse incoming JSON
        this.setUpSession()
    }

    // Set up routes
    setupRoutes() {
        this.app.use('/api/', EventRoutes); // Routes for event management
        this.app.use('/api/', UserRoutes); // Routes for user management
        this.app.use('/api/', ReviewRoutes); // Routes for review management
        this.app.use('/api/', ConversationRoutes); // Routes for conversation management
        this.app.use('/api/', MessageRoutes); // Routes for message management
    }

    // Synchronize database models
    async syncDatabase() {
        try {
            await sequelize.sync({ force: false });
            console.log('Database synchronized successfully.');
        } catch (error) {
            console.error('Error synchronizing the database:', error);
        }
    }

    // Set up Session

    setUpSession() {
        this.app.use(session({
            secret: "some secret",
            cookie: {
                maxAge: 1000 * 60 * 60 * 24
            },
            saveUninitialized: false,
            resave: false,
            store: store,
        }))
    }

    // Set up socket
    setupSocket() {
        this.io.on('connection', (socket) => {
            console.log('A user connected:', socket.id);

            // Handle custom events from the client
            socket.on('message', (data) => {
                console.log('Message received:', data);

                // Broadcast the message to all connected clients
                this.io.emit('message', data);
            });

            // Handle disconnection
            socket.on('disconnect', () => {
                console.log('A user disconnected:', socket.id);
            });

            socket.on("hello", () => {
                console.log("hello")
            })

            socket.on("joinProfileRoom", (profileId) => {
                const room = `profile_${profileId}`
                socket.join(room)
                this.io.to(room).emit("joinedRoom", room)
            })

            socket.on("profileUpdate", (data) => {
                this.io.to(data.profileId).emit("visualUpdate", data.profileUpdatedData)
                this.io.to(data.viewerId).emit("visualUpdate", data.viewerUpdatedData)
            })

            socket.on("newMessage", (data) => {
                const room = `conversation_${data.conversationId}`
                this.io.to(room).emit("loadNewMessages", data);
                this.io.emit("loadNewInboxes", data)
            })

            socket.on("conversationRoom", (data) => {
                const room = `conversation_${data}`
                socket.join(room)
                this.io.to(room).emit("joinedRoom", room)
            })
        });

    }

    // Start the server
    start(port = 3000) {
        this.server.listen(port, () => {
            console.log(`Server started on http://localhost:${port}`);
        });

        this.app.use(cors({
            origin: 'http://localhost:3000',
            methods: ['GET', 'POST', 'PUT'],
            credentials: true
        }));
    }

    runSeed(){
        seedDatabase()
    }
}

// Initialize and start the server
console.log('Starting server...');
const server = new LocalServer();
server.start();