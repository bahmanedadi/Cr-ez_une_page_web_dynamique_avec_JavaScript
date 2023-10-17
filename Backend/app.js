const express = require('express');
const path = require('path');
const cors = require('cors')
require('dotenv').config();
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express')
const yaml = require('yamljs')
const swaggerDocs = yaml.load('swagger.yaml')
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(helmet({
      crossOriginResourcePolicy: false,
    }));
app.use('/images', express.static(path.join(__dirname, 'images')))

const db = require("./models");
const userRoutes = require('./routes/user.routes');
const categoriesRoutes = require('./routes/categories.routes');
const worksRoutes = require('./routes/works.routes');
db.sequelize.sync().then(()=> console.log('db is ready'));
app.use('/api/users', userRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/works', worksRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
module.exports = app;


const apiUrl = 'http://localhost:5678/api/';

fetch(apiUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error('Erreur réseau : ' + response.status);
      console.log('hello world');
    }
    return response.json(); // Convertit la réponse en JSON
  })
  .then(data => {
    // Travaillez avec les données ici
    console.log(data);
    // Mettez à jour votre interface utilisateur avec les données récupérées
  })
  .catch(error => {
    console.error('Erreur lors de la récupération des données :', error);
  });
