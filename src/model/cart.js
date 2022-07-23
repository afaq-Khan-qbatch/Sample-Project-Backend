const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectID

const schema = mongoose.Schema({
    item_id:{
        type: ObjectId
    },
    
    quantity:{
        type: Number
    },
    userId:{
        type: String
    },
    angular: {
        type: Boolean,
        default: false
    }
})

const cart = new mongoose.model('cart' , schema);

module.exports = cart;