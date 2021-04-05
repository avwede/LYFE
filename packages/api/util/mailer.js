require('dotenv').config();

const sgMail = require('@sendgrid/mail');
const { SENDGRID_API_KEY, FROM_EMAIL } = process.env;

/**
 * Send an email through SendGrid's API mail endpoint.
 * 
 * @param {String} to The recipient's email address.
 * @param {String} subject The email subject.
 * @param {String} body The contents of the email. May be HTML formatted.
 * @returns {Promise} The pending email request.
 */
const sendEmail = (to, subject, body) => {
  const msg = {
    to: to,
    from: FROM_EMAIL,
    subject: subject,
    html: body,
  };

  sgMail.setApiKey(SENDGRID_API_KEY);
  return sgMail.send(msg);
};

module.exports = {
  sendEmail,
};