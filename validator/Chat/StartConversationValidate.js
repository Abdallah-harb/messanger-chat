const {body} = require('express-validator');
const User = require('../../model/UserModel');
const MessageTypesEnum = require('../../Enum/MessageTypesEnum');
const StartConversationValidate = [
    body('message')
        .notEmpty().withMessage('message filed is required '),

    body('receiver_id')
        .notEmpty().withMessage('receiver_id is required ')
        .custom(async (value)=>{
            const user = await User.findById(value);
            if(!user){
                return Error('receiver_id is not exists ')
            }
        }),

    body('message_type')
        .optional()
        .isIn(Object.values(MessageTypesEnum)).withMessage(`message type must be in : ${Object.values(MessageTypesEnum).join(" ,")} `)

];

module.exports={StartConversationValidate}