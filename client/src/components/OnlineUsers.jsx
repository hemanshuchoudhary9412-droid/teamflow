import React from "react";

const OnlineUsers = ({ onlineUsers }) => {
  return (
    <div className="online-users">
      <div className="online-header">
        <span className="online-dot" />
        <span>Online: {onlineUsers.length}</span>
      </div>
    </div>
  );
};

export default OnlineUsers;
