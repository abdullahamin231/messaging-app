import { useContext, createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import { useToast } from "@chakra-ui/react"; // Import useToast hook for displaying pop-up

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("site") || "");
  const [error, setError] = useState(null); // State variable to manage error
  const navigate = useNavigate();
  const urlogin = "http://localhost:3000/users/login";
  
  const toast = useToast(); // Initialize useToast hook

  const loginAction = async (input) => {
    try {
      console.log("authenticating, ", input.email, input.password);
      const response = await fetch(urlogin, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({email: input.email, password: input.password}),
        mode: "cors",
      });
      const res = await response.json();
      if (res.data) {
        setUser(res.data.user);
        setToken(res.token);
        localStorage.setItem("site", res.token);
        setError(null);
        toast({
          title: "Login Successful",
          description: "You have been logged in",
          status: "success",
          duration: 2500,
          isClosable: true,
          className: "font-inter",
        });
        navigate("/chats");
      } else {
        throw new Error(res.message);
      }
    } catch (err) {
      console.error(err);
      setError(err.message); // Set error message in state
      // Display pop-up for the error
      toast({
        title: "Login Error",
        description: err.message,
        status: "error",
        duration: 2500,
        isClosable: true,
        className: "font-inter",
      });
    }
  };

  const logOut = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("site");
    toast({
      title: "Logout Successful",
      description: "You have been logged out",
      status: "success",
      duration: 2500,
      isClosable: true,
      className: "font-inter",
    })
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ token, user, loginAction, logOut, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
