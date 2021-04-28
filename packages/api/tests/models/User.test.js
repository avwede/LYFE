require('dotenv').config();

const mongoose = require('mongoose');
const User = require('../../models/User');
const { testUser, validEmails, invalidEmails } = require('../testData');
const { MONGODB_URI_TEST } = process.env;

describe('User Schema', () => {
  describe('*** Validation ***', () => {
    it('should require firstName, lastName, email, password', (done) => {
      const user = new User();

      user.validate((err) => {
        expect(err.errors).toHaveProperty('firstName');
        expect(err.errors).toHaveProperty('lastName');
        expect(err.errors).toHaveProperty('email');
        expect(err.errors).toHaveProperty('password');
        done();
      });
    });

    it('should disallow invalid email formats', (done) => {
      invalidEmails.forEach((email) => {
        const invalidData = Object.assign({}, testUser, { email });
        const user = new User(invalidData);

        user.validate((err) => {
          expect(err.errors).toHaveProperty('email');
          done();
        });
      });

      validEmails.forEach((email) => {
        const validData = Object.assign({}, testUser, { email });
        const user = new User(validData);

        user.validate((err) => {
          expect(err).toBeNull();
          done();
        });
      });
    });

    it('should disallow passwords shorter than 8 characters', (done) => {
      const invalidData = Object.assign({}, testUser, {
        password: 'Pa3&',
      });
      const user = new User(invalidData);

      user.validate((err) => {
        expect(err.errors).toHaveProperty('password');
        done();
      });
    });

    it('should force passwords to have 1 uppercase letter, 1 lowercase letter, 1 digit and 1 special character', (done) => {
      const invalidData = Object.assign({}, testUser, {
        password: 'Password123',
      });
      const user = new User(invalidData);

      user.validate((err) => {
        expect(err.errors).toHaveProperty('password');
        done();
      });
    });
  });

  describe('*** Middleware/Methods ***', () => {
    beforeAll(() => {
      return mongoose
        .connect(MONGODB_URI_TEST, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex: true,
          useFindAndModify: false,
        })
        .then(() => console.log('\n*** CONNECTED to database ***\n'))
        .catch((err) =>
          console.log('\n*** ERROR connecting to database ***\n', err)
        );
    });

    afterAll(() => {
      return mongoose
        .disconnect()
        .then(() => console.log('\n*** DISCONNECTED from database ***\n'))
        .catch((err) =>
          console.log('\n*** ERROR disconnecting from database ***\n', err)
        );
    });

    afterEach(() => {
      return User.deleteMany({})
        .then(() => console.log('\n*** CLEAR database ***\n'))
        .catch((err) =>
          console.log('\n*** ERROR clearing database ***\n', err)
        );
    });

    it('should hash password before saving', async () => {
      const user = await User.create(testUser);

      expect(user.password).not.toBe(testUser.password);
    });
  });
});