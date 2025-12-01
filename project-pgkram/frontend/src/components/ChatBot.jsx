import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  FaRobot, 
  FaUser, 
  FaPaperPlane, 
  FaTimes, 
  FaMinus,
  FaCommentDots,
  FaSpinner
} from 'react-icons/fa';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [sessionId] = useState(() => uuidv4());
  const quickReplies = [
    'Find government jobs in Ludhiana',
    'Show private IT jobs for graduates',
    'Highest paying jobs in Punjab',
    'Jobs for 0-2 years in Amritsar'
  ];
  
  const wsRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // WebSocket connection
  useEffect(() => {
    if (isOpen && !wsRef.current) {
      connectWebSocket();
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [isOpen]);

  const connectWebSocket = () => {
    try {
      const ws = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${sessionId}`);
      
      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.type === 'bot_message') {
          setIsTyping(false);
          setMessages(prev => [...prev, {
            id: Date.now(),
            type: 'bot',
            content: data.message,
            timestamp: data.timestamp
          }]);
        } else if (data.type === 'typing') {
          setIsTyping(true);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        // Attempt to reconnect after 3 seconds
        setTimeout(() => {
          if (isOpen) {
            connectWebSocket();
          }
        }, 3000);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      setIsConnected(false);
    }
  };

  const sendMessage = () => {
    if (!inputMessage.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      return;
    }

    const message = inputMessage.trim();
    
    // Add user message to UI immediately
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date().toISOString()
    }]);

    // Send message via WebSocket
    wsRef.current.send(JSON.stringify({
      type: 'user_message',
      message: message
    }));

    setInputMessage('');
    setIsTyping(true);
  };

  const handleQuickReply = (text) => {
    setInputMessage(text);
    setTimeout(() => {
      // ensure state updated then send
      const event = { key: 'Enter', shiftKey: false, preventDefault: () => {} };
      handleKeyPress(event);
    }, 0);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleChat = () => {
    if (isOpen && isMinimized) {
      setIsMinimized(false);
    } else if (isOpen && !isMinimized) {
      setIsMinimized(true);
    } else {
      setIsOpen(true);
      setIsMinimized(false);
    }
  };

  const closeChat = () => {
    setIsOpen(false);
    setIsMinimized(false);
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 bg-white hover:bg-blue-50 text-[#0057b8] p-4 rounded-full border-4 border-[#0057b8] shadow-2xl transition-all duration-300 hover:scale-110 z-50 w-16 h-16 flex items-center justify-center"
          aria-label="Open Chat"
          style={{ imageRendering: 'crisp-edges' }}
        >
          <FaCommentDots size={28} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed bottom-6 right-6 w-96 panel-translucent backdrop-blur rounded-lg shadow-2xl border border-[rgba(255,255,255,0.04)] z-50 transition-all duration-300 ${
          isMinimized ? 'h-16' : 'h-[500px]'
        }`}>
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <FaRobot size={20} />
                {isConnected && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                )}
              </div>
              <div>
                <h3 className="font-semibold">Job Assistant</h3>
                <p className="text-xs opacity-90">
                  {isConnected ? 'Online' : 'Connecting...'}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="hover:bg-blue-800 p-1 rounded transition-colors"
                aria-label="Minimize"
              >
                <FaMinus size={14} />
              </button>
              <button
                onClick={closeChat}
                className="hover:bg-blue-800 p-1 rounded transition-colors"
                aria-label="Close"
              >
                <FaTimes size={14} />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          {!isMinimized && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[350px] panel-translucent">
                {messages.length === 0 && !isTyping && (
                  <div className="animate-fade-in">
                    <div className="panel-translucent border border-[rgba(255,255,255,0.04)] rounded-lg p-4 shadow-sm">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 rounded-full bg-blue-700 text-white">
                          <FaRobot size={16} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-100">Welcome to Job Assistant</h4>
                          <p className="text-sm text-gray-300 mt-1">Ask me about jobs by role, location, experience, or qualification.</p>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {quickReplies.map((q) => (
                              <button
                                key={q}
                                onClick={() => handleQuickReply(q)}
                                className="text-xs px-3 py-1 rounded-full border border-blue-600 text-blue-200 hover:bg-blue-700 hover:text-white transition-colors"
                                aria-label={`Quick reply: ${q}`}
                              >
                                {q}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl shadow-sm transition-transform duration-200 ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white translate-y-0'
                          : 'panel-translucent text-gray-100 border border-[rgba(255,255,255,0.04)] translate-y-0'
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.type === 'bot' && (
                          <FaRobot className="mt-1 text-blue-600 flex-shrink-0" size={16} />
                        )}
                        {message.type === 'user' && (
                          <FaUser className="mt-1 text-white flex-shrink-0" size={16} />
                        )}
                        <div className="flex-1">
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="panel-translucent border border-[rgba(255,255,255,0.04)] p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <FaRobot className="text-blue-400" size={16} />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-[rgba(255,255,255,0.04)] panel-translucent">
                <div className="flex space-x-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about jobs in Punjab..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent chat-input"
                    disabled={!isConnected}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!inputMessage.trim() || !isConnected}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-2 rounded-lg transition-colors"
                  >
                    <FaPaperPlane size={16} />
                  </button>
                </div>
                {!isConnected && (
                  <p className="text-xs text-red-500 mt-2">
                    Connecting to server... Please wait.
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ChatBot;

