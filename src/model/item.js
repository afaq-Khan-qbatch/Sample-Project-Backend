const mongoose = require('mongoose');

const schema = mongoose.Schema({
    name:{
        type: String
    },
    price:{
        type: Number
    },
    image:{
        type: String
    },
    description: {
        type: String
    }
})

const Items = new mongoose.model('items' , schema);

module.exports = Items;