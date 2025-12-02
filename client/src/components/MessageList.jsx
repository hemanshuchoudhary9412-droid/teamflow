import React from "react";

const MessageList = ({ messages }) => {
  return (
    <div className="message-list">
      {messages.map((m) => (
        <div key={m._id} className="message-item">
          <div className="message-header">
            <span className="message-sender">{m.sender?.name || "User"}</span>
            <span className="message-time">
              {new Date(m.createdAt).toLocaleTimeString()}
            </span>
          </div>
          <div className="message-text">{m.text}</div>
        </div>
      ))}
      {messages.length === 0 && (
        <p className="muted-text">No messages yet. Say hi! 👋</p>
      )}
    </div>
  );
};

export default MessageList;
