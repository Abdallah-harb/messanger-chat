const {body} = require('express-validator');
const User = require('../../model/UserModel');
const {error} = require("winston");
const RegisterValidate = ()=>[

    body('name')
        .notEmpty().withMessage('name filed is required')
        .isLength({min:3,max:50}).withMessage('min character for name is : 3 , and max 50 '),

    body('email')
        .notEmpty().withMessage('email filed is required')
        .isEmail().withMessage('email not valid ')
        .custom(async value=>{
            const checkEmailExists = await User.findOne({email:value});
            if (checkEmailExists)
                throw new Error('email already be taken');
            else
                return true
        }),

    body('password')
        .notEmpty().withMessage('Password filed is required')
        .isLength({min:6,max:100}).withMessage('min Character for Password is 6 '),

    body('passwordConfirmation')
        .custom((value,{req})=>{
            if (value !== req.body.password)
                    throw new Error('password confirmation not match ')
            else
                return true
        })
];

module.exports={RegisterValidate}