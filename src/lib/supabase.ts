// /lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  },
});
// Real-time listeners setup
export const setupChatSubscription = (chatId: string, callback: () => void) => {
  return supabase
    .channel(`chat-${chatId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `chat_id=eq.${chatId}`,
      },
      callback
    )
    .subscribe();
};
