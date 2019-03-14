const { checkSchema } = require('express-validator/check');

module.exports = checkSchema({
  owner: {
    // The location of the field, can be one or more of body, cookies, headers, params or query.
    // If omitted, all request locations will be checked
    in: ['headers'],
    exists: true,
    errorMessage: 'Missing Owner'
  },
  title: {
    in: ['body'],
    isLength: {
      errorMessage: 'Title should be at least 5 chars long',
      options: { min: 5 }
    }
  },
  responsible: {
    in: ['body'],
    isLength: {
      errorMessage: 'Responsible should be at least 5 chars long',
      options: { min: 5 }
    }
  },
  status: {
    in: ['body'],
    isIn: {
        options: [['new', 'in progress', 'done']]
    }
  },
});
