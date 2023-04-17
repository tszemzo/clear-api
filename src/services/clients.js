const _ = require('lodash');
const { Client } = require('../models/client');

const self = {
  createClient,
  getClients,
  getClientById,
  getClientByName,
  editClient,
  deleteClient,
};

module.exports = self;

async function createClient({ companyName, address, city, state, zip, headcount = 0, type}) {
  const client = new Client({
    companyName,
    address,
    city,
    state,
    zip,
    headcount,
    type,
  });

  return client.save();
}

function getClients() {
  return Client.find();
}

function getClientById(id) {
  return Client.findById(id);
}

function getClientByName(companyName) {
  return Client.findOne({
    companyName,
  });
}

async function editClient(id, fields) {
  return Client.findByIdAndUpdate(id, fields, { new: true })
}

async function deleteClient(id) {
  return Client.findByIdAndDelete(id);
}
