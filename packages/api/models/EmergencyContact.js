const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const emergencyContactSchema = new Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required.'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required.'],
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required.'],
  },
  email: {
    type: String,
    unique: true,
    validate: {
      validator: (val) =>
        /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/.test(
          val
        ),
      message: '{VALUE} is not a valid email address',
    },
  },
  relation: {
    type: String,
    required: [true, 'Relation is required.'],
  },
});

module.exports = model('EmergencyContact', emergencyContactSchema);
