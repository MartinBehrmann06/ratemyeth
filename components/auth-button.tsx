import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";

export async function AuthButton() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const meta = user?.user_metadata as Record<string, unknown> | undefined;
  const username =
    typeof meta?.username === "string"
      ? meta.username
      : typeof meta?.display_name === "string"
        ? meta.display_name
        : null;

  return user ? (
    <div className="flex max-w-[min(100vw-2rem,28rem)] flex-wrap items-center justify-end gap-2 sm:max-w-none md:gap-3">
      <Button asChild size="sm" variant="secondary" className="rounded-full px-4 font-semibold">
        <Link href="/dashboard">Dashboard</Link>
      </Button>
      <span className="hidden text-sm font-medium text-muted-foreground sm:inline">
        Hey, {username ?? user.email}!
      </span>
      <LogoutButton />
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <Button asChild size="sm" variant="secondary" className="rounded-full px-4 font-semibold">
        <Link href="/auth/login">Login</Link>
      </Button>
      <Button asChild size="sm" className="rounded-full px-4 font-semibold">
        <Link href="/auth/sign-up">Get access now</Link>
      </Button>
    </div>
  );
}
