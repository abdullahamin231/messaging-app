import React, { useEffect } from "react"
import { useState } from "react"
import { useParams } from "react-router-dom"
import {Input} from '@chakra-ui/react'
import { useAuth } from "../assets/AuthProvider";
import { Button } from "@chakra-ui/react";
import 'react-chat-elements/dist/main.css'
import { MessageBox } from 'react-chat-elements'
import { createRef } from "react";
import { MessageList } from 'react-chat-elements'


export default function ParticularChat2({chatID}){
    const messageListReferance = createRef();
    const auth = useAuth();
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState({});
    const [otherUser, setOtherUser] = useState({}); 
    const [yourMessages, setYourMessages] = useState([]);
    const [otherMessages, setOtherMessages] = useState([]);
    const [AllMessages, setAllMessages] = useState([]);
    
    const handleMessage = (e) => {        
        setMessage(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:3000/chats/${chatID}/submit`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message, username: auth.user.username}),
                mode: "cors",
            });
            if (!response.ok) {
                throw new Error('Failed to send message');
            }
            const data = await response.json();
            fetchChat();
            setMessage("");
            e.target.value = "";
        } catch (error) {
            console.error(error.message);
        }
    }

    const fetchChat = async () => {
        try {
            const response = await fetch(`http://localhost:3000/chats/${chatID}/${auth.user._id}`, { mode: 'cors', method: 'GET' });
            if (!response.ok) {
                throw new Error('Failed to fetch chats');
            }
            const data = await response.json();
            setChat(data.chat);
            setAllMessages(data.allMessages);
            // setYourMessages(data.yourMessages);
            // setOtherMessages(data.otherMessages);
            setOtherUser(data.otherUser[0]);
            console.log(data);
        } catch (error) {
            console.error(error.message);
        }
    }
    useEffect(() => {
        fetchChat();
    }, [])


    const currentUser = auth.user.username;

    const mergedMessages = AllMessages.map(msg => ({
        position: msg.author === currentUser ? 'right' : 'left',
        type: 'text',
        title: msg.author === currentUser ? currentUser : otherUser.username,
        text: msg.content,
        date: msg.date,
    }));

    return (
        <div id="polka2" class="noscroll" className="relative scroll- overflow-y-auto bg-[#babaf9] mt-4 mr-4 flex flex-col">
            <div className="flex-grow w-full font-inter overflow-y-auto">
                <MessageList
                    referance={messageListReferance}
                    className='message-list'
                    lockable={true}
                    toBottomHeight={'100%'}
                    dataSource={mergedMessages}
                />
            </div>

            <div className="fixed bottom-0  left-0 w-full bg-[#d7d4fd] shadow-lg">
                <form onSubmit={handleSubmit} className="flex items-center justify-between p-4">
                    <Input onChange={handleMessage} variant='filled' id="message" type="text" className="font-inter mr-2 flex-grow" />
                    <Button type="submit" className="bg-[#F0EEFF]" variant="solid">
                        Send Message
                    </Button>
                </form>
            </div>

        </div>


    )
    
}