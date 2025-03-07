// /components/chat/ChatDashboard.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useChats, useMessages, useUsers } from "@/lib/hooks";
import { supabase, setupChatSubscription } from "@/lib/supabase";
import { Chat, Message, User } from "@/types";
import Sidebar from "./Sidebar";
import { ChatList } from "./chatList";
import { ChatHeader } from "./chatHeader";
import ChatMessages from "./chatMessages";
import MessageInput from "./MessageInput";

const ChatDashboard: React.FC = () => {
  // Current user - in a real app, this would come from authentication
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [filteredView, setFilteredView] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch data using our custom hooks
  const { chats, isLoading: isChatsLoading, error: chatsError } = useChats();
  const {
    messages,
    isLoading: isMessagesLoading,
    error: messagesError,
  } = useMessages(activeChat?.id);
  const { users, isLoading: isUsersLoading, error: usersError } = useUsers();

  // Get current user on component mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();

        if (data) {
          setCurrentUser(data);
        }
      }
    };

    fetchCurrentUser();
  }, []);

  // Subscribe to new messages for the active chat
  useEffect(() => {
    if (!activeChat) return;

    const subscription = setupChatSubscription(activeChat.id, () => {
      // This will trigger a refresh of the messages
      console.log("New message received");
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [activeChat]);

  const handleSendMessage = async (content: string) => {
    if (!activeChat || !currentUser) return;

    try {
      const { data, error } = await supabase
        .from("messages")
        .insert({
          chat_id: activeChat.id,
          sender_id: currentUser.id,
          content,
          is_read: false,
          sent_by: currentUser.email,
        })
        .select();

      if (error) throw error;
      console.log("Message sent:", data);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleChatSelect = (chat: Chat) => {
    setActiveChat(chat);
  };

  const loading = isChatsLoading || isMessagesLoading || isUsersLoading;
  const error = chatsError || messagesError || usersError;

  if (error) {
    return <div className="p-4">Error loading data: {error.message}</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
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
        <div className="flex items-center space-x-4">{/* Header icons */}</div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <ChatList />

        <div className="flex-1 flex flex-col bg-gray-50">
          {activeChat ? (
            <>
              <ChatHeader />

              <ChatMessages
                messages={messages || []}
                currentUserId={currentUser?.id || ""}
              />

              <MessageInput
                onSendMessage={handleSendMessage}
                disabled={!activeChat || !currentUser}
              />
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
