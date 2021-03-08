const express = require("express");
const app = express();
const { mapSchema } = require('./mapSchema');
const mongoose = require('mongoose');


exports.updateNode = (req, res) => {

    res.send({ ok: true });
};


exports.createMap = async (req, res) => {
    try {
console.log('creating')
        const creator = req.username;
        const {newMapName} = req.body

        if(!newMapName) throw new Error('no name in the req')

        const Map = mongoose.model('Map', mapSchema);

        const newMap = new Map({ creator, name:newMapName,creationDate:Date.now()})

        const newMapDB = await newMap.save();
        const mapId = newMapDB._id

        res.send({ ok: true, newMap: true, creator,mapId, name:newMapName });
    } catch (e) {
        console.log(e)
        res.send({ error: e.message })
    }
}