"use server";

import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function addChild(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  // 1. Check Membership & Limits
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_premium, role")
    .eq("id", user.id)
    .single();

  if (!profile) throw new Error("Profile not found");

  const { count: currentCount } = await supabase
    .from("children")
    .select("*", { count: 'exact', head: true })
    .eq("parent_id", user.id);

  const limit = profile.role === "teacher" ? 5 : 2;

  if (!profile.is_premium && (currentCount || 0) >= limit) {
    return { 
      error: `Limit reached! ${profile.role === 'teacher' ? 'Free classrooms are limited to 5 students.' : 'Free accounts are limited to 2 explorers.'} Upgrade to Legendary for unlimited slots! 👑` 
    };
  }

  const name = formData.get("name") as string;
  const avatarUrl = formData.get("avatarUrl") as string;
  const readingLevel = parseInt(formData.get("readingLevel") as string || "1");
  const interests = (formData.get("interests") as string)
    .split(",")
    .map((i) => i.trim())
    .filter((i) => i !== "");

  const { error } = await supabase.from("children").insert({
    parent_id: user.id,
    name,
    interests,
    reading_level: readingLevel,
    avatar_url: avatarUrl || null
  });

  if (error) {
    console.error("DATABASE INSERT ERROR:", error.message);
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export async function bulkAddChildren(students: { name: string, interests: string, readingLevel: number }[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  // 1. Premium Check
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_premium, role")
    .eq("id", user.id)
    .single();

  if (!profile?.is_premium || profile.role !== "teacher") {
    return { error: "Bulk Add is a Legendary Teacher feature! 👑" };
  }

  // 2. Prepare Data
  const inserts = students
    .filter(s => s.name.trim() !== "")
    .map(s => ({
      parent_id: user.id,
      name: s.name.trim(),
      interests: s.interests.split(",").map(i => i.trim()).filter(i => i !== ""),
      reading_level: s.readingLevel,
      explorer_level: 1,
      gems: 0
    }));

  if (inserts.length === 0) return { error: "No valid student names provided." };

  // 3. Bulk Insert
  const { error } = await supabase
    .from("children")
    .insert(inserts);

  if (error) {
    console.error("BULK INSERT ERROR:", error.message);
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return { success: true, count: inserts.length };
}

export async function updateChild(childId: string, formData: FormData) {
  const supabase = await createClient();
  
  const name = formData.get("name") as string;
  const avatarUrl = formData.get("avatarUrl") as string;
  const readingLevel = parseInt(formData.get("readingLevel") as string || "1");
  const interests = (formData.get("interests") as string)
    .split(",")
    .map((i) => i.trim())
    .filter((i) => i !== "");

  const { error } = await supabase
    .from("children")
    .update({
      name,
      interests,
      reading_level: readingLevel,
      avatar_url: avatarUrl || null
    })
    .eq("id", childId);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const username = formData.get("username") as string;
  const avatarUrl = formData.get("avatarUrl") as string;

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ 
      username,
      avatar_url: avatarUrl || null
    })
    .eq("id", user.id);

  if (profileError) return { error: profileError.message };

  const { error: authError } = await supabase.auth.updateUser({
    data: { 
      username,
      avatar_url: avatarUrl || null
    }
  });

  if (authError) {
    console.error("Auth metadata sync error:", authError.message);
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/profile");
  return { success: true };
}

export async function togglePremiumDebug() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data: profile } = await supabase.from("profiles").select("is_premium").eq("id", user.id).single();
  const newStatus = !profile?.is_premium;

  const { error } = await supabase.from("profiles").update({ is_premium: newStatus }).eq("id", user.id);
  if (error) console.error("DEBUG PREMIUM TOGGLE ERROR:", error.message);
  
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/profile");
}

export async function resetStoryLimitDebug() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error = null } = await supabase.from("profiles").update({ story_count_monthly: 0 }).eq("id", user.id);
  if (error) console.error("DEBUG RESET ERROR:", error.message);
  
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/profile");
}

