const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

app.use('/api/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/tasks', function(req, res) {
    res.send('{task: 2}');
});

app.set('port', process.env.PORT || 3000);
app.get('/', (req, res) => res.redirect('/api/doc'));
app.listen(app.get('port'), () => console.log(`Example app listening on port ${app.get('port')}!`));
