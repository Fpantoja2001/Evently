// import {Sequelize, DataTypes} from 'sequelize';
const {Sequelize, DataTypes} = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite'
});

const Task = sequelize.define('Task', {
    taskID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },

    task: {
        type: DataTypes.STRING,
        allowNull: false
    }

    // can include other fields
});

class _SQLiteTaskModel {

    // empty constructor because Sequelize will manage most of the setup
    constructor() {}

    async init(fresh = false) {
        await sequelize.authenticate();
        await sequelize.sync({force: true});

        if (fresh) {
            await this.delete();
            // can add sample tasks here if needed
        }
    }

    // add new task to the database
    async create(task) {
        return await Task.create({task});
    }

    // if id is provided, fetch the task with the id
    async read(id = null) {
        if (id) {
            return await Task.findByPk(id);
        }
        return await Task.findAll(); // fetch all tasks if no id is provided
    }

    async update(task) {
        const taskUpdate = await Task.findByPk(task.taskID);
        if (!taskUpdate) {
            return null;
        }

        await taskUpdate.update(task);
        return taskUpdate;
    }

    async delete(task = null) {
        if (task) {
            const taskDelete = await Task.findByPk(task.taskID);
            if (taskDelete) {
                await taskDelete.destroy();
                return taskDelete;
            }
        } else {
            await Task.destroy({truncate: true});
            return;
        }
    }
}

// const SQLiteTaskModel = new _SQLiteTaskModel();
module.exports = new _SQLiteTaskModel();
//export default SQLiteTaskModel;