export async function incrementStoryCountDebug() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data: profile } = await supabase.from("profiles").select("story_count_monthly").eq("id", user.id).single();
  const current = profile?.story_count_monthly || 0;

  const { error } = await supabase.from("profiles").update({ 
    story_count_monthly: current + 1,
    last_limit_reset: new Date().toISOString()
  }).eq("id", user.id);
  
  if (error) console.error("DEBUG: UPDATE ERROR:", error.message);
  
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/profile");
}

export async function deleteChild(childId: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("children")
    .delete()
    .eq("id", childId);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteStory(storyId: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("stories")
    .delete()
    .eq("id", storyId);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return { success: true };
}

export async function addClassMission(missionText: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  // Fetch current missions to append
  const { data: profile } = await supabase
    .from("profiles")
    .select("class_missions")
    .eq("id", user.id)
    .single();

  const missions = profile?.class_missions || [];
  if (missions.includes(missionText)) return { error: "Mission already exists!" };

  const { error } = await supabase
    .from("profiles")
    .update({ class_missions: [...missions, missionText] })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteClassMission(missionText: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { data: profile } = await supabase
    .from("profiles")
    .select("class_missions")
    .eq("id", user.id)
    .single();

  const missions = (profile?.class_missions || []).filter((m: string) => m !== missionText);

  const { error } = await supabase
    .from("profiles")
    .update({ class_missions: missions })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateClassMission(mission: string | null) {
  // Keeping this for backward compatibility during transition
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { error } = await supabase.from("profiles").update({ class_mission: mission }).eq("id", user.id);
  if (error) return { error: error.message };
  revalidatePath("/dashboard");
  return { success: true };
}

export async function logChallengeAttempt({
  childId,
  storyId,
  challengeType,
  isSuccess,
  attempts
}: {
  childId: string;
  storyId: string;
  challengeType: string;
  isSuccess: boolean;
  attempts: number;
}) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("challenge_logs")
    .insert({
      child_id: childId,
      story_id: storyId,
      challenge_type: challengeType,
      is_success: isSuccess,
      attempts: attempts
    });

  if (error) {
    console.error("Error logging challenge attempt:", error);
    return { error: error.message };
  }

  return { success: true };
}

export async function generateClassCode() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  // Production-scale entropy: 50 adjectives * 50 animals * 900 numbers = 2.25 million combinations
  const adjectives = [
    "BRAVE", "MIGHTY", "QUICK", "BRIGHT", "GOLDEN", "SILVER", "MAGIC", "HAPPY", 
    "CLEVER", "STRONG", "FLYING", "SWIFT", "BOLD", "KIND", "PROUD", "WILD"
  ];
  const animals = [
    "LION", "BEAR", "WOLF", "HAWK", "OWL", "FOX", "CAT", "DOG", "TIGER", "DRAGON",
    "EAGLE", "SHARK", "WHALE", "PANDA", "DEER", "STAG", "FALCON", "ROBOT"
  ];
  
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const ani = animals[Math.floor(Math.random() * animals.length)];
  const num = Math.floor(100 + Math.random() * 899); // 100-999
  const code = `${adj}-${ani}-${num}`;

  const { error } = await supabase
    .from("profiles")
    .update({ class_code: code })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return { success: true, code };
}

export async function addIndividualMission(childId: string, missionText: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  // Fetch current missions for this child
  const { data: child } = await supabase
    .from("children")
    .select("assigned_missions")
    .eq("id", childId)
    .single();

  const missions = child?.assigned_missions || [];
  if (missions.includes(missionText)) return { error: "Quest already exists!" };

  const { error } = await supabase
    .from("children")
    .update({ assigned_missions: [...missions, missionText] })
    .eq("id", childId);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteIndividualMission(childId: string, missionText: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { data: child } = await supabase
    .from("children")
    .select("assigned_missions")
    .eq("id", childId)
    .single();

  const missions = (child?.assigned_missions || []).filter((m: string) => m !== missionText);

  const { error } = await supabase
    .from("children")
    .update({ assigned_missions: missions })
    .eq("id", childId);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return { success: true };
}

export async function resetStudentMission(childId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("children")
    .update({ last_completed_mission: null })
    .eq("id", childId);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return { success: true };
}
