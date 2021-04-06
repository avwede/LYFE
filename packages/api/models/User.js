require('dotenv').config();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const randomBytes = require('randombytes');
const emergencyContactSchema = require('./EmergencyContact.embeddedModel');
const reminderSchema = require('./Reminder.embeddedModel');
const saltRounds = 12;
const { JWT_SECRET } = process.env;

/**
 * @openapi
 *
 * components:
 *  schemas:
 *    User:
 *      title: User
 *      type: object
 *      required:
 *        - firstName
 *        - lastName
 *        - email
 *        - password
 *      properties:
 *        firstName:
 *          type: string
 *          example: John
 *        lastName:
 *          type: string
 *          example: Smith
 *        email:
 *          type: string
 *          format: email
 *        password:
 *          type: string
 *          format: password
 *          example: Password123#
 *        passwordResetToken:
 *          type: string
 *          example: cb68ea67877553f1047c9a87c1f3e98e884f2ef36850bdcf800b728c3a55be83
 *        passwordResetExpiration:
 *          type: string
 *          format: date-time
 *        verified:
 *          type: boolean
 *          default: false
 *        verificationToken:
 *          type: string
 *          example: cb68ea67877553f1047c9a87c1f3e98e884f2ef36850bdcf800b728c3a55be83
 *        dateOfBirth:
 *          type: string
 *          format: date
 *        allergies:
 *          type: array
 *          items:
 *            type: string
 *          example: ['Peanuts']
 *        emergencyContact:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/EmergencyContact'
 *        reminders:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/Reminder'
 *        courses:
 *          type: array
 *          items:
 *            type: objectId
 *          example: ['5b1ed13e8cea93c6ba72b1da', '5b1ed13e8cea93c6ba72b1db']
 */
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required for User.'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required for User'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Email address is required for User'],
    validate: {
      validator: (val) =>
        /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/.test(
          val
        ),
      message: '{VALUE} is not a valid email address.',
    },
  },
  password: {
    type: String,
    required: [true, 'Password is required for User.'],
    minlength: [8, 'Password must be at least 8 characters.'],
    validate: {
      validator: (val) =>
        /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9])(?=\S*?[!@#$%&]).{8,})\S$/.test(
          val
        ),
      message:
        'Password must contain 1 uppercase letter, 1 lowercase letter, 1 digit and 1 special character: !, @, #, $, %, &.',
    },
  },
  passwordResetToken: {
    type: String,
  },
  passwordResetExpiration: {
    type: Date,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
  },
  dateOfBirth: Date,
  allergies: [String],
  emergencyContacts: [emergencyContactSchema],
  reminders: [reminderSchema],
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
});

/**
 * hashPassword: Pre save hook to hash user password before saving to database.
 * 
 * @param {Function} next Express middleware function; call the next function in the stack.
 */
userSchema.pre('save', function hashPassword(next) {
  // Prevents rehashing an already hashed password on save. Only hash if user is new or password
  // has been modified.
  if (!this.isModified('password'))
    return next();

  bcrypt.hash(this.password, saltRounds, (err, hash) => {
    if (err) next(err);
    this.password = hash;
    next();
  });
});

/**
 * Validate the user password; compare the plain text password to the hashed password.
 * 
 * @param {String} password The user's password.
 * @returns {Promise} A promise that resolves to the comparison result.
 */
userSchema.methods.isValidPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

/**
 * Generate a new JSON web token with the user id embedded.
 * 
 * @returns {String} The JSON web token.
 */
userSchema.methods.generateJWT = function () {
  const payload = { id: this._id };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
};

/**
 * Generate a verification token for this user.
 * 
 * @returns {Promise} A Promise that will resolve to the saved user document.
 */
userSchema.methods.generateVerificationToken = function () {
  this.verificationToken = randomBytes(32).toString('hex');
  return this.save();
};

/**
 * Generate a password reset token for this user.
 * 
 * @returns {Promise} A Promise that will resolve to the saved user document.
 */
userSchema.methods.generatePasswordResetToken = function () {
  const expiresInHours = 1;
  const msPerHour = 3600000;

  this.passwordResetToken = randomBytes(32).toString('hex');
  this.passwordResetExpiration = Date.now() + (expiresInHours * msPerHour);

  return this.save();
};

/**
 * Update this user's password and disable their password reset token.
 * 
 * @param {String} password The user's password.
 * @returns {Promise} A Promise that will resolve to the saved user document.
 */
userSchema.methods.resetPassword = function (password) {
  this.password = password;
  this.passwordResetToken = null;
  this.passwordResetExpiration = null;
  return this.save();
};

module.exports = mongoose.model('User', userSchema);