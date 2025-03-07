import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export function useChats() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchChats() {
      try {
        setLoading(true);

        // Get all chats for the current user
        const { data, error } = await supabase
          .from("chats")
          .select(
            `
            id,
            created_at,
            users:user1_id(id, name, avatar_url),
            other_user:user2_id(id, name, avatar_url),
            messages(id, content, created_at, sender_id)
          `
          )
          .order("created_at", { ascending: false });

        if (error) throw error;

        // Format the data for the UI
        const formattedChats = data.map((chat) => {
          const lastMessage =
            chat.messages.length > 0 ? chat.messages[0] : null;

          return {
            id: chat.id,
            name: chat.other_user.name || chat.other_user.id,
            lastMessage: lastMessage ? lastMessage.content : "No messages yet",
            date: new Date(chat.created_at).toLocaleDateString(),
            avatar: chat.other_user.avatar_url,
            unread: 0, // You would need to calculate this
          };
        });

        setChats(formattedChats);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchChats();
  }, []);

  return { chats, loading, error };
}
