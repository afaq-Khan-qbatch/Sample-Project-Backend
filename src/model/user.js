const mongoose = require('mongoose');
const validator = require('validator');

const schema = mongoose.Schema({
    email:{
        type:String,
        trim: true,
        lowercase: true,
        unique: true,
        validate:{
              validator: validator.isEmail,
              message: `{VALUE} is not a valid email`,
              isAsync: false
        }
    },
    password:{
        type: String
    },
    firstname:{
        type: String
    },
    lastname:{
        type: String
    },
    payment: {
        type: Object,
        customer_id: {
            type: String,
        },
        subscription_id: {
            type: String
        }
    }

})

const user = new mongoose.model('user' , schema);

module.exports = user;