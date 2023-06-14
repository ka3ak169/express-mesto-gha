const jwt = require('jsonwebtoken');
require('dotenv').config();

const getGwtToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

const isAuthorized = async (token) => {
  try{
    const data = await jwt.verify(token, process.env.JWT_SECRET);
    return !!data
  } catch(err) {
      return false
  }
}

module.exports = {
  getGwtToken,
  isAuthorized
}