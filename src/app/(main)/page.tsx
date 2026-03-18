import { DashboardClient } from "./dashboard-client";

const DEMO_MODE = !process.env.NEXT_PUBLIC_SUPABASE_URL;

export default async function HomePage() {
  if (DEMO_MODE) {
    return <DashboardClient displayName="데모 사용자" />;
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "사용자";

  return <DashboardClient displayName={displayName} />;
}
