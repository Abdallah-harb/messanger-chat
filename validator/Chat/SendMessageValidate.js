const {body} = require('express-validator');
const Conversation = require('../../model/ConversationModel');
const User = require('../../model/UserModel');
const MessageTypesEnum = require('../../Enum/MessageTypesEnum');
const SendMessageValidate = ()=>[

    body('conversation_id')
        .notEmpty().withMessage('conversation_id is required')
        .custom(async (value)=>{
            const conversation = await Conversation.findById(value);
            if (!conversation){
                return Error('conversation_id not exist');
            }
        }),

    body('receiver_id')
        .notEmpty().withMessage('receiver_id is required')
        .custom(async (value)=>{
            const user = await User.findById(value);
            if(!user){
                return Error('receiver_id filed is required');
            }
        }),
    body('message')
        .notEmpty().withMessage('message filed is required'),

    body('message_type')
        .optional()
        .isIn(Object.values(MessageTypesEnum)).withMessage(`message type must be in : ${Object.values(MessageTypesEnum).join(" ,")} `)
];

module.exports={SendMessageValidate}