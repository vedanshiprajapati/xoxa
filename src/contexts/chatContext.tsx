"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import { Chat, Message, User, Tag } from "@/types";
import { useChats, useUsers, useTags } from "@/lib/hooks";

interface ChatContextType {
  currentUser: User | null;
  chats: Chat[] | null;
  activeChat: Chat | null;
  setActiveChat: (chat: Chat | null) => void;
  messages: Message[] | null;
  users: User[] | null;
  tags: Tag[] | null;
  sendMessage: (content: string) => Promise<void>;
  loading: {
    chats: boolean;
    messages: boolean;
    users: boolean;
    tags: boolean;
  };
  error: {
    chats: Error | null;
    messages: Error | null;
    users: Error | null;
    tags: Error | null;
  };
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredView: boolean;
  setFilteredView: (filtered: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredView, setFilteredView] = useState(true);

  // Fetch data using custom hooks
  const {
    chats,
    setChats,
    isLoading: chatsLoading,
    error: chatsError,
  } = useChats();
  const { users, isLoading: usersLoading, error: usersError } = useUsers();
  const { tags, isLoading: tagsLoading, error: tagsError } = useTags();

  // Fetch current user
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

  // Fetch messages for active chat
  useEffect(() => {
    if (!activeChat) {
      setMessages(null);
      return;
    }

    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from("messages")
          .select(
            `
            *,
            users!sender_id(name, avatar_url)
          `
          )
          .eq("chat_id", activeChat.id)
          .order("created_at", { ascending: true });

        if (error) throw error;

        const processedMessages = data.map((msg) => ({
          ...msg,
          sender_name: msg.users?.name || "Unknown",
        }));

        setMessages(processedMessages);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();

    // Subscribe to new messages and chat updates
    const subscription = supabase
      .channel(`messages:${activeChat.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${activeChat.id}`,
        },
        (payload) => {
          fetchMessages();
          if (chats && setChats) {
            const updatedChats = chats
              .map((chat) =>
                chat.id === activeChat.id
                  ? {
                      ...chat,
                      updated_at: new Date().toISOString(),
                      lastMessage: {
                        ...chat.lastMessage,
                        content: payload.new.content,
                        created_at: new Date().toISOString(),
                        id: chat.lastMessage?.id || "",
                        chat_id: activeChat.id,
                        sender_id: currentUser?.id || "",
                        sent_by: currentUser?.email || "",
                      },
                    }
                  : chat
              )
              .sort(
                (a, b) =>
                  new Date(b.updated_at).getTime() -
                  new Date(a.updated_at).getTime()
              );

            setChats(updatedChats);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [activeChat, chats]);

  const sendMessage = async (content: string) => {
    if (!activeChat || !currentUser) return;

    try {
      const { error } = await supabase.from("messages").insert({
        chat_id: activeChat.id,
        sender_id: currentUser.id,
        content,
        sent_by: currentUser.email,
      });

      if (error) throw error;

      // Update chat's updated_at and refresh chat list
      const { data: updatedChat } = await supabase
        .from("chats")
        .update({
          updated_at: new Date().toISOString(),
          last_message: content,
        })
        .eq("id", activeChat.id)
        .select()
        .single();

      if (updatedChat && chats) {
        const updatedChats = [
          updatedChat,
          ...chats.filter((chat) => chat.id !== activeChat.id),
        ];
        // @ts-ignore
        setChats(updatedChats);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const value = {
    currentUser,
    chats:
      chats?.sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      ) || null,
    activeChat,
    setActiveChat,
    messages,
    users,
    tags,
    sendMessage,
    loading: {
      chats: chatsLoading,
      messages: !activeChat || (activeChat && !messages),
      users: usersLoading,
      tags: tagsLoading,
    },
    error: {
      chats: chatsError,
      messages: null,
      users: usersError,
      tags: tagsError,
    },
    searchTerm,
    setSearchTerm,
    filteredView,
    setFilteredView,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
