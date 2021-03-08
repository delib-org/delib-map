const express = require("express");
const app = express();
const { mapSchema } = require('./mapSchema');
const mongoose = require('mongoose');


exports.updateNode = (req, res) => {

    res.send({ ok: true });
};

const Map = mongoose.model('Map', mapSchema);


exports.createMap = async (req, res) => {
    try {
        console.log('creating')
        const creator = req.username;
        const { newMapName } = req.body

        if (!newMapName) throw new Error('no name in the req')



        const newMap = new Map({ creator, name: newMapName, creationDate: Date.now() })

        const newMapDB = await newMap.save();
        const mapId = newMapDB._id

        res.send({ ok: true, newMap: true, creator, mapId, name: newMapName });
    } catch (e) {
        console.log(e)
        res.send({ error: e.message })
    }
}

exports.getMaps = async (req, res) => {
    const maps = await Map.find({ name: { $exists: true } });

    res.send({ maps })
}

exports.getMap = async (req, res) => {
    const { mapId } = req.query;
    console.log('mapId', mapId);

    if (mapId) {
        const map = await Map.findById(mapId);
        console.log(map)
        res.send({ ok: true, mapId, map })
    } else {
        res.send({mapId})
    }

   
}