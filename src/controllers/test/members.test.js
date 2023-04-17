const sinon = require('sinon');
const chai = require('chai');

const { expect } = chai;

const { 
  fakeMember,
  fakeClient,

  MEMBER_ID,
  CLIENT_ID,
} = require('./mockData/data');

const { MAX_NOTE_LENGTH, MAX_NOTES } = require('../../utils/constants');

const membersService = require('../../services/members');
const clientsService = require('../../services/clients');

describe('controllers/members', () => {
  let membersController;
  let membersServiceStub;
  let clientsServiceStub;

  before(() => {
    // import file to test
    membersController = require('../members');
  });

  afterEach(() => {
    if (membersServiceStub) {
      membersServiceStub.restore();
    }

    if (clientsServiceStub) {
      clientsServiceStub.restore();
    }
  });

  describe('getMember', () => {
    it('should throw an error when no member ID provided', async () => {
      try {
        await membersController.getMember();
        expect('this should not have been called').to.be.false;
      } catch (err) {
        expect(err.message).to.eql('ID is required');
      }
    });

    it('should throw an error when member was not found', async () => {
      membersServiceStub = sinon.stub(membersService, 'getMemberById').returns(null);

      try {
        await membersController.getMember(MEMBER_ID);
        expect('this should not have been called').to.be.false;
      } catch (err) {
        expect(membersServiceStub.calledOnce).to.be.true;
        expect(err.message).to.eql('Member not found');
      }
    });

    it('should return the member requested', async () => {
      membersServiceStub = sinon.stub(membersService, 'getMemberById').returns(fakeMember);

      const results = await membersController.getMember(MEMBER_ID);
      expect(membersServiceStub.calledOnce).to.be.true;
      expect(results).to.equal(fakeMember);
    });
  });

  describe('deleteMember', () => {
    it('should throw an error when no member ID provided', async () => {
      try {
        await membersController.deleteMember();
        expect('this should not have been called').to.be.false;
      } catch (err) {
        expect(err.message).to.eql('Member ID is required');
      }
    });

    it('should delete the member requested', async () => {
      membersServiceStub = sinon.stub(membersService, 'deleteMember').returns(fakeMember);

      const deleted = await membersController.deleteMember(MEMBER_ID);
      expect(membersServiceStub.calledOnce).to.be.true;
      expect(deleted).to.equal(fakeMember);
    });
  });

  describe('changeClient', () => {
    it('should throw an error when no member ID provided', async () => {
      try {
        await membersController.changeClient();
        expect('this should not have been called').to.be.false;
      } catch (err) {
        expect(err.message).to.eql('ID is required for editing a member');
      }
    });

    it('should throw an error when no new client ID provided', async () => {
      try {
        await membersController.changeClient(MEMBER_ID);
        expect('this should not have been called').to.be.false;
      } catch (err) {
        expect(err.message).to.eql('Client ID is required for changing client');
      }
    });

    it('should throw an error when new client was not found', async () => {
      clientsServiceStub = sinon.stub(clientsService, 'getClientById').returns(null);

      try {
        await membersController.changeClient(MEMBER_ID, CLIENT_ID);
        expect('this should not have been called').to.be.false;
      } catch (err) {
        expect(clientsServiceStub.calledOnce).to.be.true;
        expect(err.message).to.eql('Failed! The new client for this member does not exist');
      }
    });

    it('should change the client properly', async () => {
      const fakeMemberWithNewClient = { ...fakeMember, clientId: CLIENT_ID };
      clientsServiceStub = sinon.stub(clientsService, 'getClientById').returns(fakeClient);
      membersServiceStub = sinon.stub(membersService, 'editMember').returns(fakeMemberWithNewClient);

      const edited = await membersController.changeClient(MEMBER_ID, { client: CLIENT_ID });
      expect(clientsServiceStub.calledOnce).to.be.true;
      expect(membersServiceStub.calledOnce).to.be.true;
      expect(edited).to.equal(fakeMemberWithNewClient);
    });
  });

  describe('createNote', () => {
    it('should throw an error when no member ID provided', async () => {
      try {
        await membersController.createNote();
        expect('this should not have been called').to.be.false;
      } catch (err) {
        expect(err.message).to.eql('Invalid data. Member ID and note are required');
      }
    });

    it('should throw an error when no note provided', async () => {
      try {
        await membersController.createNote(MEMBER_ID);
        expect('this should not have been called').to.be.false;
      } catch (err) {
        expect(err.message).to.eql('Invalid data. Member ID and note are required');
      }
    });

    it('should throw an error when the size of the note is too big', async () => {
      try {
        const veryLongNote = 'a'.repeat(MAX_NOTE_LENGTH + 1);
        await membersController.createNote(MEMBER_ID, veryLongNote);
        expect('this should not have been called').to.be.false;
      } catch (err) {
        expect(err.message).to.eql(`Note is too long. Maximum length is ${MAX_NOTE_LENGTH} characters`);
      }
    });

    it('should throw an error when member was not found', async () => {
      membersServiceStub = sinon.stub(membersService, 'getMemberById').returns(null);

      try {
        await membersController.createNote(MEMBER_ID, 'A great note');
        expect('this should not have been called').to.be.false;
      } catch (err) {
        expect(membersServiceStub.calledOnce).to.be.true;
        expect(err.message).to.eql('Member not found');
      }
    });

    it('should throw an error when the member reached the maximum of notes available', async () => {
      const fakeMemberWithMaxNotes = { ...fakeMember, notes: Array.from('notes'.repeat(MAX_NOTE_LENGTH + 1)) };
      membersServiceStub = sinon.stub(membersService, 'getMemberById').returns(fakeMemberWithMaxNotes);

      try {
        await membersController.createNote(MEMBER_ID, 'A great note');
        expect('this should not have been called').to.be.false;
      } catch (err) {
        expect(membersServiceStub.calledOnce).to.be.true;
        expect(err.message).to.eql(`Maximum number of notes (${MAX_NOTES}) reached`);
      }
    });

    it('should create the note for the member correctly', async () => {
      const newNote = 'A great note';
      const fakeMemberWithNewNote = { ...fakeMember, notes: [{ note: newNote }] };
      membersServiceStub = sinon.stub(membersService, 'getMemberById').returns(fakeMember);
      membersServiceStub = sinon.stub(membersService, 'createNote').returns(fakeMemberWithNewNote);

      const results = await membersController.createNote(MEMBER_ID, newNote);
      expect(membersServiceStub.calledOnce).to.be.true;
      expect(results.notes[0].note).to.equal(newNote);
    });
  });

  describe('createMember', () => {
    it('should throw an error when no name, email and clientId provided', async () => {
      try {
        await membersController.createMember();
        expect('this should not have been called').to.be.false;
      } catch (err) {
        expect(err.message).to.eql('Invalid member data. Name, email and client ID are required');
      }
    });

    it('should throw an error when no email and clientId provided', async () => {
      try {
        await membersController.createMember({ name: 'John Doe' });
        expect('this should not have been called').to.be.false;
      } catch (err) {
        expect(err.message).to.eql('Invalid member data. Name, email and client ID are required');
      }
    });

    it('should throw an error when no clientId provided', async () => {
      try {
        await membersController.createMember({ name: 'John Doe', email: 'johndoe@gmail.com' });
        expect('this should not have been called').to.be.false;
      } catch (err) {
        expect(err.message).to.eql('Invalid member data. Name, email and client ID are required');
      }
    });

    it('should throw an error when invalid email provided', async () => {
      const invalidEmail = 'something-invalid';
      try {
        await membersController.createMember({ name: 'John Doe', email: invalidEmail, clientId: CLIENT_ID });
        expect('this should not have been called').to.be.false;
      } catch (err) {
        expect(err.message).to.eql('Invalid email');
      }
    });

    it('should throw an error when member with the email provided already exists', async () => {
      membersServiceStub = sinon.stub(membersService, 'getMemberByEmail').returns(fakeMember);

      try {
        await membersController.createMember({ name: fakeMember.name, email: fakeMember.email, clientId: CLIENT_ID });
        expect('this should not have been called').to.be.false;
      } catch (err) {
        expect(membersServiceStub.calledOnce).to.be.true;
        expect(err.message).to.eql('Failed! Member already exists');
      }
    });

    it('should throw an error when the client provided for the new member does not exist', async () => {
      membersServiceStub = sinon.stub(membersService, 'getMemberByEmail').returns(null);
      clientsServiceStub = sinon.stub(clientsService, 'getClientById').returns(null);

      try {
        await membersController.createMember({ name: fakeMember.name, email: fakeMember.email, clientId: CLIENT_ID });
        expect('this should not have been called').to.be.false;
      } catch (err) {
        expect(membersServiceStub.calledOnce).to.be.true;
        expect(clientsServiceStub.calledOnce).to.be.true;
        expect(err.message).to.eql('Failed! Client does not exist');
      }
    });

    it('should create the member correctly', async () => {
      getMemberStub = sinon.stub(membersService, 'getMemberByEmail').returns(null);
      clientsServiceStub = sinon.stub(clientsService, 'getClientById').returns(fakeClient);
      createMemberStub = sinon.stub(membersService, 'createMember').returns(fakeMember);

      const created = await membersController.createMember({ name: fakeMember.name, email: fakeMember.email, clientId: CLIENT_ID });
      expect(getMemberStub.calledOnce).to.be.true;
      expect(clientsServiceStub.calledOnce).to.be.true;
      expect(createMemberStub.calledOnce).to.be.true;
      expect(created).to.equal(fakeMember);
    });
  });
});
