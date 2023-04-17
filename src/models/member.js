const mongoose = require("mongoose")

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
  },
  notes: {
    type: Array,
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
},
{ timestamps: true });

// Redefinind how we return Client schema object to avoid _id 
memberSchema.method("toJSON", function() {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

const Member = mongoose.model('Member', memberSchema);

module.exports = { Member };
