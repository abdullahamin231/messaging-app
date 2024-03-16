var express = require('express');
var router = express.Router();
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const Message = require('../models/messageModel');
const Chat = require('../models/chatModel');


// for frontend because we need to know the id of the logged ser
// both unneeded as we will navigate user through /users to here
router.get('/all/:id', async (req, res) => {
    const chats =  await Chat.find({participants: req.params.id});
    const user = req.user;
    // res.render('chats', {chats, user});
    return res.json({chats});
})
// for local host
router.get('/', asyncHandler(async (req, res) => {
    const chats =  await Chat.find({participants: req.user._id});
    const user = req.user;
    res.render('chats', {chats, user});
    // return res.json({chats});
}))

// when click msg button, come here => if chat or not actual showing takes place in next setp
// Get chat from message button, :id is id of the person we want to talk to.
// userid is the logged in user
router.get('/:id/:userid/message', asyncHandler(async (req, res) => {
    console.log("Checking for chat");
    console.log("logged user: ", req.params.userid);
    console.log("want to talk to user: ", req.params.id);
    const already = await Chat.findOne({ participants: { $all: [req.params.userid, req.params.id] } });
    console.log("Already, ", already);
    if(already != null) {
        console.log("Chat already found");
        console.log("already: ", already._id);
        return res.json({chatid: already._id});
        // res.redirect(`/chats/${already._id}`);
    }
    else {
        console.log("created chat");
        const chat = new Chat({
            participants: [req.params.userid, req.params.id],
            messages: [],
        });
        await chat.save();
        console.log("new: ", chat._id);

        return res.json({chatid: chat._id});
        // res.redirect(`/chats/${chat._id}`);
    }
}))


// Get chat from chatid
router.get('/:id/:userid', asyncHandler(async (req, res) => {
    console.log("Searching for chat");
    const chat = await Chat.findOne({_id : req.params.id});
    if (chat === null) {
        res.redirect(`/users`);
        console.log("NO chat found.");
    }
    // console.log("Found chat: ", chat);
    const loggedUser = await User.findOne({ _id: req.params.userid });
    const allMessages = await Message.find({ chat: chat._id });
    // console.log("All Messages:", allMessages);
    const yourMessages = allMessages.filter(msg => msg.author === loggedUser.username);
    // console.log("Your Messages: ", yourMessages);
    const otherMessages = allMessages.filter(msg => !(msg.author === loggedUser.username));;
    // console.log("other Messages: ", otherMessages);
    
    
    // const user = req.user;
    // res.render('chat', {user, chat, yourMessages, otherMessages});
    const otherUser = await User.find({_id: chat.participants.filter(id => id != req.params.userid)});
    return res.json({chat, otherUser, allMessages, yourMessages, otherMessages});
}))


// Send Message
router.post('/:id/submit', asyncHandler(async (req, res)=>{
    console.log("Sending Message.");
    
    const chat = await Chat.findOne({_id : req.params.id});
    const message = new Message({
        content: req.body.message,
        author: req.body.username,
        chat: req.params.id,
        date: new Date(),
    });
    await message.save();
    chat.messages.push(message);
    await chat.save();
    return res.json({message: "Successfully sent message"});
    // res.redirect(`/chats/${chat._id}/`);
}))

router.post('/:id/:messageid/delete', asyncHandler(async (req, res) => {
    const chat = await Chat.findOne({ _id: req.params.id });
    console.log("Chat found: ", chat);
    const messages = await Message.find({chat : chat._id});
    
    const msgindex = chat.messages.indexOf(req.params.messageid);
    const msg = chat.messages[msgindex];
    await Message.deleteOne({_id : msg._id});
    chat.messages.splice(msgindex, 1);
    await chat.save();
    
    res.redirect(`/chats/${chat._id}`);

}));


module.exports = router;