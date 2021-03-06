const mongoose = require('mongoose');
const { Schema } = mongoose;

const nodeSchema = new Schema({
    label:String,
    id:String
})
const edgeSchema = new Schema({
    from:String,
    to:String,
    id:String
})


exports.mapSchema = new Schema({
    creator:String,
    name:String,
    creationDate:{type: Date, default: Date.now},
    nodes:[nodeSchema],
    edges:[edgeSchema],
    settings:Object,
})

