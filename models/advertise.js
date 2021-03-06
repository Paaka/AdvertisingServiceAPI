const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const advertiseSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    date:{
        type:Date,
        required:true,
    }
});

module.exports = mongoose.model('Advertise', advertiseSchema);