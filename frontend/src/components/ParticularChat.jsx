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


export default function ParticularChat(){
    const messageListReferance = createRef();
    const chatid = useParams().id;
    const auth = useAuth();
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState({});
    const [otherUser, setOtherUser] = useState({}); 
    const [yourMessages, setYourMessages] = useState([]);
    const [otherMessages, setOtherMessages] = useState([]);
    
    const handleMessage = (e) => {        
        setMessage(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:3000/chats/${chatid}/submit`, {
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
            const response = await fetch(`http://localhost:3000/chats/${chatid}/${auth.user._id}`, { mode: 'cors', method: 'GET' });
            if (!response.ok) {
                throw new Error('Failed to fetch chats');
            }
            const data = await response.json();
            setChat(data.chat);
            setYourMessages(data.yourMessages);
            setOtherMessages(data.otherMessages);
            setOtherUser(data.otherUser[0]);
            console.log(data);
        } catch (error) {
            console.error(error.message);
        }
    }
    useEffect(() => {
        fetchChat();
    }, [])
    return (
        <div className="h-[100vh] mr-4 ml-4 font-inter">
            <h1 className="text-2xl font-bold">Chat with {otherUser.username}</h1>
            <div className="w-full h-[full] mb-8 border-black border-2 px-2 flex flex-row items-center">
                <MessageList
                    referance={messageListReferance}
                    className='message-list'
                    lockable={true}
                    toBottomHeight={'100%'}
                    dataSource={[
                        ...yourMessages.map(msg => ({
                            position: 'right',
                            title: auth.user.username,
                            type: 'text',
                            text: msg.content,
                            date: msg.date,
                        })),
                        ...otherMessages.map(msg => ({
                            position: 'left',
                            type: 'text',
                            title: otherUser.username,
                            text: msg.content,
                            date: msg.date,
                        }))
                    ]}
                />

                {/* <div className="flex flex-col  h-full w-[50%]">
                    <div className="bg-slate-200">Your messages: </div>
                    {
                        yourMessages.map((msg, index) => {
                            return (
                                <MessageBox
                                    position={'right'}
                                    type={'text'}
                                    text={msg.content}
                                    date={msg.date}
                                />
                            )
                        })
                    }

                </div>
                <div className="flex flex-col h-full  w-[50%]">
                    <div className="bg-gray-400">Other's messages: </div>
                    {
                        otherMessages.map((msg, index) => {
                            return (
                                <MessageBox
                                    position={'left'}
                                    type={'text'}
                                    text={msg.content}
                                    date={msg.date}
                                />
                            )
                        })
                    }
                </div> */}
            </div>
            <form onSubmit={handleSubmit}>
                <Input onChange={handleMessage} colorScheme="blue" variant='filled' id="message" type="text" />
                <button type="submit" class="py-3 mt-2 px-4 inline-flex items-center gap-x-2 text-sm font-semibold border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                  Send Message
                </button>

            </form>
            

        </div>
    )
    
}