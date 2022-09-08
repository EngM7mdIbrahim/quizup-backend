const { default: mongoose } = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    quizzes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Quiz'}],
    classes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Class'}],
    // refreshToken: {
    //     type: String,
    //     default: null
    // },
    createdAt: {
        type: Date,
        default: Date.now
    }, 
})

module.exports = mongoose.model('User',userSchema);