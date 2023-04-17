const _ = require('lodash');

const membersService = require('../services/members');
const clientsService = require('../services/clients');
const { validateEmail } = require('../utils/validator');
const { MAX_NOTE_LENGTH, MAX_NOTES } = require('../utils/constants');

const self = {
  createMember,
  createNote,
  changeClient,
  getMember,
  editMember,
  deleteMember,
};

module.exports = self;

async function createMember({ name, email, phone, clientId } = {}) {
  if (!name || !email || !clientId) {
    throw new Error('Invalid member data. Name, email and client ID are required');
  }

  if (!validateEmail(email)) {
    throw new Error('Invalid email');
  }

  const existingMember = await membersService.getMemberByEmail(email);
  if (existingMember) {
    throw new Error('Failed! Member already exists');
  }

  const existingClient = await clientsService.getClientById(clientId);
  if (!existingClient) {
    throw new Error('Failed! Client does not exist');
  }

  return membersService.createMember({
    name,
    email,
    phone,
    clientId
  });
};

async function createNote(memberId, note) {
  if (!memberId || !note) {
    throw new Error('Invalid data. Member ID and note are required');
  }

  if (_.size(note) > MAX_NOTE_LENGTH) {
    throw new Error(`Note is too long. Maximum length is ${MAX_NOTE_LENGTH} characters`);
  }

  const member = await membersService.getMemberById(memberId);
  if (!member) {
    throw new Error('Member not found');
  }

  if (_.size(member.notes) > MAX_NOTES) {
    throw new Error(`Maximum number of notes (${MAX_NOTES}) reached`);
  }

  return membersService.createNote(member, note);
};

async function changeClient(id, newClientId) {
  if (!id) {
    throw new Error('ID is required for editing a member');
  }

  if (!newClientId) {
    throw new Error('Client ID is required for changing client');
  }

  const existingClient = await clientsService.getClientById(newClientId);
  if (!existingClient) {
    throw new Error('Failed! The new client for this member does not exist');
  }

  return membersService.editMember(id, { clientId: newClientId });
}

async function editMember(id, fields) {
  if (!id) {
    throw new Error('ID is required for editing a member');
  }

  if (fields.email && !validateEmail(fields.email)) {
    throw new Error('Invalid email');
  }

  return membersService.editMember(id, fields);
}

async function getMember(id) {
  if (!id) {
    throw new Error('ID is required');
  }

  const member = await membersService.getMemberById(id);
  if (!member) {
    throw new Error('Member not found');
  }

  return member;
}

function deleteMember(id) {
  if (!id) {
    throw new Error('Member ID is required');
  }

  return membersService.deleteMember(id);
}
