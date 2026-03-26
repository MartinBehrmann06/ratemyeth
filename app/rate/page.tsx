"use client";

import { useState, useEffect } from "react";
import { calculateNewRatings } from "@/lib/elo";
import { createClient } from "@/lib/supabase/client";

type Item = {
  id: string;
  name: string;
  rating: number;
};

export default function RatePage() {
  const supabase = createClient();

  const [items, setItems] = useState<Item[]>([]);
  const [itemA, setItemA] = useState<Item | null>(null);
  const [itemB, setItemB] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const pickNewPair = (currentItems: Item[]) => {
    if (currentItems.length < 2) return;
    const shuffled = [...currentItems].sort(() => 0.5 - Math.random());
    setItemA(shuffled[0]);
    setItemB(shuffled[1]);
  };

  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase.from("items").select("*");

      if (error) {
        console.error("Error fetching items:", error);
      } else if (data) {
        setItems(data);
        pickNewPair(data);
      }
      setIsLoading(false);
    };

    fetchItems();
  }, [supabase]);

  const handleVote = async (winner: Item, loser: Item) => {
    const { newWinnerRating, newLoserRating } = calculateNewRatings(
      winner.rating,
      loser.rating,
    );

    const updatedItems = items.map((item) => {
      if (item.id === winner.id) return { ...item, rating: newWinnerRating };
      if (item.id === loser.id) return { ...item, rating: newLoserRating };
      return item;
    });

    setItems(updatedItems);
    pickNewPair(updatedItems);

    const { error } = await supabase.rpc("vote_item", {
      winner_id: winner.id,
      loser_id: loser.id,
    });

    if (error) {
      console.error("Failed to record vote securely:", error);
    }
  };

  if (isLoading || !itemA || !itemB)
    return (
      <div className="flex h-screen items-center justify-center">
        Loading arena...
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background text-foreground">
      <h1 className="text-3xl font-bold mb-8">Which is better?</h1>

      <div className="flex gap-8 mb-12">
        <button
          onClick={() => handleVote(itemA, itemB)}
          className="flex flex-col items-center justify-center w-64 h-64 border-2 border-border rounded-xl hover:bg-accent hover:text-accent-foreground transition-all duration-200 cursor-pointer"
        >
          <span className="text-2xl font-semibold">{itemA.name}</span>
          <span className="mt-2 text-sm opacity-70">
            Current Elo: {itemA.rating}
          </span>
        </button>

        <div className="flex items-center text-xl font-bold text-muted-foreground">
          VS
        </div>

        <button
          onClick={() => handleVote(itemB, itemA)}
          className="flex flex-col items-center justify-center w-64 h-64 border-2 border-border rounded-xl hover:bg-accent hover:text-accent-foreground transition-all duration-200 cursor-pointer"
        >
          <span className="text-2xl font-semibold">{itemB.name}</span>
          <span className="mt-2 text-sm opacity-70">
            Current Elo: {itemB.rating}
          </span>
        </button>
      </div>
      <div className="w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 border-b pb-2">Top Ranked</h2>
        <ul className="space-y-2">
          {[...items]
            .sort((a, b) => b.rating - a.rating)
            .map((item, index) => (
              <li
                key={item.id}
                className="flex justify-between p-2 bg-card rounded-md border border-border/50"
              >
                <span>
                  {index + 1}. {item.name}
                </span>
                <span className="font-mono">{item.rating}</span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
