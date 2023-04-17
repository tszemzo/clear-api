const mongoose = require("mongoose")
const { CLIENT_TYPE } = require("../utils/constants")

const clientSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true
  },
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  zip: {
    type: String,
  },
  headcount: {
    type: Number,
    min: 0,
  },
  type: {
    type: String,
    enum: Object.values(CLIENT_TYPE),
  }
},
{ timestamps: true });

// Redefinind how we return Client schema object to avoid _id 
clientSchema.method("toJSON", function() {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

const Client = mongoose.model('Client', clientSchema);

module.exports = { Client };
