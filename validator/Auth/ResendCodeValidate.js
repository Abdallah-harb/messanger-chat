const {body} = require('express-validator');
const User = require('../../model/UserModel');
const ResendCodeValidate = ()=>[

    body('email')
        .notEmpty().withMessage('email filed is required')
        .isEmail().withMessage('Email not valid')
        .custom( async value =>{
            const checkMail = await User.findOne({email:value});
            if(!checkMail){
                throw new Error('these email not exists, please enter valid email address');
            }
        })
]

module.exports={ResendCodeValidate}