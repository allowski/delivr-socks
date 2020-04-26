const {Schema} = require('mongoose');

module.exports = new Schema({
    short: {
        type: String,
        unique: true
    },
    fullurl: {
        type: String,
    }
}, {
    timestamps: true
})
