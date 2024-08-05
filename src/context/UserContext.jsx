import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [court, setCourt] = useState(() => {
    const savedCourt = localStorage.getItem("court");
    return savedCourt ? JSON.parse(savedCourt) : null;
  });

  const [loginMessage, setLoginMessage] = useState("");

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  useEffect(() => {
    if (court) {
      localStorage.setItem("court", JSON.stringify(court));
    } else {
      localStorage.removeItem("court");
    }
  }, [court]);

  const logout = () => {
    setUser(null);
    setCourt(null);
    setLoginMessage("");
    localStorage.removeItem("user");
    localStorage.removeItem("court");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        court,
        setCourt,
        loginMessage,
        setLoginMessage,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
