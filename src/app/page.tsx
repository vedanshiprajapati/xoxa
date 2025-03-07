// /app/page.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ChatDashboard from "@/components/chat/chatDashboard";

export default function Home() {
  const router = useRouter();

  // useEffect(() => {
  //   // Check if user is authenticated
  //   const checkAuth = async () => {
  //     const {
  //       data: { session },
  //     } = await supabase.auth.getSession();

  //     if (!session) {
  //       // If not authenticated, redirect to login
  //       router.push("/login");
  //     }
  //   };

  //   checkAuth();
  // }, [router]);

  return (
    <main>
      <ChatDashboard />
    </main>
  );
}
