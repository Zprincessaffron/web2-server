const cors = require('cors');

const allowedOrigins = ['https://web2-client-eosin.vercel.app'];
// const allowedOrigins = ['https://web2-client-eosin.vercel.app'];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

module.exports = cors(corsOptions);
