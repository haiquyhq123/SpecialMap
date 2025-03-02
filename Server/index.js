const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const config = require("./config/config.js");
const cron = require('node-cron');

// Default router setting
const policeNewsRoutes = require('./routes/policeNews');
const arcgisRoutes = require('./routes/arcgis');
const emergencyRoutes = require('./routes/emergency');
const userRoutes = require('./routes/user');
const { default: axios } = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());


// Register routes
app.use('/api/police-news', policeNewsRoutes);
app.use('/api/arcgis', arcgisRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/user', userRoutes);

// Open data and incident data corrector
cron.schedule('0 0 * * *', () => {
  axios.get(config.currentConstructionAPI);
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}.`);
});
