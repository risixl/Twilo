import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [isNameSet, setIsNameSet] = useState(false); // track if name is entered
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);
  const listRef = useRef(null);

  const canSend = useMemo(
    () => message.trim() !== "" && !sending,
    [message, sending]
  );

  const sendMessage = () => {
    if (!canSend) return;
    setSending(true);

    const newMessage = {
      id: Date.now(),
      username,
      message: message.trim(),
      timestamp: new Date().toLocaleTimeString(),
    };

    setTimeout(() => {
      setMessages((prev) => [...prev, newMessage]);
      setMessage("");
      setSending(false);
    }, 200);
  };

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  // Set username once
  const handleSetName = () => {
    if (username.trim() !== "") {
      setIsNameSet(true);
    }
  };

  return (
    <div className="chat-container">
      <h2>💬 Messaging App</h2>

      {!isNameSet ? (
        <div className="name-input-container">
          <input
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSetName()}
          />
          <button onClick={handleSetName} disabled={username.trim() === ""}>
            Set Name
          </button>
        </div>
      ) : (
        <>
          <div ref={listRef} className="chat-box">
            {messages.length === 0 ? (
              <p className="no-msg">No messages yet...</p>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="chat-message">
                  <div className="msg-content">
                    <strong>{msg.username}:</strong> {msg.message}
                  </div>
                  <div className="msg-time">{msg.timestamp}</div>
                </div>
              ))
            )}
          </div>

          <div className="input-container">
            <input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage} disabled={!canSend}>
              {sending ? "Sending..." : "Send"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
