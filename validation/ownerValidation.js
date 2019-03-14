const { checkSchema } = require('express-validator/check');

module.exports = checkSchema({
  owner: {
    // The location of the field, can be one or more of body, cookies, headers, params or query.
    // If omitted, all request locations will be checked
    in: ['headers'],
    exists: true,
    errorMessage: 'Missing Owner'
  },
});
