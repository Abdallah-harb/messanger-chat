const {body} = require('express-validator');
const User = require('../../model/UserModel');
const {MessageTypesEnum} = require('../../Enum/MessageTypesEnum');

const StartConversationValidate = (req,res)=>[
    body('message')
        .if((value, { req }) => req.body.message_type === MessageTypesEnum.TEXT)
        .notEmpty().withMessage('message field is required when message_type is TEXT'),

    body('receiver_id')
        .notEmpty().withMessage('receiver_id is required ')
        .custom(async (value)=>{
            const user = await User.findById(value);
            if(!user){
                return Error('receiver_id is not exists ')
            }
        }),
    body('avatar')
        .if((value, { req }) => req.body.message_type === MessageTypesEnum.IMAGE)
        .custom((value, { req }) => {
            if (!req.file) {
                throw new Error('file field is required when message_type is IMAGE');
            }
            return true;
        }),

    body('message_type')
        .notEmpty().withMessage('message_type is required')
        .isIn(Object.values(MessageTypesEnum)).withMessage(`message type must be in : ${Object.values(MessageTypesEnum).join(" ,")} `)

];

module.exports={StartConversationValidate}