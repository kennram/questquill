"use server";

import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function verifyClassCode(code: string) {
  // Use Admin to lookup profile by code (bypass RLS)
  const { data: profile, error } = await supabaseAdmin
    .from("profiles")
    .select("id, username")
    .eq("class_code", code)
    .single();

  if (error || !profile) {
    return { error: "Invalid Class Code! Try again." };
  }

  // Use Admin to fetch the children for this teacher
  const { data: children, error: childError } = await supabaseAdmin
    .from("children")
    .select("id, name, avatar_url")
    .eq("parent_id", profile.id)
    .order("name");

  if (childError) {
    return { error: "Could not find students for this class." };
  }

  return { 
    success: true, 
    teacherName: profile.username,
    teacherId: profile.id,
    children: children 
  };
}

export async function loginStudent(teacherId: string, studentId: string) {
  // Verify student belongs to teacher (security check) using Admin
  const { data: child } = await supabaseAdmin
    .from("children")
    .select("id, name")
    .eq("id", studentId)
    .eq("parent_id", teacherId)
    .single();

  if (!child) {
    return { error: "Login failed. Student does not belong to this class." };
  }

  // Set Cookie
  const cookieStore = await cookies();
  const sessionData = JSON.stringify({ teacherId, studentId, name: child.name });
  
  cookieStore.set("student_session", sessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7 // 1 week
  });

  redirect("/student/dashboard");
}
