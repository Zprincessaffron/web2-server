const mongoose = require('mongoose');
require('dotenv').config();  // Ensure dotenv is loaded correctly

const web1DB = mongoose.createConnection(process.env.Web1_mongoURI, {

});

const web2DB = mongoose.createConnection(process.env.mongoURI, {
  
});

module.exports = {
  web1DB,
  web2DB,
};
