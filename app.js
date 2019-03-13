const express = require('express');
const app = express();
const port = 3000;
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/tasks', function(req, res) {
    res.send('{task: 2}');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
