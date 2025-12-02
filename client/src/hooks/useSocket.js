import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export const useSocket = (token) => {
  const socketRef = useRef(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!token) return;

    const socket = io(import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000", {
      auth: { token }
    });

    socketRef.current = socket;

    socket.on("presence-update", (onlineIds) => {
      setOnlineUsers(onlineIds);
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);

  return { socket: socketRef.current, onlineUsers };
};
