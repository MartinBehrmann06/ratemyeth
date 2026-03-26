"use client";

import { useState, useEffect } from "react";
import { calculateNewRatings } from "@/lib/elo";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

type Professor = {
  uid: string;
  name: string;
  rating: number;
  image_url: string | null;
};

const getImageUrl = (url: string | null) => {
  if (!url) return "https://via.placeholder.com/150?text=No+Image";
  if (url.startsWith("/")) return `https://ethz.ch${url}`;
  return url;
};

export default function RatePage() {
  const supabase = createClient();

  const [professors, setProfessors] = useState<Professor[]>([]);
  const [profA, setProfA] = useState<Professor | null>(null);
  const [profB, setProfB] = useState<Professor | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const pickNewPair = (currentProfs: Professor[]) => {
    if (currentProfs.length < 2) return;
    const shuffled = [...currentProfs].sort(() => 0.5 - Math.random());
    setProfA(shuffled[0]);
    setProfB(shuffled[1]);
  };

  useEffect(() => {
    const fetchProfessors = async () => {
      const { data, error } = await supabase
        .from("professors")
        .select("uid, name, rating, image_url");

      if (error) {
        console.error("Error fetching professors:", error);
      } else if (data) {
        setProfessors(data);
        pickNewPair(data);
      }
      setIsLoading(false);
    };

    fetchProfessors();
  }, [supabase]);

  const handleVote = async (winner: Professor, loser: Professor) => {
    const { newWinnerRating, newLoserRating } = calculateNewRatings(
      winner.rating,
      loser.rating,
    );

    const updatedProfessors = professors.map((prof) => {
      if (prof.uid === winner.uid) return { ...prof, rating: newWinnerRating };
      if (prof.uid === loser.uid) return { ...prof, rating: newLoserRating };
      return prof;
    });

    setProfessors(updatedProfessors);
    pickNewPair(updatedProfessors);

    const { error } = await supabase.rpc("vote_professor", {
      winner_uid: winner.uid,
      loser_uid: loser.uid,
    });

    if (error) {
      console.error("Failed to record vote securely:", error);
    }
  };

  if (isLoading || !profA || !profB)
    return (
      <div className="flex h-screen items-center justify-center">
        Loading arena...
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background text-foreground">
      <h1 className="text-3xl font-bold mb-8">Which professor is better?</h1>

      <div className="flex gap-8 mb-12 items-center">
        <button
          onClick={() => handleVote(profA, profB)}
          className="flex flex-col items-center justify-center w-72 h-80 border-2 border-border rounded-xl hover:bg-accent hover:border-primary transition-all duration-200 cursor-pointer p-4 group"
        >
          <Image
            src={getImageUrl(profA.image_url)}
            alt={profA.name}
            width={128}
            height={128}
            className="w-32 h-32 rounded-full object-cover mb-4 border-2 border-transparent group-hover:border-primary transition-colors"
          />
          <span className="text-xl font-semibold text-center line-clamp-2">
            {profA.name}
          </span>
          <span className="mt-4 text-sm font-mono opacity-70 bg-secondary px-3 py-1 rounded-full">
            Elo: {profA.rating}
          </span>
        </button>

        <div className="flex items-center text-2xl font-black text-muted-foreground/50 italic">
          VS
        </div>

        <button
          onClick={() => handleVote(profB, profA)}
          className="flex flex-col items-center justify-center w-72 h-80 border-2 border-border rounded-xl hover:bg-accent hover:border-primary transition-all duration-200 cursor-pointer p-4 group"
        >
          <img
            src={getImageUrl(profB.image_url)}
            alt={profB.name}
            className="w-32 h-32 rounded-full object-cover mb-4 border-2 border-transparent group-hover:border-primary transition-colors"
          />
          <span className="text-xl font-semibold text-center line-clamp-2">
            {profB.name}
          </span>
          <span className="mt-4 text-sm font-mono opacity-70 bg-secondary px-3 py-1 rounded-full">
            Elo: {profB.rating}
          </span>
        </button>
      </div>

      <div className="w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 border-b pb-2">Top Ranked</h2>
        <ul className="space-y-3">
          {[...professors]
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 10)
            .map((prof, index) => (
              <li
                key={prof.uid}
                className="flex items-center justify-between p-3 bg-card rounded-lg border border-border/50 shadow-sm"
              >
                <div className="flex items-center gap-4 truncate">
                  <span className="font-bold text-muted-foreground w-4 text-right">
                    {index + 1}.
                  </span>
                  <img
                    src={getImageUrl(prof.image_url)}
                    alt={prof.name}
                    className="w-10 h-10 rounded-full object-cover border border-border"
                  />
                  <span className="font-medium truncate">{prof.name}</span>
                </div>
                <span className="font-mono font-semibold text-primary pl-4 flex-shrink-0">
                  {prof.rating}
                </span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
