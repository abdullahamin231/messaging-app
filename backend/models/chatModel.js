const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const chatSchema = new Schema({
    participants: [ { type: Schema.Types.ObjectId, ref: 'User', required: true} ],
    messages: [ { type: Schema.Types.ObjectId, ref: 'Message', required: true} ],
});

chatSchema.virtual("url").get(function(){
    return `/chats/${this._id}`;
})

module.exports = mongoose.model('Chat', chatSchema);