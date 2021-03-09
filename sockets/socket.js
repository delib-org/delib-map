const { io } = require('../index');
const mongoose = require('mongoose');


const { mapSchema } = require('../routes/maps/mapSchema');
const Map = mongoose.model('Map', mapSchema);

io.on('connection', socket => {

    console.log('connection')

    socket.on('node update', async mapObj => {
        const { mapId, updatedNode } = mapObj;


        io.emit('node update', updatedNode);
        const map = await Map.updateOne(
            { 'nodes._id': updatedNode._id },
            { $set: { 'nodes.$': updatedNode } },
            { arrayFilters: [{ 'nodes.id': updatedNode.id }] }
        )

    });

    socket.on('node create', node => {

        console.log('node create')

        io.emit('node create', node);
    });

    socket.on('edge create', async edge => {
        try {

            const { mapId } = edge;

            let map = await Map.updateOne({ _id: mapId }, { $push: { edges: edge } });

            io.emit('edge create', edge);
        } catch (e) {
            console.error(e)
        }
    });

    socket.on('edge delete', async ({ mapId, edgeId }) => {
        try {



            let map = await Map.updateOne(
                { 'edges.id': edgeId },
                { $pull: { edges: { id: edgeId } } },
                { multi: false }
            );

            io.emit('edge delete', edgeId);
        } catch (e) {
            console.error(e)
        }
    });



});