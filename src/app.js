const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./model');
const { getProfile } = require('./middleware/getProfile');

const contractRoutes = require('./routes/contractRoutes');
const jobRoutes = require('./routes/jobRoutes');
const balanceRoutes = require('./routes/balanceRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
app.use(bodyParser.json());

app.set('sequelize', sequelize);
app.set('models', sequelize.models);

app.use(contractRoutes); // the organized routes
app.use(jobRoutes);
app.use(balanceRoutes);
app.use(adminRoutes);

module.exports = app;
