import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

// Create Context object
const SocketContext = createContext();

// Custom hook that shorthands the context!
export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Create WebSocket connection.
    const newSocket = io.connect('http://localhost:8080');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      // console.log('!Socket is now connected');
    });

    // console.log('NEW SOCKET CONNECTED?? ', newSocket.c onnected);
    // Specify how to clean up after this effect:
    return () => {
      // console.log('Cleaning up Socket');
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
