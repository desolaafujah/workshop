import React, { useState } from 'react';
import './App.css';

function App() {
  // Initial message from the bot
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'Hola!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSend (e) {
    e.preventDefault();
    if (input.trim() === '') return;

    // add user message to history
    const userMessage = { id: Date.now(), sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

   // clear the input
   const prompt = input;
   setInput('');
   setLoading(true);

   try {
    const response = await fetch('http://localhost:5000/ask', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ prompt})
    });

    const data = await response.json();

    if(data.response) {
      const chatMessage ={ 
        id: Date.now() + 1,
        sender: 'bot',
        text: data.response
      };

      setMessages((prev) => [...prev, chatMessage]);
    } else {
      console.error('no response from chat', data.error);
    }

   } catch (error) {
    console.error('error calling server');
   } finally {
    setLoading(false);
   }
  };

  return (
    <div className="App">
      <div className="chat-container">
        <div className="chat-history">
          {messages.map((msg) => (
            <div key={msg.id} className={`chat-message ${msg.sender}`}>
              <div className="message-text">{msg.text}</div>
            </div>
          ))}
        </div>
        <form className="chat-input" onSubmit={handleSend}>
          <input 
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder="say something:)"
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}

export default App;
