const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');
const { check, validationResult } = require('express-validator/check');
const fs = require('fs');
const bodyParser = require('body-parser');
const Task = require('./task');
const TaskConstraints = require('./validation/taskValidation');
const ownerConstraints = require('./validation/ownerValidation');
const TaskRepository = require('./taskRepository');
app.use(bodyParser.json());

app.use('/api/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.set('port', process.env.PORT || 3000);
app.get('/', (req, res) => res.redirect('/api/doc'));

app.get('/tasks', ownerConstraints, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const taskRepository = new TaskRepository(req.header('owner'));
    taskRepository.findAll((err, data) => {
        if (err) return res.status(400).json({ errors: err });
        res.json(data);
    });
});

app.post('/tasks', TaskConstraints, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const taskRepository = new TaskRepository(req.header('owner'));
    const task = new Task(req.body);
    task.generateId();
    taskRepository.save(task, (err, data) => {
        res.status(201).json({id: task.id});
    });
});

app.delete('/tasks/:id', ownerConstraints, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const taskRepository = new TaskRepository(req.header('owner'));
    taskRepository.delete(req.params.id, (err, data) => {
        res.status(200).send();
    });
});

app.get('/tasks/:id', ownerConstraints, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const taskRepository = new TaskRepository(req.header('owner'));
    taskRepository.findOne(req.params.id, (err, data) => {
        if (!data || data.length === 0) return res.status(404).send();
        res.status(200).send(data);
    });
});

app.post('/tasks/:id', TaskConstraints, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const taskRepository = new TaskRepository(req.header('owner'));
    const task = new Task(req.body);
    taskRepository.update(req.params.id, task, (err, data) => {
        if (!data || err) return res.status(404).json({error: err});
        res.status(200).send(data);
    });
});

app.listen(app.get('port'), () => console.log(`Example app listening on port ${app.get('port')}!`));
