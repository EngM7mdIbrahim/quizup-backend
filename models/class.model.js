const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    quizID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz'
    },
    teacherID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    players: {
        type: [{
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
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Class', classSchema);