const _ = require('lodash');

const { Member } = require('../models/member');
const { MAX_NOTES } = require('../utils/constants');

const self = {
  createMember,
  createNote,
  getMemberByEmail,
  getMemberById,
  editMember,
  deleteMember,
};

module.exports = self;

async function createMember({ name, email, phone, clientId }) {
  const member = new Member({
    name,
    email,
    phone,
    clientId,
  });

  return member.save();
}

async function createNote(id, note) {
  const member = await getMemberById(id);
  if (!member) {
    throw new Error('Member does not exist');
  }

  if (_.size(member.notes) > MAX_NOTES) {
    throw new Error(`Maximum number of notes (${MAX_NOTES}) reached`);
  }

  member.notes.push({ note, date: new Date() });
  return member.save();
}

function getMemberByEmail(email) {
  return Member.findOne({
    email,
  });
}

function getMemberById(id) {
  return Member.findById(id);
}

function editMember(id, fields) {
  return Member.findByIdAndUpdate(id, fields, { new: true })
}

function deleteMember(id) {
  return Member.findByIdAndDelete(id);
}
