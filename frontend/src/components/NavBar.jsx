import React from "react";
import { useAuth } from "../assets/AuthProvider";
import { Link } from "react-router-dom";


const NavBar = () => {
    const auth = useAuth();
    return (
        <nav className="w-full sticky px-2 font-poppins text-slate-100 py-2 flex flex-row items-center justify-between">
            <Link to="/chats">
                <div className="cursor-pointer mx-2 text-4xl font-700">Chats</div>
            </Link>
            <div className="flex text-lg flex-row items-center gap-2 font-500">
                <Link to="/login">
                    <div className="hover:shadow-lg rounded-md transition-colors px-2 cursor-pointer py-2 duration-300 hover:bg-[#5573FC] hover:text-white">login</div>
                </Link>
                <Link to="/users">
                    <div className="hover:shadow-lg rounded-md transition-colors px-2 cursor-pointer py-2 duration-300 hover:bg-[#5573FC] hover:text-white">users</div>
                </Link>
                <Link to="/signup">
                    <div className="hover:shadow-lg rounded-md transition-colors px-2 cursor-pointer py-2 duration-300 hover:bg-[#5573FC] hover:text-white">signup</div>
                </Link>
                <button onClick={() => auth.logOut()} className="hover:shadow-lg rounded-md transition-colors px-2 cursor-pointer py-2 duration-300 hover:bg-[#5573FC] hover:text-white">
                  logout
                </button>
            </div>
        </nav>
    )
}

export default NavBar;