"use client";
import React from "react";
import Sidebar from "./Sidebar";
import { ChatList, ChatListHeader } from "./ChatList";
import { ChatHeader } from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import MessageInput from "./MessageInput";
import { useChat } from "@/contexts/chatContext";
import { User } from "lucide-react";

const ChatDashboard: React.FC = () => {
  // Use the global context instead of local state
  const { currentUser, activeChat, messages, sendMessage, loading, error } =
    useChat();

  // Handle any errors from the context
  if (error.chats || error.messages || error.users || error.tags) {
    return (
      <div className="p-4">
        Error loading data:{" "}
        {(error.chats || error.messages || error.users || error.tags)?.message}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <header className="bg-white py-2 px-4 shadow-sm flex items-center justify-between border-b border-gray-300 flex-shrink-0">
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
          {/* Refresh button */}
          <button
            className="p-1.5 hover:bg-gray-100 rounded-md text-gray-500"
            title="Refresh"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
            </svg>
          </button>

          {/* Help button */}
          <button
            className="p-1.5 hover:bg-gray-100 rounded-md text-gray-500"
            title="Help"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </button>

          {/* Status indicator */}
          <div className="flex items-center px-2">
            <span className="text-sm text-gray-600 mr-2">5 / 6 phones</span>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          </div>

          {/* Upload/Sync button */}
          <button
            className="p-1.5 hover:bg-gray-100 rounded-md text-gray-500"
            title="Upload"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </button>

          {/* Notifications button */}
          <button
            className="p-1.5 hover:bg-gray-100 rounded-md text-gray-500"
            title="Notifications"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>

          {/* Settings/Menu button */}
          <button
            className="p-1.5 hover:bg-gray-100 rounded-md text-gray-500"
            title="Menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          </button>

          {/* User avatar */}
          <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border border-gray-300">
            <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-800 font-medium">
              <User size={16} />
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar with fixed width */}
        <div className="flex-shrink-0">
          <Sidebar />
        </div>

        {/* Chat list with fixed width and contained scrolling */}
        <div className="w-1/4 flex-shrink-0 border-r border-gray-200 flex flex-col h-full">
          {/* <ChatListHeader /> */}
          <ChatList />
        </div>

        {/* Chat content area with proper overflow handling */}
        <div className="flex-1 flex flex-col bg-gray-50 min-w-0">
          {activeChat ? (
            <>
              {/* Fixed chat header */}
              <div className="flex-shrink-0">
                <ChatHeader />
              </div>

              {/* Scrollable messages area */}
              {loading.messages ? (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  Loading messages...
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto">
                  <ChatMessages
                    messages={messages || []}
                    currentUserId={currentUser?.id || ""}
                  />
                </div>
              )}

              {/* Fixed message input at bottom */}
              <div className="flex-shrink-0">
                <MessageInput
                  onSendMessage={sendMessage}
                  disabled={!activeChat || !currentUser}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a chat to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatDashboard;
