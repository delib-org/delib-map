const express = require("express");
const app = express();
const {mapSchema} = require('./mapSchema');
const mongoose = require('mongoose');


exports.updateNode = (req, res) => {

    res.send({ ok: true });
};


exports.createMap = async (req, res)=>{
    const creator = req.username;

    const mapId = 'id_' + (new Date()).getTime();

    const Map = mongoose.model('Map', mapSchema);

    const newMap = new Map({creator, mapId})

    const newMapDB = await newMap.save();
   

    res.send({ok:true, newMap:true,mapId, creator})
}