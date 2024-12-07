// import express from 'express';
// import TaskController from '../controllers/TaskController.js';
const express = require('express');
const TaskController = require('../controller/taskController.js');

class TaskRoutes {
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        // FOR DATABASE 
        this.router.get('/task/:eventId', async (req, res) => {
            await TaskController.get(req, res);
        }); 

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

// export default new TaskRoutes().getRouter();
module.exports = new TaskRoutes().getRouter();