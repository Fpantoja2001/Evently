// import ModelFactory from './model/ModelFactory.js';
const ModelFactory = require('../model/modelFactory.js');
class TaskController {
    constructor() {
        ModelFactory.getModel().then(model => {
            this.model = model;
        });
    }

    // get all the tasks
    async getAll(req, res) {
        try {
            const tasks = await this.model.read();
            res.json({ fetchedSuccessfully: true, tasks });
        } catch (error) {
            res.status(500).json({ error: error.message});
        }
    }

    // add new task
    async add(req, res) {
        try {
            const task = req.body;
            if (!task || !task.task) {
                res.status(400).json({ error: 'Task is required' });
                return;
            }

            // create task object with uniqueID
            const newTask = await this.model.create(task);

            // log the new task for debugging
            const file = task.file ? `with file: ${req.body.filename}` : "without file";
            console.log(`New Task: ${task.id} - ${task.task} - ${file}`);
            return res.status(201).json({ createdSuccessfully: true, task: newTask });
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({ error: error.message });
        }
    }

    async clear(req, res) {
        try {
            await this.model.delete();
            res.json(await this.model.read());
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new TaskController();
//export default new TaskController();