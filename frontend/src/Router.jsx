import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from './components/NavBar';
import SignUp from './components/SignUp';
import LogIn from './components/LogIn';
import Chats from './components/Chats';
import './App.css'
import AuthProvider from "./assets/AuthProvider";
import './index.css'
import PrivateRoute from "./assets/PrivateRoute";
import Users from './components/Users';
import ParticularChat from "./components/ParticularChat";

const RouterApp = () => {


    return (
        <Router>
            <AuthProvider>
                <div class="router3">
                    <NavBar/>
                    <Routes >
                        <Route path="/" element={<LogIn />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/login" element={<LogIn /> } />
                        <Route element={<PrivateRoute />}>
                            <Route path="/chats" element={<Chats />} />
                            <Route path="/users" element={<Users/>}/>
                            <Route path='/chats/:id' element={<ParticularChat />} />
                        </Route>
                    </Routes>
                </div>
            </AuthProvider>
        </Router>
    );
};

export default RouterApp;
