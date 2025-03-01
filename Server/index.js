const express = require('express');
const bodyParser = require('body-parser');

const policeNewsRoutes = require('./routes/policeNews');
const arcgisRoutes = require('./routes/arcgis');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Register routes
app.use('/api/police-news', policeNewsRoutes);
app.use('/api/arcgis', arcgisRoutes);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}.`);
});
