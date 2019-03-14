const uniqid = require('uniqid');
class Task {
    constructor(data) {
        this.update(data);
    }

    update(data) {
        Object.assign(this, data);
    }

    generateId() {
        this.id = uniqid();
    }
}

module.exports = Task;
