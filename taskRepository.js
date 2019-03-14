const fs = require('fs');
const folder = __dirname + '/data';

module.exports = class TaskRepository {
    constructor(owner) {
        this.dataFile = folder + '/' + owner;
        if (!fs.existsSync(this.dataFile)) {
            fs.writeFileSync(this.dataFile, '[]');
        }
    }

    save(task, callback) {
        this.findAll((err, tasks) => {
            if (err) return callback(err, null);
            tasks.push(task);
            fs.writeFile(this.dataFile, JSON.stringify(tasks), (err) => {
                if (err) return callback(err, task);
                callback(null, task);
            });
        });
    }

    findAll(callback) {
        fs.readFile(this.dataFile, 'utf8', (err, data) => {
            if (err) return callback(err, null);
            callback(err, JSON.parse(data));
        });
    }

    findOne(id, callback) {
        this.findAll((err, tasks) => {
            if (err) return callback(err, null);
            const task = tasks.filter(task => {
                return task.id === id;
            });
            callback(null, task.shift());
        });
    }

    update(id, task, callback) {
        this.findOne(id, (err, exTask) => {
            if (!exTask) return callback('Not found', null);
            this.delete(id, (err, data) => {
                if (err) return callback('Error while replace data', null);
                task.id = id;
                this.save(task, callback);
            })
        });
    }

    delete(id, callback) {
        this.findAll((err, tasks) => {
            if (err) return callback(err, null);
            const newTasks = tasks.filter(task => {
                return task.id !== id;
            });
            fs.writeFile(this.dataFile, JSON.stringify(newTasks), callback);
        });
    }
};
