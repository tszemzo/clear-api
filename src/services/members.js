const _ = require('lodash');
const { Member } = require('../models/member');

const self = {
  createMember,
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
