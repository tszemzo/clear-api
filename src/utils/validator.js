const _ = require('lodash');

const { CLIENT_TYPE } = require('../utils/constants');

function validateClientType(type) {
  return _.includes(Object.values(CLIENT_TYPE), type);
}

function validateHeadcount(headcount) {
  return _.isNumber(headcount);
}

function validateEmail(email) {
  const regex = /\S+@\S+\.\S+/;
  return regex.test(email);
}

module.exports = {
  validateHeadcount,
  validateClientType,
  validateEmail
};
