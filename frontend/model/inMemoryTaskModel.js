class _InMemoryTaskModel {
    static taskID = 1;

    constructor() {
        this.tasks = [];
    }
    
    async create(task) {
        task.id = _InMemoryTaskModel.taskID++;
        this.tasks.push(task);
        return task;
    }

    async read(id = null) {
        if (id) {
            return this.tasks.find(task => task.id === id);
        }
        return this.tasks;
    }

    async update(task) {
        const index = this.tasks.findIndex(t => t.id === task.id);
        if (index >= 0) {
            this.tasks[index] = task;
            return task;
        }
        return null;
    }
    
    async delete(task = null) {
        if (task) {
            const index = this.tasks.findIndex(t => t.id === task.id);
            if (index >= 0) {
                this.tasks.splice(index, 1);
                return task;
            }
        } else {
            this.tasks = [];
            return;
        }
    }

}

const InMemoryTaskModel = new _InMemoryTaskModel();

export default InMemoryTaskModel;