import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import { Chat, Message, User, Tag } from "@/types";

export function useChats() {
  const [chats, setChats] = useState<Chat[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchChats() {
      try {
        setIsLoading(true);
        // Get all chats the current user is a participant in
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          console.log("Not authenticated");
          return;
        }

        const { data: chatParticipants, error: participantsError } =
          await supabase
            .from("chat_participants")
            .select("chat_id")
            .eq("user_id", user.id);

        if (participantsError) throw participantsError;

        const chatIds = chatParticipants?.map((cp) => cp.chat_id) || [];

        if (chatIds.length === 0) {
          setChats([]);
          return;
        }

        // Get chat details
        const { data, error } = await supabase
          .from("chats")
          .select(
            `
            *,
            chat_participants!inner(user_id),
            messages(id, content, sender_id, created_at, is_read)
          `
          )
          .in("id", chatIds)
          .order("updated_at", { ascending: false });

        if (error) throw error;

        // Process chats to add last message and participants info
        const processedChats = await Promise.all(
          data.map(async (chat) => {
            // Get chat tags
            const { data: chatTags, error: tagsError } = await supabase
              .from("chat_tags")
              .select("tags(name, color)")
              .eq("chat_id", chat.id);

            if (tagsError) throw tagsError;

            // Get last message
            const { data: lastMessage, error: messageError } = await supabase
              .from("messages")
              .select("*, users!sender_id(name)")
              .eq("chat_id", chat.id)
              .order("created_at", { ascending: false })
              .limit(1)
              .single();

            if (messageError && messageError.code !== "PGRST116")
              throw messageError;

            // Get unread count
            const { data: unreadCount, error: unreadError } = await supabase
              .from("messages")
              .select("id", { count: "exact" })
              .eq("chat_id", chat.id)
              .eq("is_read", false)
              .not("sender_id", "eq", user.id);

            if (unreadError) throw unreadError;

            return {
              ...chat,
              tags: chatTags?.map((tag) => tag.tags) || [],
              lastMessage: lastMessage || null,
              unreadCount: unreadCount?.length || 0,
            };
          })
        );

        setChats(processedChats);
      } catch (err) {
        console.error("Error fetching chats:", err);
        setError(
          err instanceof Error ? err : new Error("Failed to fetch chats")
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchChats();

    // Subscribe to changes in chats
    // In your useChats hook's useEffect
    const channel = supabase
      .channel("chats")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chats",
        },
        (payload) => {
          // Get full chat details for the new chat
          supabase
            .from("chats")
            .select(
              `
        *,
        chat_participants!inner(user_id),
        messages(id, content, sender_id, created_at, is_read)
      `
            )
            .eq("id", payload.new.id)
            .single()
            .then(({ data }) => {
              if (data) {
                setChats((prev) => [data, ...(prev || [])]);
              }
            });
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return { chats, isLoading, error };
}

export function useMessages(chatId: string | undefined) {
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!chatId) {
      setMessages(null);
      setIsLoading(false);
      return;
    }

    async function fetchMessages() {
      try {
        setIsLoading(true);

        // Fetch messages for the chat
        const { data, error } = await supabase
          .from("messages")
          .select(
            `
            *,
            users!sender_id(name, avatar_url)
          `
          )
          .eq("chat_id", chatId)
          .order("created_at", { ascending: true });

        if (error) throw error;

        // Process messages to add sender info
        const processedMessages = data.map((msg) => ({
          ...msg,
          sender_name: msg.users?.name || "Unknown",
        }));

        setMessages(processedMessages);
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError(
          err instanceof Error ? err : new Error("Failed to fetch messages")
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchMessages();

    // Subscribe to new messages for this chat
    const messagesSubscription = supabase
      .channel(`messages:${chatId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          fetchMessages(); // Refresh all messages
        }
      )
      .subscribe();

    return () => {
      messagesSubscription.unsubscribe();
    };
  }, [chatId]);

  return { messages, isLoading, error };
}

export function useUsers() {
  const [users, setUsers] = useState<User[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        setIsLoading(true);

        const { data, error } = await supabase.from("users").select("*");

        if (error) throw error;
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(
          err instanceof Error ? err : new Error("Failed to fetch users")
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchUsers();
  }, []);
  console.log(users);
  return { users, isLoading, error };
}

export function useTags() {
  const [tags, setTags] = useState<Tag[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchTags() {
      try {
        setIsLoading(true);

        const { data, error } = await supabase.from("tags").select("*");

        if (error) throw error;
        setTags(data);
      } catch (err) {
        console.error("Error fetching tags:", err);
        setError(
          err instanceof Error ? err : new Error("Failed to fetch tags")
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchTags();
  }, []);

  return { tags, isLoading, error };
}

export function useCreateChat() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createChat = async (
    participants: string[],
    name?: string,
    tags: string[] = []
  ) => {
    setIsLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Create chat with transaction
      const { data: chat, error: chatError } = await supabase.rpc(
        "create_chat_with_participants",
        {
          chat_name: name,
          participant_ids: [...participants, user.id],
          tag_ids: tags,
          is_group: participants.length > 1,
        }
      );

      if (chatError) throw chatError;
      return chat;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Chat creation failed"));
      throw err;
    } finally {
      setIsLoading(false);
      // For React Query users:
      // queryClient.invalidateQueries(['chats']);
    }
  };

  return { createChat, isLoading, error };
}
