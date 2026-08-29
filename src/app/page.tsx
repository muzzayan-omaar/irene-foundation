import Link from "next/link";
import SupporterCounter from "@/components/SupporterCounter";
import { WaveformDivider } from "@/components/Waveform";
import { SITE_TAGLINE, SITE_HASHTAG } from "@/lib/config";

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[85vh] flex flex-col justify-center px-6 sm:px-12 bg-ink text-paper overflow-hidden">
        <div className="max-w-3xl">
          <p className="font-mono text-sun text-sm tracking-widest uppercase mb-6">
            {SITE_HASHTAG}
          </p>
          <h1 className="font-display font-extrabold text-5xl sm:text-7xl leading-[1.05] mb-6">
            {SITE_TAGLINE}
          </h1>
          <p className="text-paper/70 text-lg max-w-xl mb-10">
            Real work, real voices, real proof — every gift here goes toward
            people you can actually see and stories you can actually follow.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/campaigns"
              className="bg-sun text-ink px-6 py-3 rounded-full font-semibold hover:brightness-95 transition"
            >
              See Active Campaigns
            </Link>
            <Link
              href="/field-notes"
              className="border border-paper/30 text-paper px-6 py-3 rounded-full font-semibold hover:bg-paper/10 transition"
            >
              Read Field Notes
            </Link>
          </div>
        </div>
      </section>

      <div className="px-6 sm:px-12 py-3 bg-paper">
        <WaveformDivider />
      </div>

      {/* Supporter counter */}
      <section className="py-16 px-6 sm:px-12 text-center">
        <SupporterCounter />
      </section>

      <div className="px-6 sm:px-12 py-3">
        <WaveformDivider />
      </div>

      {/* CTA strip */}
      <section className="py-20 px-6 sm:px-12 bg-papyrus text-paper text-center">
        <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4">
          Every voice added makes this louder.
        </h2>
        <p className="text-paper/70 max-w-lg mx-auto mb-8">
          Join the people already supporting this work — share, follow, or
          give whatever you can.
        </p>
        <Link
          href="/campaigns"
          className="inline-block bg-sun text-ink px-6 py-3 rounded-full font-semibold hover:brightness-95 transition"
        >
          Get Involved
        </Link>
      </section>
    </div>
  );
}