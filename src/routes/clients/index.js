const router = require('express').Router();
const _ = require('lodash');

const logger = require('../../logger');
const clientsController = require('../../controllers/clients');

/* ****** route definitions ****** */
router.post('/create', createClient);
router.get('/', getClients);
router.get('/:id', getClient);
router.put('/:id', editClient);
router.delete('/:id', deleteClient);

module.exports = router;

async function createClient(req, res) {
  try {
    const { companyName, address, city, state, zip, headcount = 0, type } = req.body;
    const response = await clientsController.createClient({ 
      companyName,
      address,
      city,
      state,
      zip,
      headcount,
      type 
    });
    res.status(201).send(response);
  } catch (err) {
    logger.error(err.message);
    res.status(500).send({ error: err.message });
  }
}

async function getClients(req, res) {
  try {
    const clients = await clientsController.getClients();
    res.status(200).json(clients);
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ error: err.message });
  }
}

async function getClient(req, res) {
  try {
    const clientId = _.get(req, 'params.id');
    const client = await clientsController.getClient(clientId);
    res.status(200).json(client);
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ error: err.message });
  }
}

async function editClient(req, res, next) {
  try {
    const clientId = _.get(req, 'params.id');
    const { companyName, address, city, state, zip, headcount, type } = req.body;
    const response = await clientsController.editClient(clientId, {
      companyName: _.capitalize(companyName),
      address,
      city,
      state,
      zip,
      headcount,
      type
    });
    res.status(200).send(response);
  } catch (err) {
    logger.error(err.message);
    next(err);
  }
}

async function deleteClient(req, res, next) {
  try {
    const clientId = _.get(req, 'params.id');
    await clientsController.deleteClient(clientId);
    res.status(200).send({ success: true });
  } catch (err) {
    logger.error(err.message);
    next(err);
  }
}
