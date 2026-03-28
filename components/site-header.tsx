import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

type SiteHeaderProps = {
  /** Use `/#versus` so “About” works from any route */
  aboutHref?: string;
  /** Right side of the bar (e.g. `<AuthButton />`). Defaults to marketing Login / Get access. */
  endSlot?: ReactNode;
};

export function SiteHeader({
  aboutHref = "/#versus",
  endSlot,
}: SiteHeaderProps) {
  return (
    <header className="border-b border-border/80">
      <div className="mx-auto flex h-[4.5rem] max-w-5xl items-center justify-between px-4 md:h-20 md:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-6 md:gap-10">
          <Link
            href="/"
            className="shrink-0 py-1 text-xl font-black tracking-tight text-foreground transition-opacity hover:opacity-90 md:text-2xl"
            aria-label="RateMyETH home"
          >
            rate<span className="text-primary">My</span>ETH
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-semibold text-foreground sm:flex">
            <Link href="/directory" className="transition-colors hover:text-primary">
              Platform
            </Link>
            <Link href={aboutHref} className="transition-colors hover:text-primary">
              About
            </Link>
          </nav>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {endSlot ?? (
            <>
              <Button asChild variant="secondary" size="sm" className="rounded-full px-4 font-semibold">
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild size="sm" className="rounded-full px-4 font-semibold">
                <Link href="/auth/sign-up">Get access now</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
