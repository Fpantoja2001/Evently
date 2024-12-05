const InMemoryTaskModel = require("./inMemoryTaskModel.js");
const SQLiteTaskModel = require("./SQLiteTaskModel.js");

class ModelFactory {
    async getModel(model = "sqlite") {
        if (model === "sqlite") {
            return SQLiteTaskModel;
        } else if (model === "sqlite-fresh") {
            await SQLiteTaskModel.init(true);
            return SQLiteTaskModel
        } else {
            return InMemoryTaskModel;
        }
    }
}

module.exports = new ModelFactory();