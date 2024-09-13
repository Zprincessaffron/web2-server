const mongoose = require('mongoose');
require('dotenv').config();  // Ensure dotenv is loaded correctly

const web1DB = mongoose.createConnection(process.env.WEB1_MONGOURI, {

});

const web2DB = mongoose.createConnection(process.env.MONGOURI, {
  
});

module.exports = {
  web1DB,
  web2DB,
};
