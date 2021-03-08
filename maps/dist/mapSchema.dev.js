"use strict";

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var nodeSchema = new Schema({
  label: String,
  id: String
});
var edgeSchema = new Schema({
  from: String,
  to: String
});
exports.mapSchema = new Schema({
  creator: String,
  mapId: String,
  nodes: [nodeSchema],
  edges: [edgeSchema],
  settings: Object
});