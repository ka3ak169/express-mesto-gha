const jwt = require('jsonwebtoken');
require('dotenv').config();

// const getGwtToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
const getGwtToken = (id) => jwt.sign({ id }, 'super_secret_key', { expiresIn: '7d' });

module.exports = getGwtToken;
