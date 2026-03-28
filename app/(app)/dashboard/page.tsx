import { redirect } from "next/navigation";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

async function UserDetails() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return JSON.stringify(data.claims, null, 2);
}

export default function UserDashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your dashboard</h1>
        <p className="text-muted-foreground">This area is only visible after sign-in.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your session</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs font-mono p-3 rounded border max-h-64 overflow-auto">
            <Suspense>
              <UserDetails />
            </Suspense>
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}

