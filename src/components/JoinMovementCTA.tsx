"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Heart } from "lucide-react";

export default function JoinMovementCTA() {
  const [hasJoined, setHasJoined] = useState<boolean | null>(null);

  useEffect(() => {
    setHasJoined(localStorage.getItem("hasJoinedMovement") === "true");
  }, []);

  // Avoid a flash of the wrong state before we've checked localStorage
  if (hasJoined === null) return null;

  if (hasJoined) {
    return (
    <p className="text-sm font-medium opacity-80 inline-flex items-center gap-1">
        Thanks for joining, we&apos;ll be in touch soon.
        <Heart fill="currentColor" className="size-4" />
    </p>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm font-medium opacity-80">
        Want to be part of this too?
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/get-involved#volunteer"
          className="bg-ink text-paper px-6 py-2.5 rounded-full text-sm font-semibold hover:brightness-110 active:scale-95 transition"
        >
          I&apos;m an Individual
        </Link>
        <Link
          href="/get-involved#partner"
          className="border border-ink/30 text-ink px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-ink/5 active:scale-95 transition"
        >
          I&apos;m a Company / Organization
        </Link>
      </div>
    </div>
  );
}
