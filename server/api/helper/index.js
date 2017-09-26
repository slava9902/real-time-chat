var fs = require('fs'),
  path = require('path'),
  helpers = {};


fs.readdirSync(__dirname).filter(function(file) {
  return (file.indexOf('.') !== 0) && (file !== 'index.js');
}).forEach(function(file) {
  var helper = require(path.join(__dirname, file));
  helpers[path.basename(file, '.js')] = helper;
});


module.exports = helpers;
