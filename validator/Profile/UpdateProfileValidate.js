const {body} = require('express-validator');

const UpdateProfileValidate = (req,res)=>[
    body('name')
        .notEmpty().withMessage('name filed is required')
        .isString().withMessage('name filed must be string ')
        .isLength({max:100}).withMessage('max character for name filed is 100 char'),

    body('phone')
        .optional({checkFalsy:true})
        .isMobilePhone().withMessage('phone filed must be availed mobile number '),

    body('avatar')
        .optional()
        .custom((value, { req }) => {

        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg','image/webp'];
        if (!allowedTypes.includes(req.file.mimetype)) {
            throw new Error('Avatar must be jpeg, jpg, ,webp , or png');
        }

        if (req.file.size > 2 * 1024 * 1024) {
            throw new Error('Avatar must be less than 2MB');
        }

        return true;
    })
]

module.exports={UpdateProfileValidate}