import React, { useEffect, useState } from "react";
import { useAuth } from "../assets/AuthProvider";
import {ConversationList, Conversation} from '@chatscope/chat-ui-kit-react';
import ParticularChat2 from "./ParticularChat2";
import Avatar from 'boring-avatars';

export default function Chats() {
    const auth = useAuth();
    const [users, setUsers] = useState([]);
    const [chatID, setChatID] = useState();

    const sendMessage = async (id) => {
        console.log("getting chat id", id);
        try{
            const response = await fetch(`http://localhost:3000/chats/${id}/${auth.user._id}/message`, { mode: 'cors', method: 'GET' });
            if(!response.ok) {
                throw new Error('Failed to send message');
            }
            const data = await response.json();
            console.log("Chat id", data.chatid);
            setChatID(data.chatid);
        } catch (error) {
            console.error(error.message);
        }
    }

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:3000/users', { mode: 'cors' });
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            const data = await response.json();
            setUsers(data.users);
        } catch (error) {
            setError(error.message);
        }
    }

    useEffect( () => {
        fetchUsers();
    }, [])
   
    return (
        <div id="mess" className="flex h-[100vh] flex-row items-start">
            <div className="mt-4 ">
                <ConversationList>
                    {users.map((user) => (
                        <Conversation
                            key={user._id}
                            name={user.username}
                            id="polka"
                            className="w-[10rem] bg-slate-200 font-inter text-lg font-bold"
                            info="Offline"
                            onClick={() => {setChatID(null); sendMessage(user._id);}}
                        >
                        </Conversation>
                    ))}
                </ConversationList>
            </div>
            <div id="messageALL" className="flex-grow h-[75vh] ">
                {chatID ? <ParticularChat2 chatID={chatID} /> : null}
            </div>
        </div>
    )
    
}
