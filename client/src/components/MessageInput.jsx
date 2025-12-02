import React, { useState } from "react";

const MessageInput = ({ onSend }) => {
  const [text, setText] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <form className="message-input-form" onSubmit={submit}>
      <input
        type="text"
        placeholder="Message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default MessageInput;
