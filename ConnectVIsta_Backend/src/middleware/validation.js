const { check, validationResult } = require('express-validator');

const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({
      success: false,
      errors: errors.array()
    });
  };
};

const signupValidation = validate([
  check('email').isEmail().normalizeEmail(),
  check('phone').isMobilePhone(),
  check('password').isLength({ min: 6 }),
  check('role').isIn(['seeker', 'provider'])
]);

const loginValidation = validate([
  check('email').isEmail().normalizeEmail(),
  check('password').notEmpty()
]);

module.exports = {
  signupValidation,
  loginValidation
};