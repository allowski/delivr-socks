const {Schema, SchemaTypes} = require('mongoose');

module.exports = new Schema({
    room: String,
    message: String,
    payload: SchemaTypes.Mixed
}, {
    timestamps: true
})
