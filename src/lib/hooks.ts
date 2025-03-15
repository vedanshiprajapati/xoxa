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
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          console.log("Not authenticated");
          return;
        }

        // Fetch chat IDs where the user is a participant
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

        // Fetch chats with their tags and last message
        const { data, error } = await supabase
          .from("chats")
          .select(
            `
            *,
            chat_participants!inner(user_id),
            messages(id, content, sender_id, created_at),
            chat_tags(
              tag:tags(*)
            )
          `
          )
          .in("id", chatIds)
          .order("updated_at", { ascending: false });

        if (error) throw error;

        // Process chats to include tags and last message
        const processedChats = data.map((chat) => {
          // Extract tags from chat_tags join
          const tags = chat.chat_tags?.map((ct: any) => ct.tag) || [];

          // Find the last message
          const lastMessage =
            chat.messages?.length > 0
              ? chat.messages[0] // Already sorted by created_at descending
              : null;

          return {
            ...chat,
            tags,
            lastMessage,
          };
        });

        setChats(processedChats);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch chats")
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchChats();

    // Real-time subscription for chat updates
    const channel = supabase
      .channel("chats")
      .on(
        "postgres_changes" as never,
        {
          event: "*",
          schema: "public",
          table: "chats",
        },
        (payload: { new: Chat; old: Chat; eventType: string }) => {
          setChats((prev) => {
            if (!prev) return null;

            const handleEvent = {
              INSERT: () => [payload.new as Chat, ...prev],
              UPDATE: () =>
                prev.map((chat) =>
                  chat.id === payload.new.id
                    ? { ...chat, ...payload.new }
                    : chat
                ),
              DELETE: () => prev.filter((chat) => chat.id !== payload.old.id),
              default: () => prev,
            };

            const updatedChats =
              handleEvent[payload.eventType as keyof typeof handleEvent]?.() ||
              prev;

            return updatedChats.sort(
              (a, b) =>
                new Date(b.updated_at).getTime() -
                new Date(a.updated_at).getTime()
            );
          });
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return { chats, isLoading, error, setChats };
}

export function useUsers() {
  const [users, setUsers] = useState<User[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        setIsLoading(true);

        const { data, error } = await supabase
          .from("users")
          .select("*")
          .order("created_at", { ascending: false });

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
  return { users, isLoading, error };
}

export function useAllUsers() {
  const [users, setUsers] = useState<User[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchAllUsers() {
      try {
        setIsLoading(true);

        const { data, error } = await supabase
          .from("users")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setUsers(data);
      } catch (err) {
        console.error("Error fetching all users:", err);
        setError(
          err instanceof Error ? err : new Error("Failed to fetch users")
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchAllUsers();
  }, []);

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

  return { tags, isLoading, error, setTags };
}

export function useCreateChat() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createChat = async (
    participants: string[],
    name?: string,
    tags: Tag[] = []
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
          tag_ids: tags.map((tag) => tag.id),
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
