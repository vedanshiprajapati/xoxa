// /types/index.ts
export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface Chat {
  id: string;
  name: string;
  is_group: boolean;
  avatar_url: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
  lastMessage?: Message | null;
  unreadCount?: number;
  tags?: Tag[];
}

export interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  sent_by: string | null;
  created_at: string;
  sender_name?: string;
  users?: {
    name: string;
    avatar_url: string | null;
  };
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  created_at: string;
}

export interface ChatParticipant {
  id: string;
  chat_id: string;
  user_id: string;
  is_admin: boolean;
  joined_at: string;
}

export interface ChatTag {
  id: string;
  chat_id: string;
  tag_id: string;
  created_at: string;
}

// Supabase Database type
export type Database = {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<User, "id" | "created_at" | "updated_at">>;
      };
      chats: {
        Row: Chat;
        Insert: Omit<Chat, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Chat, "id" | "created_at" | "updated_at">>;
      };
      messages: {
        Row: Message;
        Insert: Omit<Message, "id" | "created_at">;
        Update: Partial<Omit<Message, "id" | "created_at">>;
      };
      tags: {
        Row: Tag;
        Insert: Omit<Tag, "id" | "created_at">;
        Update: Partial<Omit<Tag, "id" | "created_at">>;
      };
      chat_participants: {
        Row: ChatParticipant;
        Insert: Omit<ChatParticipant, "id" | "joined_at">;
        Update: Partial<Omit<ChatParticipant, "id" | "joined_at">>;
      };
      chat_tags: {
        Row: ChatTag;
        Insert: Omit<ChatTag, "id" | "created_at">;
        Update: Partial<Omit<ChatTag, "id" | "created_at">>;
      };
    };
  };
};
