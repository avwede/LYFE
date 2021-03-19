const mongoose = require('mongoose');

const emergencyContactSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required for Emergency Contact.'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required for Emergency Contact.'],
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required for Emergency Contact.'],
  },
  email: {
    type: String,
    unique: true,
    validate: {
      validator: (val) =>
        /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/.test(
          val
        ),
      message: '{VALUE} is not a valid email address.',
    },
  },
  relation: {
    type: String,
    required: [true, 'Relation is required for Emergency Contact.'],
  },
});

module.exports = emergencyContactSchema;
