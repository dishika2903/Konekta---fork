import React, { useState, useRef, useEffect } from "react"
import { 
  Send, 
  Search, 
  Phone, 
  Video, 
  Info, 
  Menu, 
  X, 
  Home, 
  MessageCircle, 
  Bell, 
  Plus, 
  User, 
  Heart, 
  Users, 
  Settings,
  ChevronLeft,
  ChevronRight, 
  Play, 
  PlusSquare
} 
from "lucide-react"
import { aiService } from "../services/aiResponseService"
import "./ChatApp.css"



const ChatApp = () => {
  const [conversations, setConversations] = useState([
    {
      id: 1,
      name: "Michael Daws",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      status: "Active now",
      lastMessage: "The hike was incredible! You should've seen the views 🏔️",
      time: "2:45 PM",
      unread: 2
    },
    {
      id: 2,
      name: "Laura Quinn",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
      status: "Online",
      lastMessage: "Thanks for your help with the project! 🙏",
      time: "1:20 PM",
      unread: 0
    },
    {
      id: 3,
      name: "Anjali Mehra",
      avatar: "https://randomuser.me/api/portraits/women/50.jpg",
      status: "Active 30m ago",
      lastMessage: "I finished reading that book you recommended! 📚",
      time: "12:15 PM",
      unread: 1
    },
    {
      id: 4,
      name: "David Chen",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
      status: "Active 1h ago",
      lastMessage: "You won't believe what happened at the game 😂",
      time: "11:30 AM",
      unread: 3
    },
    {
      id: 5,
      name: "Emma Wilson",
      avatar: "https://randomuser.me/api/portraits/women/28.jpg",
      status: "Online",
      lastMessage: "Coffee this weekend? ☕",
      time: "10:30 AM",
      unread: 0
    },
    {
      id: 6,
      name: "Alex Rodriguez",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      status: "Active 2h ago",
      lastMessage: "The concert tickets are sold out! 😭",
      time: "9:15 AM",
      unread: 1
    },
    {
      id: 7,
      name: "Sophie Kim",
      avatar: "https://randomuser.me/api/portraits/women/33.jpg",
      status: "Active now",
      lastMessage: "Can you review my presentation slides? 📊",
      time: "8:45 AM",
      unread: 2
    },
    {
      id: 8,
      name: "James Parker",
      avatar: "https://randomuser.me/api/portraits/men/67.jpg",
      status: "Online",
      lastMessage: "Movie night? I found that film you wanted to watch 🎬",
      time: "Yesterday",
      unread: 0
    }
  ])

  const [activeChat, setActiveChat] = useState(1)
  const [messages, setMessages] = useState({
    1: [
      { id: 1, text: "Hey! Just got back from that mountain hike I was telling you about! 🏔️", type: "received", time: "2:30 PM" },
      { id: 2, text: "No way! How was it? I've been wanting to check out that trail.", type: "sent", time: "2:31 PM" },
      { id: 3, text: "Absolutely breathtaking! The views from the summit were incredible. You have to come with me next time!", type: "received", time: "2:33 PM" },
      { id: 4, text: "That sounds amazing! I'm definitely down. When are you thinking of going again?", type: "sent", time: "2:34 PM" }
    ],
    2: [
      { id: 1, text: "Hi! Just wanted to thank you for your input on the quarterly report. 🙏", type: "received", time: "1:15 PM" },
      { id: 2, text: "Of course! Happy to help. How did the final presentation go?", type: "sent", time: "1:16 PM" },
      { id: 3, text: "It went really well! The team was impressed with the data analysis section you suggested.", type: "received", time: "1:18 PM" }
    ],
    3: [
      { id: 1, text: "I finally finished 'The Midnight Library'! 📚", type: "received", time: "12:10 PM" },
      { id: 2, text: "Oh wow! What did you think? It's one of my favorites!", type: "sent", time: "12:11 PM" },
      { id: 3, text: "It was beautiful! That scene with the piano player actually made me tear up. So moving! 🎹", type: "received", time: "12:13 PM" }
    ],
    4: [
      { id: 1, text: "Bro you missed the craziest basketball game last night! 🏀", type: "received", time: "11:25 AM" },
      { id: 2, text: "What happened?? I had to work late 😩", type: "sent", time: "11:26 AM" },
      { id: 3, text: "Triple overtime! And the winning shot was from half court with 2 seconds left! 😱", type: "received", time: "11:28 AM" },
      { id: 4, text: "NO WAY! Are you serious?? I can't believe I missed that!", type: "sent", time: "11:29 AM" }
    ],
    5: [
      { id: 1, text: "Hey! Are you free for coffee this weekend? ☕", type: "received", time: "10:25 AM" },
      { id: 2, text: "I'd love that! Saturday morning works best for me.", type: "sent", time: "10:26 AM" },
      { id: 3, text: "Perfect! How about 10 AM at our usual spot?", type: "received", time: "10:28 AM" }
    ],
    6: [
      { id: 1, text: "Bad news... the concert tickets sold out in 5 minutes! 😭", type: "received", time: "9:10 AM" },
      { id: 2, text: "Nooo! I was really looking forward to that show.", type: "sent", time: "9:11 AM" },
      { id: 3, text: "I know! But I found someone selling two tickets on the fan forum! 🎫", type: "received", time: "9:13 AM" }
    ],
    7: [
      { id: 1, text: "Hey! Could you review my presentation slides when you get a chance? 📊", type: "received", time: "8:40 AM" },
      { id: 2, text: "Sure thing! Send them over and I'll take a look.", type: "sent", time: "8:41 AM" },
      { id: 3, text: "Thanks! Just sent them to your email. Let me know what you think! 💕", type: "received", time: "8:43 AM" }
    ],
    8: [
      { id: 1, text: "Movie night this Friday? I found that indie film you wanted to watch! 🎬", type: "received", time: "Yesterday" },
      { id: 2, text: "Yes! Which one did you find?", type: "sent", time: "Yesterday" },
      { id: 3, text: "The one about the time-traveling librarian! It just got added to streaming. 🕰️", type: "received", time: "Yesterday" }
    ]
  })

  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false)
  const sidebarRef = useRef(null)
  const messagesEndRef = useRef(null)

  // Auto-retract sidebar on mouse leave
  useEffect(() => {
    const handleMouseLeave = () => {
      if (isSidebarExpanded) {
        setIsSidebarExpanded(false)
      }
    }

    const sidebar = sidebarRef.current
    if (sidebar) {
      sidebar.addEventListener('mouseleave', handleMouseLeave)
      return () => sidebar.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [isSidebarExpanded])

  // Auto-retract sidebar after inactivity
  useEffect(() => {
    let timeoutId
    if (isSidebarExpanded) {
      timeoutId = setTimeout(() => {
        setIsSidebarExpanded(false)
      }, 3000)
    }
    return () => clearTimeout(timeoutId)
  }, [isSidebarExpanded])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, activeChat, isTyping])

  const handleSidebarHover = () => {
    setIsSidebarExpanded(true)
  }

  const handleSidebarToggle = () => {
    setIsSidebarExpanded(!isSidebarExpanded)
  }

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const userMessage = {
      id: Date.now(),
      text: newMessage,
      type: "sent",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => ({
      ...prev,
      [activeChat]: [...(prev[activeChat] || []), userMessage]
    }))
    setNewMessage("")
    
    setIsTyping(true)

    // Generate AI response
    const chatHistory = messages[activeChat] || []
    const aiResponse = aiService.generateResponse(newMessage, chatHistory, activeChat)

    setTimeout(() => {
      const personMessage = {
        id: Date.now() + 1,
        text: aiResponse.text,
        type: "received",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }

      setMessages(prev => ({
        ...prev,
        [activeChat]: [...(prev[activeChat] || []), personMessage]
      }))
      setIsTyping(false)

      // Update conversation last message
      setConversations(prev => 
        prev.map(convo => 
          convo.id === activeChat 
            ? { ...convo, lastMessage: aiResponse.text, time: "Just now" }
            : convo
        )
      )
    }, aiResponse.delay)
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const selectConversation = (conversationId) => {
    setActiveChat(conversationId)
    setMobileSidebarOpen(false)
    setConversations(prev => 
      prev.map(convo => 
        convo.id === conversationId 
          ? { ...convo, unread: 0 }
          : convo
      )
    )
  }

  // Auto-reply to conversation starters
  const sendAutoReply = (conversationId, message) => {
    const quickReplies = {
      "hi": ["Hey there! 👋", "Hello! How's your day going?", "Hi! Great to hear from you! 😊"],
      "hello": ["Hey! What's up?", "Hello there! 👋", "Hi! How are you doing today?"],
      "hey": ["Hey! 👋", "What's up?", "Hey there! How's it going?"],
      "how are you": ["I'm doing great, thanks for asking! 😊", "Pretty good! How about you?", "Doing well! What's new with you?"],
      "what's up": ["Not much, just chatting with friends! 😄", "Just enjoying the day! How about you?", "Hey! Just going through some messages. What's up with you?"],
      "how's it going": ["It's going well! Thanks for asking 😊", "Pretty good! How are things with you?", "Going great! What's new in your world?"]
    }

    const lowerMessage = message.toLowerCase()
    let reply = null

    // Find matching quick reply
    for (const [key, replies] of Object.entries(quickReplies)) {
      if (lowerMessage.includes(key)) {
        reply = replies[Math.floor(Math.random() * replies.length)]
        break
      }
    }

    // If no quick reply found, use AI service
    if (!reply) {
      const chatHistory = messages[conversationId] || []
      const aiResponse = aiService.generateResponse(message, chatHistory, conversationId)
      reply = aiResponse.text
    }

    const autoReply = {
      id: Date.now() + 1000,
      text: reply,
      type: "received",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setTimeout(() => {
      setMessages(prev => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] || []), autoReply]
      }))

      // Update conversation last message
      setConversations(prev => 
        prev.map(convo => 
          convo.id === conversationId 
            ? { ...convo, lastMessage: reply, time: "Just now" }
            : convo
        )
      )
    }, 1000 + Math.random() * 2000)
  }

  const filteredConversations = conversations.filter(convo =>
    convo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    convo.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const activeConversation = conversations.find(c => c.id === activeChat)
  const activeMessages = messages[activeChat] || []

  return (
    <div className="app-container">
      {/* Mobile Header */}
      <div className="mobile-header">
        <button 
          className="menu-toggle"
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        >
          {mobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <h2>Messages</h2>
        <div style={{ width: "40px" }}></div>
      </div>

      {/* Mobile Overlay */}
      {mobileSidebarOpen && (
        <div 
          className="mobile-overlay"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Left Navigation Sidebar */}
      {/* Left Navigation Sidebar - Konekta Style */}
      <div 
        className={`left-sidebar ${isSidebarExpanded ? 'expanded' : 'collapsed'} ${mobileSidebarOpen ? 'mobile-open' : ''}`}
        ref={sidebarRef}
        onMouseEnter={handleSidebarHover}
      >
        <div className="sidebar-content">
          {/* Profile Avatar - Konekta Style */}
                    <div className="profile-section">
            <img
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt="Profile"
              className="profile-avatar"
            />
          </div>

          {/* Navigation Menu - Konekta Style */}
           <nav class="flex flex-col gap-4 w-full font-inter">
        <a href="landing.html" class="nav-item flex items-center px-3 py-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3 12l9-9 9 9v9a3 3 0 01-3 3H6a3 3 0 01-3-3z"
            />
          </svg>
          <span>Home</span>
        </a>
        <a href="#" class="nav-item flex items-center px-3 py-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="极 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="11" cy="11" r="7" />
            <line
              x1="21"
              y1="21"
              x2="16.65"
              y2="16.65"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span>Search</span>
        </a>
        <a href="#" class="nav-item flex items-center px-3 py-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <polygon points="12 2 19 21 12 17 5 21 12 2" />
          </svg>
          <span>Explore</span>
        </a>
        <a href="#" class="nav-item flex items-center px-3 py-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <rect x="2" y="4" width="20" height="16" rx="4" />
            <polygon points="10 10 16 14 10 18 10 10" fill="white" />
          </svg>
          <span>Reels</span>
        </a>
        <a
          href="messages.html"
          class="nav-item flex items-center px-3 py-2 active"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              d="M21 15V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z"
            />
            <polyline points="3 8 12 13 21 8" />
          </svg>
          <span>Messages <span class="badge">12</span></span>
        </a>
        <a
          href="notifications.html"
          class="nav-item flex items-center px-3 py-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span>Notifications</span>
        </a>
        <a href="#" class="nav-item flex items-center px-3 py-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>Create</span>
        </a>
      </nav>
          {/* Expand/Collapse Toggle Button */}
          <button 
            className="sidebar-toggle"
            onClick={handleSidebarToggle}
          >
            {isSidebarExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>
      </div>

      {/* Conversations Sidebar */}
      <div className={`conversations-sidebar ${mobileSidebarOpen ? 'mobile-open' : ''}`}>
        <div className="conversations-header">
          <h2>Messages</h2>
          <p>Your conversations</p>
        </div>

      
<div className="search-bar">
  <div className="search-container">
    <Search size={20} className="search-icon" />
    <input
      type="text"
      placeholder="Search conversations..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="search-input"
    />
    {searchQuery && (
      <button 
        className="search-clear"
        onClick={() => setSearchQuery("")}
        style={{
          position: 'absolute',
          right: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          color: '#888',
          cursor: 'pointer',
          padding: '4px',
          borderRadius: '50%',
          transition: 'all 0.3s ease'
        }}
      >
        <X size={16} />
      </button>
    )}
  </div>
</div>

        {/* Conversations List */}
        <div className="conversations-list">
          {filteredConversations.map(convo => (
            <div
              key={convo.id}
              className={`conversation-item ${activeChat === convo.id ? 'active' : ''}`}
              onClick={() => selectConversation(convo.id)}
            >
              <div className="avatar-container">
                <img
                  src={convo.avatar}
                  alt={convo.name}
                  className="conversation-avatar"
                />
                <div className={`status-dot ${convo.status.toLowerCase().includes('active') ? 'online' : 'away'}`} />
              </div>
              
              <div className="conversation-content">
                <div className="conversation-header">
                  <h3 className="conversation-name">{convo.name}</h3>
                  <span className="conversation-time">{convo.time}</span>
                </div>
                <p className="conversation-preview">{convo.lastMessage}</p>
              </div>

              {convo.unread > 0 && (
                <div className="unread-badge">
                  {convo.unread}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="chat-area">
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="chat-header">
              <div className="chat-user">
                <div className="avatar-container">
                  <img
                    src={activeConversation.avatar}
                    alt={activeConversation.name}
                    className="user-avatar"
                  />
                  <div className={`status-dot ${activeConversation.status.toLowerCase().includes('active') ? 'online' : 'away'}`} />
                </div>
                <div className="user-info">
                  <h2>{activeConversation.name}</h2>
                  <p className="user-status">{activeConversation.status}</p>
                </div>
              </div>
              <div className="chat-actions">
                <button className="action-btn">
                  <Phone size={20} />
                </button>
                <button className="action-btn">
                  <Video size={20} />
                </button>
                <button className="action-btn">
                  <Info size={20} />
                </button>
              </div>
            </div>

            {/* Messages Container */}
            <div className="messages-container">
              {activeMessages.map(message => (
                <div
                  key={message.id}
                  className={`message ${message.type}`}
                >
                  <div className="message-bubble">
                    <p className="message-text">{message.text}</p>
                    <span className="message-time">{message.time}</span>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="message received">
                  <div className="message-bubble typing-indicator">
                    <div className="typing-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <span>typing...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="message-input-container">
              <button className="attachment-btn">
                <Plus size={20} />
              </button>
              <input
                type="text"
                className="message-input"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button className="send-btn" onClick={sendMessage}>
                <Send size={20} />
              </button>
            </div>
          </>
        ) : (
          <div className="no-chat-selected">
            <div className="no-chat-icon">💬</div>
            <h3>No Conversation Selected</h3>
            <p>Choose a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  )
}



export default ChatApp