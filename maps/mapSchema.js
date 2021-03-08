const mongoose = require('mongoose');
const { Schema } = mongoose;

const nodeSchema = new Schema({
    label:String,
    id:String
})
const edgeSchema = new Schema({
    from:String,
    to:String
})


exports.mapSchema = new Schema({
    creator:String,
    mapId:String,
    nodes:[nodeSchema],
    edges:[edgeSchema],
    settings:Object,
})

