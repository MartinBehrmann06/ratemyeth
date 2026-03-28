"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { useState } from "react";
import ethWordmark from "@/assets/images.png";

function RunnerGraphic({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 520 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <g className="text-primary">
        <rect x="40" y="120" width="120" height="12" rx="4" fill="currentColor" opacity="0.35" />
        <rect x="20" y="95" width="180" height="10" rx="4" fill="currentColor" opacity="0.45" />
        <rect x="60" y="70" width="200" height="14" rx="4" fill="currentColor" opacity="0.55" />
        <rect x="100" y="45" width="160" height="12" rx="4" fill="currentColor" opacity="0.5" />
        <rect x="280" y="125" width="90" height="10" rx="4" fill="currentColor" opacity="0.4" />
        <rect x="320" y="100" width="140" height="12" rx="4" fill="currentColor" opacity="0.5" />
        <rect x="300" y="75" width="110" height="14" rx="4" fill="currentColor" opacity="0.55" />
        <rect x="260" y="52" width="70" height="11" rx="4" fill="currentColor" opacity="0.45" />
        <rect x="380" y="88" width="100" height="9" rx="3" fill="currentColor" opacity="0.35" />
      </g>
    </svg>
  );
}

/** Simple gray “person” icon: round head + shoulders */
function PersonSilhouette({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 132"
      className={className}
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="60" cy="36" r="26" className="fill-muted-foreground/55" />
      <path
        d="M60 60c-38 0-52 24-52 72h104c0-48-14-72-52-72z"
        className="fill-muted-foreground/45"
      />
    </svg>
  );
}

const mentors = [
  {
    id: "left" as const,
    handle: "@clear_explainers",
    blurb: "Crystal slides · tough exams",
    score: "4.8",
    reviews: "214",
    accent: "from-primary/25 to-primary/5",
    tilt: "-rotate-[2.5deg] md:-rotate-[3deg]",
    tiltHover: "hover:-rotate-[1.5deg]",
  },
  {
    id: "right" as const,
    handle: "@lab_hours_legend",
    blurb: "Hands-on · generous feedback",
      score: "4.9",
      reviews: "188",
      accent: "from-foreground/[0.12] to-primary/10",
      tilt: "rotate-[3deg] md:rotate-[4deg]",
      tiltHover: "hover:rotate-[2deg]",
  },
];

export function LandingHero() {
  const [picked, setPicked] = useState<"left" | "right" | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader aboutHref="#versus" />

      <main className="mx-auto max-w-5xl px-4 pb-24 pt-16 md:px-6 md:pt-20">
        <div className="relative flex flex-col items-center text-center">
          <RunnerGraphic className="pointer-events-none absolute left-1/2 top-[28%] w-[min(100%,520px)] -translate-x-1/2 -translate-y-1/2 opacity-90 md:top-[32%] md:w-[600px]" />

          <h1 className="relative z-[1] text-4xl font-bold uppercase leading-none tracking-tight text-foreground sm:text-6xl md:text-7xl">
            Rate my
          </h1>

          <div className="relative z-[1] mt-4 md:mt-10">
            <div
              className="inline-block rounded-md  px-4 py-3  md:px-6 md:py-4"
              style={{ transform: "rotate(-7deg)" }}
            >
              <Image
                src={ethWordmark}
                alt=""
                priority
                className="h-auto w-[min(78vw,340px)] select-none md:w-[min(72vw,480px)]"
                sizes="(max-width: 768px) 340px, 480px"
              />
            </div>
          </div>

       

          <div className="relative z-[1] mt-2 flex flex-wrap items-center justify-center gap-5">
            <Button asChild variant="secondary" size="lg" className="rounded-full px-6 font-semibold">
              <Link href="/auth/sign-up">Login now</Link>
            </Button>
            <Button asChild size="lg" className="rounded-full px-6 font-semibold">
              <Link href="/auth/sign-up">Get access now</Link>
            </Button>
          </div>
        </div>

        <section
          id="versus"
          className="relative z-[1] mx-auto mt-8 w-4xl scroll-mt-24"
          aria-labelledby="versus-heading"
        >
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-primary">
              Crowd verdict
            </p>
            <h2
              id="versus-heading"
              className="mt-3 text-3xl font-black uppercase leading-none tracking-tight text-foreground sm:text-5xl md:text-6xl"
            >
              Pick a side
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm font-semibold text-muted-foreground sm:text-base">
              Two profiles. One tap. Vote the voice you trust—bold cards, real contrast, no fluff.
            </p>
          </div>

          <div className="relative mt-14">
            <div
              className="pointer-events-none absolute left-1/2 top-[42%] z-20 hidden -translate-x-1/2 -translate-y-1/2 md:block"
              aria-hidden
            >
              <div className="flex size-16 items-center justify-center rounded-2xl border-4 border-background bg-primary text-lg font-black uppercase tracking-widest text-primary-foreground shadow-lg">
                vs
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2 md:gap-10">
              {mentors.map((m) => {
                const active = picked === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPicked(m.id)}
                    className={[
                      "group relative flex flex-col rounded-3xl border-4 bg-card p-6 text-left shadow-sm outline-none transition-all duration-300 md:p-8",
                      "origin-center hover:-translate-y-1 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      m.tilt,
                      m.tiltHover,
                      active ? "z-10 scale-[1.02] md:scale-[1.03]" : "",
                      active
                        ? "border-primary shadow-[0_0_0_1px_hsl(var(--primary)),0_20px_50px_-15px_hsl(var(--primary)/0.35)]"
                        : "border-foreground/15 hover:border-primary/40",
                    ].join(" ")}
                  >
                    <div
                      className={`pointer-events-none absolute inset-0 -z-10 rounded-[1.35rem] bg-gradient-to-br opacity-90 ${m.accent}`}
                    />

                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[0.65rem] font-black uppercase tracking-[0.28em] text-muted-foreground">
                          Challenger
                        </p>
                        <p className="mt-2 font-mono text-xs font-bold text-primary">{m.handle}</p>
                      </div>
                      <div className="rounded-full bg-background/80 px-3 py-1 text-xs font-black tabular-nums text-foreground ring-1 ring-border">
                        {m.score}{" "}
                        <span className="font-semibold text-muted-foreground">avg</span>
                      </div>
                    </div>

                    <div className="mx-auto mt-8 flex w-full max-w-[200px] flex-col items-center">
                      <PersonSilhouette className="w-full drop-shadow-sm" />
                    </div>

                    <div className="mt-6 text-center">
                      <p className="text-sm font-bold leading-snug text-muted-foreground">{m.blurb}</p>
                      <p className="mt-3 text-xs font-bold uppercase tracking-wider text-foreground/70">
                        {m.reviews} reviews logged
                      </p>
                    </div>

                    <div className="mt-8 flex items-center justify-between gap-3 border-t-2 border-foreground/10 pt-6">
                      <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                        {active ? "Locked in" : "Your call"}
                      </span>
                      <span
                        className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-wider transition-colors ${active ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground group-hover:bg-primary group-hover:text-primary-foreground"}`}
                      >
                        {active ? "Selected" : "Choose"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <p className="mt-8 text-center text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
              {picked
                ? "Nice — that energy is what RateMyETH is built for."
                : "Tap a card to lock your pick (concept preview)."}
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
