import Link from "next/link";

// TODO: replace with Irene's real photos and full story once she sends them.
const FOUNDER_PHOTO_URL =
  "https://res.cloudinary.com/diszilwhc/image/upload/v1788011742/46667943_1942558049147382_7934771016423702528_o_oo8auc.jpg";
const SECONDARY_PHOTO_URL =
  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=1200";

export default function AboutPage() {
  return (
    <div>
      {/* Full-bleed intro */}
      <section className="grid grid-cols-1 md:grid-cols-2 min-h-[70vh]">
        <div className="relative min-h-[50vh] md:min-h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={FOUNDER_PHOTO_URL}
            alt="Irene Namatovu"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <div className="bg-ink text-paper flex flex-col justify-center px-8 sm:px-14 lg:px-16 py-16">
          <p className="font-mono text-sun text-xs tracking-[0.18em] uppercase mb-4">
            Why this exists
          </p>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight mb-6">
            A voice for the people who don&apos;t often get heard.
          </h1>
          <p className="text-paper/75 text-lg leading-relaxed max-w-md">
            {/* TODO: Irene's real founder story goes here */}
            Irene Namatovu started this foundation to turn her platform into
            direct, visible support for communities across Uganda.
          </p>
        </div>
      </section>

      {/* Longer story body */}
      <section className="max-w-3xl mx-auto px-6 sm:px-12 py-20">
        <p className="text-ink/70 text-lg leading-relaxed whitespace-pre-line">
          {/* TODO: replace this entire block with Irene's real story */}
          Every community I&apos;ve performed in has taught me something —
          usually that talent and need exist everywhere, but visibility and
          opportunity don&apos;t. This foundation is my attempt to close that
          gap directly: not through promises, but through campaigns you can
          watch progress in real time, and stories you can follow as they
          unfold.
          {"\n\n"}
          Every gift here is tied to something specific and visible — a
          campaign with a real goal, real updates, and real people behind it.
          That&apos;s the whole idea: proof over promises.
        </p>
      </section>

      {/* Secondary photo panel */}
      <section className="relative min-h-[50vh]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={SECONDARY_PHOTO_URL}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      </section>

      {/* Closing CTA */}
      <section className="bg-papyrus text-paper text-center py-20 px-6 sm:px-12">
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl mb-6">
          See what your gift actually funds.
        </h2>
        <Link
          href="/campaigns"
          className="inline-block bg-sun text-ink px-6 py-3 rounded-full font-semibold hover:brightness-105 transition"
        >
          View Active Campaigns
        </Link>
      </section>
    </div>
  );
}