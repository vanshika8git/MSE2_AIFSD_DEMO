import React, { useState, useEffect, useRef } from 'react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const toggleChat = () => {
    if (isOpen) {
      setMessages([]); // Clear conversation when clicking the cross/closing
    }
    setIsOpen(!isOpen);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = { text: inputValue, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    const token = window.location.pathname === "/login" ? null : localStorage.getItem("token");
    const history = messages.map(m => ({
      role: m.sender === "user" ? "user" : "assistant",
      content: m.text
    }));
    history.push({ role: "user", content: userMessage.text });

    try {
      const response = await fetch("https://mse2-aifsd-demo.onrender.com/api/chat", { //here change the link to ur deployed backend url
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` })
        },
        body: JSON.stringify({ messages: history }),
      });
      const data = await response.json();

      setMessages((prev) => [...prev, { text: data.reply, sender: "bot" }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [...prev, { text: "Error connecting to server.", sender: "bot" }]);
    }
  };

  return (
    <div style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 1000, display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
      {isOpen && (
        <div style={{
          width: "300px",
          height: "400px",
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          borderRadius: "10px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          marginBottom: "10px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden"
        }}>
          <div style={{ backgroundColor: "#000", color: "#fff", padding: "10px", textAlign: "center", fontWeight: "bold" }}>
            Chatbot
          </div>
          <div style={{ flex: 1, padding: "10px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
            {messages.length === 0 ? (
              <div style={{ textAlign: "center", color: "#888", marginTop: "50%" }}>Hi! How can I help you?</div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} style={{
                  alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                  backgroundColor: msg.sender === "user" ? "#000" : "#f1f1f1",
                  color: msg.sender === "user" ? "#fff" : "#000",
                  padding: "8px 12px",
                  borderRadius: "15px",
                  maxWidth: "80%",
                  wordWrap: "break-word"
                }}>
                  {msg.text}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={sendMessage} style={{ display: "flex", borderTop: "1px solid #ccc", padding: "10px", backgroundColor: "#fafafa" }}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type a message..."
              style={{ flex: 1, padding: "8px", border: "1px solid #ccc", borderRadius: "20px", outline: "none" }}
            />
            <button type="submit" style={{
              marginLeft: "10px",
              backgroundColor: "#000",
              color: "#fff",
              border: "none",
              borderRadius: "50%",
              width: "35px",
              height: "35px",
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </button>
          </form>
        </div>
      )}

      <button onClick={toggleChat} style={{
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        backgroundColor: "#000",
        color: "#fff",
        border: "2px solid #fff",
        boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
        cursor: "pointer",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        outline: "none"
      }}>
        {isOpen ? (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="30" height="30" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        ) : (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="30" height="30" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
          </svg>
        )}
      </button>
    </div>
  );
};

export default Chatbot;
