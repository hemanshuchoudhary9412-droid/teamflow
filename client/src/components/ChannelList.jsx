import React, { useState } from "react";
import axios from "../api/axios.js";

const ChannelList = ({
  channels,
  selectedChannel,
  setSelectedChannel,
  token,
  refreshChannels
}) => {
  const [newChannel, setNewChannel] = useState("");
  const [error, setError] = useState("");

  const createChannel = async (e) => {
    e.preventDefault();
    if (!newChannel.trim()) return;
    try {
      setError("");
      await axios.post(
        "/channels",
        { name: newChannel.trim() },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setNewChannel("");
      refreshChannels();
    } catch (err) {
      setError(err.response?.data?.message || "Error creating channel");
    }
  };

  return (
    <div className="channel-list">
      <div className="channel-list-header">
        <h3>Channels</h3>
      </div>
      <div className="channel-items">
        {channels.map((ch) => (
          <div
  key={ch._id}
  className={
    "channel-item " +
    (selectedChannel?._id === ch._id ? "channel-item-active" : "")
  }
>
  <button
    className="channel-select"
    onClick={() => setSelectedChannel(ch)}
  >
    <span># {ch.name}</span>
    <span className="channel-members">{ch.memberCount || 0}</span>
  </button>

  {/* Leave button */}
  <button
    className="leave-btn"
        onClick={async (e) => {
            e.stopPropagation();
            try {
            await axios.post(
                `/channels/${ch._id}/leave`,
              {},
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
            refreshChannels();
                if (selectedChannel?._id === ch._id) {
                setSelectedChannel(null);
        }
      } catch (err) {
                console.error(err);
      }
    }}
  >
    ❌
  </button>
</div>

        ))}
        {channels.length === 0 && (
          <p className="muted-text">No channels yet. Create one!</p>
        )}
      </div>
      <form className="channel-form" onSubmit={createChannel}>
        <input
          type="text"
          placeholder="New channel name"
          value={newChannel}
          onChange={(e) => setNewChannel(e.target.value)}
        />
        <button type="submit">+</button>
      </form>
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

export default ChannelList;
