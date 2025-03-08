"use client";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { LogOut } from "lucide-react";
import { useChat } from "@/contexts/chatContext";

export function LogoutButton() {
  const router = useRouter();
  const { setChats, setActiveChat, setSearchTerm, setFilteredView } = useChat();

  const handleLogout = async () => {
    // Clear Supabase session
    await supabase.auth.signOut();

    // Reset all context states
    setChats(null);
    setActiveChat(null);
    setSearchTerm("");
    setFilteredView(true);

    // Redirect to login
    router.push("/login");
  };

  return (
    <Button
      variant="secondary"
      onClick={handleLogout}
      className="cursor-pointer"
    >
      <LogOut />
    </Button>
  );
}
