const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const messageSchema = new Schema({
    content: { type: String, required: true },
    author: { type: String, required: true },
    chat: { type: Schema.Types.ObjectId, ref: 'Chat', required: true},
    date: { type: Date, default: Date.now },
});


module.exports = mongoose.model('Message', messageSchema);