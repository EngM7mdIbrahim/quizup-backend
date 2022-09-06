const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    templateID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Template'
    },
    players: [{
        name: {
            type: String,
            required: true,
        },
        score: {
            type: Number,
            required: true,
            default: 0
        },
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Class', classSchema);