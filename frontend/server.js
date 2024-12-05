import express from 'express';
import TaskRoutes from './routes/TaskRoutes.js';

class Server {
    constructor() {
        this.app = express();
        this.configureMiddleware();
        this.setup
    }

    configureMiddleware() {
        // not sure if i should route this to home
        this.app.use(express.static("../frontend/home"));
        this.app.use(express.json({ limit: '10mb' }));
    }

    setupRoutes() {
        this.app.use('/v1', TaskRoutes);
    }

    start(port = 3000) {
        this.app.listen(port, () => {
            console.log(`Server started on http://localhost:${port}`);
        });
    }
}

console.log("Starting server");
const server = new Server();
server.start();