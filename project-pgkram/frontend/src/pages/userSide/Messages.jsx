// MessageInterface.jsx
import React, { useState } from 'react';

const MessageInterface = () => {
  const [people] = useState([
    { id: 1, name: 'John Doe', lastSeen: '10:30 AM' },
    { id: 2, name: 'Jane Doe', lastSeen: '11:45 AM' },
    { id: 3, name: 'Alice', lastSeen: '9:15 AM' },
    { id: 4, name: 'Bob', lastSeen: '10:00 AM' },
    { id: 5, name: 'Charlie', lastSeen: '12:30 PM' },
    { id: 6, name: 'Eve', lastSeen: '1:00 PM' },
    { id: 7, name: 'Dave', lastSeen: '2:30 PM' },
  ]);

  const [selectedPerson, setSelectedPerson] = useState(1);

  const [messages, setMessages] = useState({
    1: [
      { id: 1, sender: 'John Doe', content: 'Hi there!', file: null, time: '10:00 AM' },
      { id: 2, sender: 'You', content: 'Hello!', file: null, time: '10:15 AM' },
    ],
    2: [
      { id: 1, sender: 'Jane Doe', content: 'Hello!', file: null, time: '11:00 AM' },
      { id: 2, sender: 'You', content: 'Hi Jane!', file: null, time: '11:20 AM' },
    ],
    // Add fake chats for other people
  });

  const [newMessage, setNewMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleSendMessage = () => {
    if (newMessage.trim() === '' && !selectedFile) return;

    const newMessageObj = {
      id: messages[selectedPerson].length + 1,
      sender: 'You',
      content: newMessage,
      file: selectedFile,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prevMessages) => ({
      ...prevMessages,
      [selectedPerson]: [...prevMessages[selectedPerson], newMessageObj],
    }));

    setNewMessage('');
    setSelectedFile(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  return (
    <div className="flex w-4/5 m-auto my-12 shadow-2xl">
      {/* Left Side: People */}
      <div className="flex-none w-1/4 p-4 border-r">
        {people.map((person) => (
          <div
            key={person.id}
            className={`flex items-center mb-4 cursor-pointer ${
              selectedPerson === person.id ? 'bg-gray-200' : ''
            }`}
            onClick={() => setSelectedPerson(person.id)}
          >
            <div className="rounded-full bg-gray-500 w-10 h-10 mr-3"></div>
            <div>
              <div className="font-bold">{person.name}</div>
              <div className="text-gray-500">{`Last seen: ${person.lastSeen}`}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Right Side: Messages */}
      <div className="flex-grow p-4">
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Message history */}
          {messages[selectedPerson].map((message) => (
            <div
              key={message.id}
              className={`mb-4 ${message.sender === 'You' ? 'text-right' : 'text-left'}`}
            >
              <div className="font-bold">{message.sender}</div>
              <div className="bg-gray-200 p-2 rounded">{message.content}</div>
              {message.file && (
                <div className="text-xs text-gray-500">
                  File: {message.file.name} - {message.file.size} bytes
                </div>
              )}
              <div className="text-xs text-gray-500">{message.time}</div>
            </div>
          ))}

          {/* Bottom bar for typing */}
          <div className="flex items-center">
            <textarea
              className="flex-grow p-2 mr-2 border"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <input
              type="file"
              className="mr-2"
              onChange={handleFileChange}
            />
            <button className="px-4 py-2 mr-2 bg-blue-500 text-white rounded" onClick={handleSendMessage}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageInterface;

// const [sender, setSender] = useState('');
//   const [receiver, setReceiver] = useState('');
//   const [messageText, setMessageText] = useState('');

//   const sendMessage = async () => {
//     try {
//       const response = await axios.post('http://localhost:5000/api/send-message', {
//         sender,
//         receiver,
//         message_text: messageText,
//       });

//       console.log('Message sent:', response.data);
//     } catch (error) {
//       console.error('Error sending message:', error);
//     }
//   };


// const MessageReceiver = ({ userId }) => {
//   const [messages, setMessages] = useState([]);

//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const response = await axios.get(`http://localhost:5000/api/get-messages/${userId}`);
//         setMessages(response.data);
//       } catch (error) {
//         console.error('Error fetching messages:', error);
//       }
//     };

//     fetchMessages();
//   }, [userId]);