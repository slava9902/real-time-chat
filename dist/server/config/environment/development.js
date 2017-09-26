'use strict';

// Development specific configuration
// ==================================


// var fs        = require("fs");
// var path      = require("path");
// var Sequelize = require("sequelize");
// var env       = process.env.NODE_ENV || "development";
// var config    = require(path.join(__dirname, '..', 'config', 'config.json'))[env];


// var Sequelize = require("sequelize");
//
// var sequelize = new Sequelize('chat', 'root', 'pass@root', {
//     host: 'localhost',
//     dialect: 'mysql',
//
//     pool: {
//       max: 5,
//       min: 0,
//       idle: 10000
//     },
//
//     // SQLite only
//
//   })
//   sequelize.authenticate()
//   .then(() => {
//     console.log('Connection has been established successfully.');
//   })
//   .catch(err => {
//     console.error('Unable to connect to the database:', err);
//   });
//
//
// var db        = {};
//
// fs
//   .readdirSync(__dirname)
//   .filter(function(file) {
//     return (file.indexOf(".") !== 0) && (file !== "index.js");
//   })
//   .forEach(function(file) {
//     var model = sequelize.import(path.join(__dirname, file));
//     db[model.name] = model;
//   });
//
// Object.keys(db).forEach(function(modelName) {
//   if ("associate" in db[modelName]) {
//     db[modelName].associate(db);
//   }
// });
//
// db.sequelize = sequelize;
// db.Sequelize = Sequelize;
//
// module.exports = db;


var path = require('path'),
  port = process.env.PORT || 4000,
  ip = process.env.IP,
  DB_HOST = process.env.DB_HOST || 'localhost',
  DB_USERNAME = process.env.DB_USERNAME || 'root',
  DB_PASSWORD = process.env.DB_PASSWORD || 'pass@root',
  DB_NAME = process.env.DB_NAME || 'chat';

var config = {

  app: {
    name: 'UniqBook'
  },
  port: port,
  ip: ip,
  //db: 'mysql://root:lunasushi@rds.c6dzhur9cerb.us-east-1.rds.amazonaws.com/mercury',
  //db:'mysql://root:lunasushi@localhost/mercury_dev',
  db:'mysql://'+ DB_USERNAME +':'+ DB_PASSWORD +'@'+ DB_HOST +'/'+DB_NAME,
  //db:'mysql://root:@localhost/mercury_dev3',
  sequelize: {
    logger: false
  },
  jwtSecret: 'xjkds5jfiew23905as7/3uk',
  // emailFrom: '"PricePoint Admin" <admin@griprocure.com>',
  //emailTo: 'ryankeintz@griprocure.com,daveey@gmail.com,nealsiebert@gmail.com',
  // emailTo: 'hgillh@gmail.com',
  //emailToCorporateUI: "admin@griprocure.com"
};



module.exports = config;
