const router = require('express').Router();
const _ = require('lodash');

const logger = require('../../logger');
const membersController = require('../../controllers/members');

/* ****** route definitions ****** */
router.post('/create', createMember);
router.get('/:id', getMember);
router.put('/:id', editMember);
router.put('/:id/change-client', changeClient)
router.delete('/:id', deleteMember);

module.exports = router;

async function createMember(req, res) {
  try {
    const { name, email, phone, clientId } = req.body;
    const response = await membersController.createMember({ 
      name,
      email,
      phone,
      clientId
    });
    res.status(201).send(response);
  } catch (err) {
    logger.error(err.message);
    res.status(500).send({ error: err.message });
  }
}

async function changeClient(req, res) {
  try {
    const memberId = _.get(req, 'params.id');
    const { clientId } = req.body;
    const response = await membersController.changeClient(memberId, clientId);
    res.status(200).send(response);
  } catch (err) {
    logger.error(err.message);
    res.status(500).send({ error: err.message });
  }
}

async function getMember(req, res) {
  try {
    const memberId = _.get(req, 'params.id');
    const response = await membersController.getMember(memberId);
    res.status(200).json(response);
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ error: err.message });
  }
}

async function editMember(req, res, next) {
  try {
    const memberId = _.get(req, 'params.id');
    const { name, email, phone } = req.body;
    const response = await membersController.editMember(memberId, {
      name: _.capitalize(name),
      email,
      phone,
    });
    res.status(200).send(response);
  } catch (err) {
    logger.error(err.message);
    next(err);
  }
}

async function deleteMember(req, res, next) {
  try {
    const memberId = _.get(req, 'params.id');
    await membersController.deleteMember(memberId);
    res.status(200).send({ success: true });
  } catch (err) {
    logger.error(err.message);
    next(err);
  }
}
