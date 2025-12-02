import React, { useContext, useEffect, useState } from "react";
import axios from "../api/axios.js";
import { AuthContext } from "../context/AuthContext.jsx";
import { useSocket } from "../hooks/useSocket.js";
import ChannelList from "../components/ChannelList.jsx";
import ChatWindow from "../components/ChatWindow.jsx";
import OnlineUsers from "../components/OnlineUsers.jsx";

const Chat = () => {
  const { user, token, logout } = useContext(AuthContext);
  const { socket, onlineUsers } = useSocket(token);
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);

  const fetchChannels = async () => {
    try {
      const res = await axios.get("/channels", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChannels(res.data.channels);
      if (!selectedChannel && res.data.channels.length > 0) {
        setSelectedChannel(res.data.channels[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchChannels();
  }, [token]);

  return (
    <div className="chat-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div>
            <h2>{user?.name}</h2>
            <p className="user-email">{user?.email}</p>
          </div>
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>

        <OnlineUsers onlineUsers={onlineUsers} />

        <ChannelList
          channels={channels}
          selectedChannel={selectedChannel}
          setSelectedChannel={setSelectedChannel}
          token={token}
          refreshChannels={fetchChannels}
        />
      </aside>
      <main className="chat-main">
        {selectedChannel ? (
          <ChatWindow
            channel={selectedChannel}
            token={token}
            socket={socket}
          />
        ) : (
          <div className="empty-state">Select or create a channel to start</div>
        )}
      </main>
    </div>
  );
};

export default Chat;
