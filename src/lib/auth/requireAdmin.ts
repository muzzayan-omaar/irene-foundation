import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { authorized: false as const, adminUser: null };
  }

  const adminUser = await prisma.adminUser.findUnique({
    where: { supabaseUid: user.id },
  });

  if (!adminUser) {
    return { authorized: false as const, adminUser: null };
  }

  return { authorized: true as const, adminUser };
}