import { useEffect } from "react";
import { useState } from "react";
import React from "react";
import { useAuth } from "../assets/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function Users() {
    const auth = useAuth();
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const sendMessage = async (id) => {
        try{
            const response = await fetch(`http://localhost:3000/chats/${id}/${auth.user._id}/message`, { mode: 'cors', method: 'GET' });
            if(!response.ok) {
                throw new Error('Failed to send message');
            }
            const data = await response.json();
            navigate(`/chats/${data.chatid}`);
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

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/users/${id}/delete`, { mode: 'cors', method: 'POST' }); // Specify method DELETE
            if (!response.ok) {
                throw new Error('Failed to delete user');
            }
            const data = await response.json();
            console.log(data.message);
            fetchUsers(); // Fetch users again after deletion
        } catch (error) {
            setError(error.message);
        }
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <>
            <main className="font-inter text-center h-[100vh]">
                <h1 className="font-bold mt-2 font-inter text-white text-4xl">Users</h1>
                <div className="flex flex-row flex-wrap" >
                    {
                        users.map(user => (
                            <div id="user" className="flex flex-col p-4 items-start justify-center text-xl text-gray-900 bg-slate-100 m-4 w-fit" key={user._id}>
                                <h2 className=" font-bold ">{user.username}</h2>
                                <p>{user.email}</p>
                                {
                                    user &&
                                        user.username === auth.user?.username ? <p className="flex flex-row gap-1">You are signed in <span>{auth.user?._id}</span></p> : ''
                                }
                                <div className="flex flex-row gap-1 items-center">
                                {
                                    auth.user && user && auth.user.username != user.username ? <form onSubmit={(e) => {e.preventDefault(); sendMessage(user._id)}}>
                                        <button className="border-none bg-slate-600 text-white font-inter font-semibold py-2 px-4 w-fit mt-8 hover cursor-pointer ">Message</button>
                                    </form> : ' '

                                }
                                {
                                    user && auth.user &&
                                        user.username === auth.user?.username ?
                                        <form onSubmit={(e) => { e.preventDefault(); handleDelete(user._id); }}> {/* Prevent default form submission and call handleDelete */}
                                            <button type="submit" className="border-none bg-slate-600 text-white font-inter w-fit font-semibold py-2 px-4  mt-8 hover cursor-pointer ">Delete</button>
                                        </form> : ''
                                }
                                </div>
                                {
                                    auth.user &&
                                        auth.user?.username === 'admin' ?
                                        <form onSubmit={(e) => { e.preventDefault(); handleDelete(user._id); }}> {/* Prevent default form submission and call handleDelete */}
                                            <button type="submit" className="border-none bg-slate-600 text-white font-inter w-fit font-semibold py-2 px-4 mt-8 hover cursor-pointer ">Delete</button>
                                        </form>
                                        : ''
                                }
                                
                            </div>
                        ))
                    }
                </div>
            </main>
        </>
    )
}
