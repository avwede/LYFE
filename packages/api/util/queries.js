/**
 * Perform a partial update on the document with the given fields. Must call save for changes to
 * persist.
 *
 * @param {Document|Subdocument} doc Mongoose document or subdocument.
 * @param {Object} fields The collection of updated fields for this document.
 * @returns {Document|Subdocument} The updated document.
 */
const partialUpdate = (doc, fields) => {
  Object.keys(fields).forEach((key) => {
    doc[key] = fields[key];
  });

  return doc;
};

module.exports = {
  partialUpdate,
};
