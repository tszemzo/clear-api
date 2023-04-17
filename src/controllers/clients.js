const _ = require('lodash');

const clientsService = require('../services/clients');
const { CLIENT_TYPE } = require('../utils/constants');
const { validateClientType, validateHeadcount } = require('../utils/validator');

const self = {
  createClient,
  getClients,
  getClient,
  editClient,
  deleteClient,
};

module.exports = self;

async function createClient({ companyName, address, city, state, zip, headcount = 0, type }) {
  if (!companyName) {
    throw new Error('companyName is required');
  }

  if (headcount && !validateHeadcount(headcount)) {
    throw new Error('Headcount must be a number');
  }

  if (!validateClientType(type)) {
    throw new Error('Invalid client type');
  }

  const existingClient = await clientsService.getClientByName(companyName);
  if (existingClient) {
    throw new Error('Failed! Client already exists');
  }

  return clientsService.createClient({
    companyName,
    address,
    city,
    state,
    zip,
    headcount,
    type
  });
};

function getClients(fields) {
  return clientsService.getClients(fields);
}

async function getClient(id) {
  if (!id) {
    throw new Error('ID is required');
  }

  const client = await clientsService.getClientById(id);
  if (!client) {
    throw new Error('Client not found');
  }

  return client;
}

async function editClient(id, fields) {
  if (!id) {
    throw new Error('ID is required for editing a client');
  }

  if (fields.headcount && !validateHeadcount(fields.headcount)) {
    throw new Error('Headcount must be a number');
  }

  if (!validateClientType(fields.type)) {
    throw new Error('Invalid client type');
  }

  const existingClientName = await clientsService.getClientByName(fields.companyName);
  if (existingClientName) {
    throw new Error('Failed! The new company name is already in use!');
  }

  return clientsService.editClient(id, fields);
}

async function deleteClient(id) {
  if (!id) {
    throw new Error('Client ID is required');
  }

  return clientsService.deleteClient(id);
}
