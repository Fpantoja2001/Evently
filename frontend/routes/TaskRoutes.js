import express from 'express';
import TaskController from '../controller/taskController.js';

class TaskRoutes {
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get('/tasks', async (req, res) => {
            await TaskController.getAll(req, res);
        }); 

        this.router.post('/tasks', async (req, res) => {
            await TaskController.add(req, res);
        });

        this.router.delete('/tasks', async (req, res) => {
            await TaskController.clear(req, res);
        });
    }

    getRouter() {
        return this.router;
    }
}

export default new TaskRoutes().getRouter();