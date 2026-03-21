import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { 
  Send, Paperclip, MoreVertical, Search, ArrowLeft, 
  User as UserIcon, Loader2, MessageSquare, Phone, Info
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext';
import chatAPI from '../../services/chatService';
import toast from 'react-hot-toast';

const Chat = () => {
  const { bookingId: paramBookingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { subscribe } = useSocket();
  
  const [conversations, setConversations] = useState([]);
  const [activeBookingId, setActiveBookingId] = useState(paramBookingId || null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const messagesEndRef = useRef(null);
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch all conversations
  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await chatAPI.getConversations();
      if (response.success) {
        setConversations(response.data);
        
        // If we have a bookingId from params, find that conversation
        if (paramBookingId) {
          const active = response.data.find(c => c.bookingId === paramBookingId);
          if (active) setActiveChat(active);
        }
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error('Failed to load chats');
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for active chat
  const fetchMessages = async (bookingId) => {
    try {
      setMessagesLoading(true);
      const response = await chatAPI.getMessages(bookingId);
      if (response.success) {
        setMessages(response.data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setMessagesLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [paramBookingId]);

  useEffect(() => {
    if (activeBookingId) {
      fetchMessages(activeBookingId);
    }
  }, [activeBookingId]);

  // Subscribe to real-time messages
  useEffect(() => {
    const unsubscribe = subscribe('chat:message', (data) => {
      // If message is for the currently open chat, add it to messages
      if (data.bookingId === activeBookingId) {
        setMessages(prev => [...prev, data.message]);
      } else {
        // Otherwise, update conversations list to show new message/unread
        fetchConversations();
        toast.success(`New message from ${data.senderName}`);
      }
    });

    return () => unsubscribe();
  }, [subscribe, activeBookingId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeBookingId) return;

    const messageContent = newMessage.trim();
    setNewMessage('');

    try {
      const response = await chatAPI.sendMessage({
        bookingId: activeBookingId,
        message: messageContent
      });

      if (response.success) {
        setMessages(prev => [...prev, response.data]);
        // Update last message in conversations list
        setConversations(prev => prev.map(c => 
          c.bookingId === activeBookingId 
            ? { ...c, lastMessage: messageContent, lastMessageTime: new Date().toISOString() }
            : c
        ));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      setNewMessage(messageContent); // Restore message
    }
  };

  const handleSelectChat = (chat) => {
    setActiveBookingId(chat.bookingId);
    setActiveChat(chat);
    // Navigate with the correct role prefix
    const rolePrefix = user?.role === 'provider' ? 'service-provider' : user?.role === 'admin' ? 'admin' : 'user';
    navigate(`/${rolePrefix}/chat/${chat.bookingId}`);
  };

  const filteredConversations = conversations.filter(c => 
    c.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get initials from name (e.g., "Dhruv Prashant Shere" -> "DPS")
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 3); // Limit to 3 characters
  };

  return (
    <div className="flex h-[calc(100vh-80px)] bg-gray-50 overflow-hidden" style={{ backgroundColor: 'var(--bg-color)' }}>
      {/* Sidebar - Chat List */}
      <div className={`w-full md:w-80 lg:w-96 border-r flex flex-col bg-white ${activeBookingId ? 'hidden md:flex' : 'flex'}`} style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
        <div className="p-4 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
          <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-color)' }}>Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input 
              type="text" 
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', border: '1px solid var(--border-color)' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No conversations found</p>
            </div>
          ) : (
            filteredConversations.map((chat) => (
              <div 
                key={chat.bookingId}
                onClick={() => handleSelectChat(chat)}
                className={`p-4 flex gap-3 cursor-pointer hover:bg-gray-50 transition-colors ${activeBookingId === chat.bookingId ? 'bg-blue-50 hover:bg-blue-50' : ''}`}
                style={{ 
                  backgroundColor: activeBookingId === chat.bookingId ? 'var(--accent-fade)' : 'transparent',
                  borderBottom: '1px solid var(--border-color)'
                }}
              >
                <div className="relative h-12 w-12 flex-shrink-0 rounded-full flex items-center justify-center font-bold text-lg"
                  style={{
                    backgroundColor: 'var(--accent-color)',
                    color: 'white'
                  }}
                >
                  {getInitials(chat.otherUser.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold truncate" style={{ color: 'var(--text-color)' }}>{chat.otherUser.name}</h4>
                    <span className="text-xs text-gray-500">{formatTime(chat.lastMessageTime)}</span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col bg-white ${!activeBookingId ? 'hidden md:flex' : 'flex'}`} style={{ backgroundColor: 'var(--card-bg)' }}>
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-color)' }}>
              <div className="flex items-center gap-3">
                <button onClick={() => setActiveBookingId(null)} className="md:hidden p-2 hover:bg-gray-100 rounded-full">
                  <ArrowLeft className="h-5 w-5" style={{ color: 'var(--text-color)' }} />
                </button>
                <div className="h-10 w-10 rounded-full flex items-center justify-center overflow-hidden font-bold"
                  style={{
                    backgroundColor: 'var(--accent-color)',
                    color: 'white'
                  }}
                >
                  {getInitials(activeChat.otherUser.name)}
                </div>
                <div>
                  <h3 className="font-bold text-lg" style={{ color: 'var(--text-color)' }}>{activeChat.otherUser.name}</h3>
                  <p className="text-xs text-green-500">Active Booking: {activeChat.bookingId.slice(-6).toUpperCase()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-full" style={{ color: 'var(--text-color)' }}>
                  <Phone className="h-5 w-5" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full" style={{ color: 'var(--text-color)' }}>
                  <Info className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50" style={{ backgroundColor: 'var(--bg-color)' }}>
              {messagesLoading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
              ) : messages.map((msg, idx) => {
                const isMine = msg.senderId._id === user.id || msg.senderId === user.id;
                return (
                  <div key={msg._id || idx} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${isMine ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white rounded-bl-none shadow-sm'}`} 
                         style={{ 
                           backgroundColor: isMine ? 'var(--accent-color)' : 'var(--card-bg)',
                           color: isMine ? '#fff' : 'var(--text-color)',
                           border: isMine ? 'none' : '1px solid var(--border-color)'
                         }}>
                      <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                      <span className={`text-[10px] mt-1 block ${isMine ? 'text-blue-100' : 'text-gray-400'}`}>
                        {formatTime(msg.createdAt)}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <button type="button" className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                  <Paperclip className="h-5 w-5" />
                </button>
                <input 
                  type="text" 
                  placeholder="Type a message..."
                  className="flex-1 py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', border: '1px solid var(--border-color)' }}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button 
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  style={{ backgroundColor: 'var(--accent-color)' }}
                >
                  <Send className="h-5 w-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center" style={{ color: 'var(--text-color)', opacity: 0.5 }}>
            <div className="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: 'var(--bg-color)' }}>
              <MessageSquare className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Select a conversation</h3>
            <p className="max-w-xs">Choose a chat from the sidebar to start messaging with your provider or customer.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
