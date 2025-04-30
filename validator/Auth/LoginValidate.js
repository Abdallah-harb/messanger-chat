const {body} = require('express-validator');

const LoginValidate = ()=>[

    body('email')
        .notEmpty().withMessage('email filed is required')
        .isEmail().withMessage('email filed must be valied email'),

    body('password')
        .notEmpty().withMessage('password filed is required')
        .isString().withMessage('password filed must be string')
        .isLength({max:100}).withMessage('max value for password is 100 character ')
];

module.exports={LoginValidate}