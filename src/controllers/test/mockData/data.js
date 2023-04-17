const MEMBER_ID = 999;
const CLIENT_ID = 888;

const fakeMember = {
  _id: MEMBER_ID,
  name: 'John Doe',
  email: 'email@test.com',
  phone: '123 456',
  clientId: CLIENT_ID,
  notes: [],
  createdAt: "2022-12-07T06:33:42.354Z",
  updatedAt: "2022-12-07T06:33:42.354Z",
};

const fakeClient = {
  _id: CLIENT_ID,
  companyName: 'Nike',
  address: '123 Main St',
  city: 'Portland',
  state: 'OR',
  zip: '97201',
  headcount: '1000',
  type: 'private',
  createdAt: "2022-12-07T06:33:42.354Z",
  updatedAt: "2022-12-07T06:33:42.354Z",
};

module.exports = {
  fakeClient,
  fakeMember,

  MEMBER_ID,
  CLIENT_ID,
};
