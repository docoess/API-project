const { check } = require('express-validator');
const { handleValidationErrors } = require('./validation');

const validateGroup = [
  check('name')
    .notEmpty()
    .isLength({max: 60})
    .withMessage('Name must be 60 characters or less'),
  check('about')
    .notEmpty()
    .isLength({min: 50})
    .withMessage('About must be 50 characters or more'),
  check('type')
    .notEmpty()
    .isIn(['Online', 'In person'])
    .withMessage("Type must be 'Online' or 'In person'"),
  check('private')
    .notEmpty()
    .isBoolean()
    .withMessage('Private must be a boolean'),
  check('city')
    .exists()
    .notEmpty()
    .withMessage('City is required'),
  check('state')
    .exists()
    .notEmpty()
    .withMessage('State is required'),
  handleValidationErrors
];

const validateVenue = [
  check('address')
    .exists()
    .notEmpty()
    .withMessage('Street address is required'),
  check('city')
    .exists()
    .notEmpty()
    .withMessage('City is required'),
  check('state')
    .exists()
    .notEmpty()
    .withMessage('State is required'),
  check('lat')
    .exists()
    .isDecimal()
    .withMessage('Latitude is not valid'),
  check('lng')
    .exists()
    .isDecimal()
    .withMessage('Longitude is not valid'),
  handleValidationErrors
];

const validateEvent = [
  check('venueId')
    .exists()
    .withMessage('Venue does not exist'),
  check('name')
    .exists()
    .notEmpty()
    .isLength({min: 5})
    .withMessage('Name must be at least 5 characters'),
  check('type')
    .exists()
    .isIn(['Online', 'In person'])
    .withMessage('Type must be Online or In person'),
  check('capacity')
    .exists()
    .isInt()
    .withMessage('Capacity must be an integer'),
  check('price')
    .exists()
    .isNumeric()
    .withMessage('Price is invalid'),
  check('description')
    .exists()
    .notEmpty()
    .withMessage('Description is required'),
  handleValidationErrors
  ];

  validateQueryParams = [
    check('page')
      .optional({
        values: 'undefined'
      })
      .isInt({min: 1})
      .withMessage('Page must be greater than or equal to 1'),
    check('size')
      .optional()
      .isInt({min: 1})
      .withMessage('Size must be greater than or equal to 1'),
    check('name')
      .optional()
      .isString()
      .withMessage('Name must be a string'),
    handleValidationErrors
  ];

  module.exports = { validateEvent,
                     validateGroup,
                     validateVenue,
                     validateQueryParams
                   };
