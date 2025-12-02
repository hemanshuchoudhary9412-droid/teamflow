import React, { useEffect, useRef, useState } from "react";
import axios from "../api/axios.js";
import MessageList from "./MessageList.jsx";
import MessageInput from "./MessageInput.jsx";

const ChatWindow = ({ channel, token, socket }) => {
  const [messages, setMessages] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [cursor, setCursor] = useState(null);
  const bottomRef = useRef(null);

  const fetchMessages = async (before = null) => {
    if (!channel) return;
    try {
      setLoadingMore(true);
      const params = { limit: 20 };
      if (before) params.before = before;

      const res = await axios.get(`/channels/${channel._id}/messages`, {
        params,
        headers: { Authorization: `Bearer ${token}` }
      });

      if (before) {
        setMessages((prev) => [...res.data.messages, ...prev]);
      } else {
        setMessages(res.data.messages);
      }

      setHasMore(res.data.hasMore);
      setCursor(res.data.nextCursor);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setMessages([]);
    setCursor(null);
    fetchMessages();
    if (!socket) return;

    socket.emit("join-channel", channel._id);

    const handler = (msg) => {
      if (msg.channelId === channel._id) {
        setMessages((prev) => [...prev, msg]);
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    };

    socket.on("new-message", handler);

    return () => {
      socket.emit("leave-channel", channel._id);
      socket.off("new-message", handler);
    };
  }, [channel?._id, socket]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const loadOlder = () => {
    if (!hasMore || loadingMore || !cursor) return;
    fetchMessages(cursor);
  };

  const handleSend = (text) => {
    if (!socket) return;
    socket.emit("send-message", { channelId: channel._id, text });
  };

  return (
    <div className="chat-window">
      <header className="chat-header">
        <div>
          <h2># {channel.name}</h2>
        </div>
      </header>
      <div className="messages-container">
        {hasMore && (
          <button className="load-more-btn" onClick={loadOlder} disabled={loadingMore}>
            {loadingMore ? "Loading..." : "Load older messages"}
          </button>
        )}
        <MessageList messages={messages} />
        <div ref={bottomRef} />
      </div>
      <MessageInput onSend={handleSend} />
    </div>
  );
};

export default ChatWindow;
