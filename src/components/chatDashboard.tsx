// components/ChatDashboard.jsx
"use client";
import React, { useState, useEffect, act } from "react";
import Image from "next/image";
import {
  Search,
  Filter,
  Save,
  Phone,
  RefreshCw,
  HelpCircle,
  ExternalLink,
  Bell,
  User,
  Home,
  MessageCircle,
  Menu,
  BarChart2,
  Contact,
  Settings,
  PlusCircle,
  MoreVertical,
  Smile,
  Paperclip,
  Clock,
  Mic,
  Send,
  Check,
  ChevronDown,
  PlusSquare,
  Calendar,
  Image as ImageIcon,
  ArrowLeft,
  ListFilter,
  Award,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function ChatDashboard() {
  const router = useRouter();
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredView, setFilteredView] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Dummy data based on the image
  const dummyChats = [
    {
      id: "1",
      name: "Test Skope Final 5",
      lastMessage: "Support2: This doesn't go on Tuesday...",
      phone: "+91 99178 44008 +1",
      date: "Yesterday",
      tags: ["Demo"],
      unread: 4,
      avatar: null,
    },
    {
      id: "2",
      name: "Periskope Team Chat",
      lastMessage: "Periskope: Test message",
      phone: "+91 99178 44008 +3",
      date: "28-Feb-25",
      tags: ["Demo", "Internal"],
      unread: 0,
      avatar: "/periskope-logo.png",
    },
    {
      id: "3",
      name: "+91 99999 99999",
      lastMessage: "Hi there, I'm Swapnika, Co-Founder of ...",
      phone: "+91 92898 69899 +1",
      date: "25-Feb-25",
      tags: ["Demo", "Signup"],
      unread: 0,
      avatar: null,
    },
    {
      id: "4",
      name: "Test Demo17",
      lastMessage: "Rohosen: 123",
      phone: "+91 99178 44008 +1",
      date: "25-Feb-25",
      tags: ["Content", "Demo"],
      unread: 0,
      avatar: "/user1.png",
    },
    {
      id: "5",
      name: "Test El Centro",
      lastMessage: "Roshnag: Hello, Ahmadport!",
      phone: "+91 99178 44008",
      date: "04-Feb-25",
      tags: ["Demo"],
      unread: 0,
      avatar: null,
    },
    {
      id: "6",
      name: "Testing group",
      lastMessage: "Testing 12345",
      phone: "+91 92898 69899",
      date: "27-Jan-25",
      tags: ["Demo"],
      unread: 0,
      avatar: null,
    },
    {
      id: "7",
      name: "Yasin 3",
      lastMessage: "First Bulk Message",
      phone: "+91 99178 44008 +3",
      date: "25-Nov-24",
      tags: ["Demo", "Dont Send"],
      unread: 0,
      avatar: "/user2.png",
    },
    {
      id: "8",
      name: "Test Skope Final 9473",
      lastMessage: "Heyy",
      phone: "+91 99178 44008 +1",
      date: "01-Jan-25",
      tags: ["Demo"],
      unread: 0,
      avatar: null,
    },
    {
      id: "9",
      name: "Skope Demo",
      lastMessage: "test 123",
      phone: "+91 92898 69899",
      date: "20-Dec-24",
      tags: ["Demo"],
      unread: 0,
      avatar: "/skope-logo.png",
    },
    {
      id: "10",
      name: "Test Demo15",
      lastMessage: "test 123",
      phone: "+91 92898 69899",
      date: "20-Dec-24",
      tags: ["Demo"],
      unread: 0,
      avatar: "/user1.png",
    },
  ];

  const dummyMessages = {
    "5": [
      {
        id: "1",
        content: "CVFER",
        sender: "Roshnag Airtel",
        timestamp: "11:51",
        isMe: false,
        phone: "+91 63846 47925",
      },
      {
        id: "2",
        content: "CDERT",
        sender: "Roshnag Airtel",
        timestamp: "11:54",
        isMe: false,
        phone: "+91 63846 47925",
      },
      {
        id: "3",
        content: "Hello, South Euna!",
        sender: "Roshnag Airtel",
        timestamp: "08:01",
        isMe: false,
        phone: "+91 63846 47925",
      },
      {
        id: "4",
        content: "Hello, Livonia!",
        sender: "Roshnag Airtel",
        timestamp: "08:01",
        isMe: false,
        phone: "+91 63846 47925",
      },
      {
        id: "5",
        content: "test el centro",
        sender: "Periskope",
        timestamp: "08:43",
        isMe: true,
        phone: "+91 99178 44008",
        read: true,
        sentBy: "bharatgnatarajan.dev",
      },
      {
        id: "6",
        content: "CDERT",
        sender: "Roshnag Airtel",
        timestamp: "08:49",
        isMe: false,
        phone: "+91 63846 47925",
      },
      {
        id: "7",
        content: "testing",
        sender: "Periskope",
        timestamp: "08:49",
        isMe: true,
        phone: "+91 99178 44008",
        read: true,
        sentBy: "bharatgnatarajan.dev",
      },
      {
        id: "8",
        content: "hello",
        sender: "Periskope",
        timestamp: "12:07",
        isMe: true,
        phone: "+91 99178 44008",
        read: true,
      },
    ],
  };

  useEffect(() => {
    // Set initial data
    setChats(dummyChats);
    setActiveChat(dummyChats[4]); // Set "Test El Centro" as active by default
    setMessages(dummyMessages["5"]);
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Create new message object
    const newMessage = {
      id: `new-${Date.now()}`,
      content: message,
      sender: "Periskope",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isMe: true,
      phone: "+91 99178 44008",
      read: false,
    };

    // Update messages state with the new message
    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
    if (!activeChat) {
      return;
    }
    // In a real application, you would also save the message to Supabase
    const { data, error } = await supabase.from("messages").insert([
      {
        chat_id: activeChat.id,
        sender_id: "current-user-id",
        content: message,
      },
    ]);
  };

  const handleChatSelect = (chat) => {
    setActiveChat(chat);
    setMessages(dummyMessages[chat.id] || []);
  };

  // Format timestamp to display just the time
  const formatTime = (dateString) => {
    if (dateString === "Yesterday") return "Yesterday";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white py-2 px-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-md bg-green-600 flex items-center justify-center text-white font-bold">
            P<span className="text-xs">12</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-500">
            <div className="w-3 h-3 rounded-full bg-gray-500"></div>
            <span className="text-sm">chats</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <RefreshCw size={18} className="text-gray-600" />
          <HelpCircle size={18} className="text-gray-600" />
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
            <span className="text-sm text-gray-600">5 / 6 phones</span>
            <ChevronDown size={14} className="text-gray-600" />
          </div>
          <ExternalLink size={18} className="text-gray-600" />
          <Bell size={18} className="text-gray-600" />
          <User size={18} className="text-gray-600" />
          <Menu size={18} className="text-gray-600" />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <nav className="w-14 bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-6">
          <Home size={22} className="text-gray-600" />
          <div className="relative">
            <MessageCircle size={22} className="text-green-600" />
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-xs text-green-600">6</span>
            </div>
          </div>
          <BarChart2 size={22} className="text-gray-600" />
          <Contact size={22} className="text-gray-600" />
          <Menu size={22} className="text-gray-600" />
          <div className="mt-auto">
            <Settings size={22} className="text-gray-600" />
          </div>
        </nav>

        {/* Chat List */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
          {/* Chat list header */}
          <div className="p-3 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-1">
                <ListFilter size={18} className="text-green-600" />
                <span className="text-green-600 font-medium text-sm">
                  Custom filter
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-2 py-1 text-xs text-gray-600 border border-gray-300 rounded">
                  Save
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <Search
                  size={16}
                  className="absolute left-2 top-2 text-gray-400"
                />
                <input
                  type="text"
                  className="w-full pl-8 pr-2 py-1.5 border border-gray-300 rounded text-sm"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                className={`px-2 py-1.5 text-xs border border-gray-300 rounded flex items-center ${
                  filteredView ? "bg-green-100 text-green-600" : "text-gray-600"
                }`}
                onClick={() => setFilteredView(!filteredView)}
              >
                <Filter size={14} className="mr-1" />
                Filtered
                <div className="ml-1 w-2 h-2 bg-green-600 rounded-full"></div>
              </button>
            </div>
          </div>

          {/* Chat list */}
          <div className="flex-1 overflow-y-auto">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 ${
                  activeChat?.id === chat.id ? "bg-gray-100" : ""
                }`}
                onClick={() => handleChatSelect(chat)}
              >
                <div className="flex">
                  <div className="mr-2 relative">
                    {chat.avatar ? (
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                        <img
                          src={chat.avatar}
                          alt={chat.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white">
                        {chat.name.charAt(0)}
                      </div>
                    )}
                    {chat.unread > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                        <span className="text-xs text-white">
                          {chat.unread}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div className="font-medium text-sm truncate">
                        {chat.name}
                      </div>
                      <div className="text-xs text-gray-500 ml-1 whitespace-nowrap">
                        {formatTime(chat.date)}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 truncate">
                      {chat.lastMessage}
                    </div>
                    <div className="flex items-center mt-1">
                      <div className="text-xs text-gray-500">{chat.phone}</div>
                      <div className="ml-auto flex">
                        {chat.tags.map((tag, index) => (
                          <span
                            key={index}
                            className={`text-xs px-1.5 py-0.5 rounded mr-1 ${
                              tag === "Demo"
                                ? "bg-orange-100 text-orange-600"
                                : tag === "Internal"
                                ? "bg-green-100 text-green-600"
                                : tag === "Signup"
                                ? "bg-green-500 text-white"
                                : tag === "Content"
                                ? "bg-green-200 text-green-700"
                                : tag === "Dont Send"
                                ? "bg-red-100 text-red-600"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {activeChat && (
            <>
              {/* Chat header */}
              <div className="bg-white p-3 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-3">
                    <img
                      src="/api/placeholder/40/40"
                      alt="User"
                      className="w-10 h-10 rounded-full bg-gray-300"
                    />
                  </div>
                  <div>
                    <div className="font-medium">{activeChat.name}</div>
                    <div className="text-xs text-gray-500 flex items-center space-x-1">
                      <div className="flex items-center">
                        <span>
                          Roshnag Airtel, Boshnag Jio, Bharat Kumar Ramesh,
                          Periskope
                        </span>
                        <span className="ml-2">+3</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button className="text-gray-500">
                    <Search size={18} />
                  </button>
                  <button className="text-gray-500">
                    <Award size={18} />
                  </button>
                  <button className="text-gray-500">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>

              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.isMe ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs ${
                        msg.isMe
                          ? "bg-green-100 rounded-lg p-3"
                          : "bg-white rounded-lg p-3 shadow-sm"
                      }`}
                    >
                      {!msg.isMe && (
                        <div className="font-medium text-sm text-gray-800 mb-1">
                          {msg.sender}
                        </div>
                      )}
                      <div className="text-sm break-words">{msg.content}</div>
                      <div className="flex justify-end items-center mt-1 text-xs text-gray-500 space-x-1">
                        <span>{msg.timestamp}</span>
                        {msg.isMe && msg.read && (
                          <span className="text-green-500">
                            <Check size={12} />
                          </span>
                        )}
                      </div>
                      {msg.isMe && msg.sentBy && (
                        <div className="text-xs text-gray-500 flex items-center mt-1">
                          <Check size={10} className="text-green-500 mr-1" />
                          {msg.sentBy}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Message input */}
              <div className="bg-white p-3 border-t border-gray-200">
                <div className="flex items-center bg-white rounded-lg">
                  <div className="px-2 flex space-x-2">
                    <WhatsAppIcon size={20} className="text-green-500" />
                    <span className="text-xs text-gray-500">Private Note</span>
                  </div>

                  <form
                    onSubmit={handleSendMessage}
                    className="flex-1 flex items-center"
                  >
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="flex-1 py-2 px-3 border-none focus:outline-none text-sm"
                      placeholder="Message..."
                    />
                    <div className="flex items-center space-x-3 px-2">
                      <button type="button" className="text-gray-500">
                        <Paperclip size={18} />
                      </button>
                      <button type="button" className="text-gray-500">
                        <Smile size={18} />
                      </button>
                      <button type="button" className="text-gray-500">
                        <Calendar size={18} />
                      </button>
                      <button type="button" className="text-gray-500">
                        <Clock size={18} />
                      </button>
                      <button type="button" className="text-gray-500">
                        <ImageIcon size={18} />
                      </button>
                      <button type="button" className="text-gray-500">
                        <Mic size={18} />
                      </button>
                      <button
                        type="submit"
                        disabled={!message.trim()}
                        className={`bg-green-600 p-2 rounded-full ${
                          !message.trim() ? "opacity-50" : ""
                        }`}
                      >
                        <Send size={18} className="text-white" />
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Custom WhatsApp Icon
const WhatsAppIcon = ({ size, className }) => {
  return (
    <svg
      width={size || 24}
      height={size || 24}
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
    >
      <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.195 2.105 3.195 5.1 4.485.714.3 1.27.48 1.704.629.714.227 1.365.195 1.88.121.574-.091 1.767-.721 2.016-1.426.255-.705.255-1.29.18-1.425-.074-.135-.27-.21-.57-.345m-5.446 7.443h-.016c-1.77 0-3.524-.48-5.055-1.38l-.36-.214-3.75.975 1.005-3.645-.239-.375c-.99-1.576-1.516-3.391-1.516-5.26 0-5.445 4.455-9.885 9.942-9.885 2.654 0 5.145 1.035 7.021 2.91 1.875 1.859 2.909 4.35 2.909 6.99-.004 5.444-4.46 9.885-9.935 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652c1.746.943 3.71 1.444 5.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.495-8.411" />
    </svg>
  );
};
