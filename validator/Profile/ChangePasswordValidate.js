const {body} = require('express-validator');

const ChangePasswordValidate = ()=>[

    body('current_password')
        .notEmpty().withMessage('current password filed is required')
        .isString().withMessage('current password must ne string')
        .isLength({max:100}).withMessage('Max character for current password is 100 char'),

    body('password')
        .notEmpty().withMessage(' password filed is required')
        .isString().withMessage(' password must ne string')
        .isLength({min:6,max:100}).withMessage('Min character is 6 char,Max is 100 char'),

    body('password_confirmation')
        .notEmpty().withMessage('Password confirmation field is required')
        .isString().withMessage('Password confirmation must be a string')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password confirmation does not match');
            }
            return true;
        })
];

module.exports={ChangePasswordValidate}