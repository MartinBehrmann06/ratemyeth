import { Suspense } from "react";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import { EnvVarWarning } from "@/components/env-var-warning";
import { SiteHeader } from "@/components/site-header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex flex-col">
      <SiteHeader
        endSlot={
          !hasEnvVars ? (
            <EnvVarWarning />
          ) : (
            <Suspense>
              <AuthButton />
            </Suspense>
          )
        }
      />

      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">{children}</div>

      <footer className="border-t py-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 text-xs text-muted-foreground">
          <p>Secure area</p>
          <ThemeSwitcher />
        </div>
      </footer>
    </main>
  );
}

