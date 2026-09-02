import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const { email, password, fullName, role } = await request.json();

  if (!email || !password || !fullName || !role) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  // Step 1: confirm the caller is logged in and is a super_admin.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { data: callerRecord } = await supabase
    .from("admin_users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!callerRecord || callerRecord.role !== "super_admin") {
    return NextResponse.json(
      { error: "Only super admins can create new admin accounts." },
      { status: 403 }
    );
  }

  // Step 2: create the new user using the service role client.
  const adminClient = createAdminClient();
  const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (createError || !newUser.user) {
    return NextResponse.json(
      { error: createError?.message ?? "Failed to create user." },
      { status: 400 }
    );
  }

  // Step 3: add them to admin_users so they can actually access the dashboard.
  const { error: insertError } = await adminClient.from("admin_users").insert({
    id: newUser.user.id,
    full_name: fullName,
    role,
  });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 400 });
  }

  // Step 4: add them to the Team Channel so they can see it immediately.
  const { data: teamChannel } = await adminClient
    .from("conversations")
    .select("id")
    .eq("type", "channel")
    .eq("name", "Team Channel")
    .limit(1)
    .single();

  if (teamChannel) {
    await adminClient.from("conversation_participants").insert({
      conversation_id: teamChannel.id,
      admin_id: newUser.user.id,
    });
  }

  return NextResponse.json({ success: true });
}