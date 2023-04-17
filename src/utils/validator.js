const _ = require('lodash');

const { CLIENT_TYPE } = require('../utils/constants');

function validateClientType(type) {
  return _.includes(Object.values(CLIENT_TYPE), type);
}

function validateHeadcount(headcount) {
  return _.isNumber(headcount);
}

module.exports = {
  validateHeadcount,
  validateClientType,
};
