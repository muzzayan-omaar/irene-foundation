import Link from "next/link";
import InquiryForm from "@/components/InquiryForm";

export default function GetInvolvedPage() {
  return (
    <div>
      <div className="max-w-3xl mx-auto px-6 sm:px-12 py-16 sm:py-20 text-center">
        <p className="font-mono text-clay text-xs tracking-[0.18em] uppercase mb-4">
          Every kind of support counts
        </p>
        <h1 className="font-display font-extrabold text-4xl sm:text-6xl tracking-tight mb-6">
          Get Involved
        </h1>
        <p className="text-ink/60 text-lg max-w-xl mx-auto">
          Whether you&apos;re an individual, a company, an NGO, or a government
          body — there&apos;s a way to take part beyond just giving cash.
        </p>
      </div>

      {/* Donate */}
      <section className="bg-ink text-paper px-6 sm:px-12 py-16 text-center">
        <h2 className="font-display font-bold text-2xl sm:text-3xl mb-4">
          Give directly to a campaign
        </h2>
        <p className="text-paper/70 max-w-md mx-auto mb-8">
          The most direct way to help — pick a campaign and watch your gift
          show up in real time.
        </p>
        <Link
          href="/campaigns"
          className="inline-block bg-sun text-ink px-6 py-3 rounded-full font-semibold hover:brightness-105 transition"
        >
          View Active Campaigns
        </Link>
      </section>

      {/* Partner */}
      <section id="partner" className="max-w-3xl mx-auto px-6 sm:px-12 py-16">
        <p className="font-mono text-clay text-xs tracking-[0.18em] uppercase mb-3">
          Companies · NGOs · Government · Foreign Aid
        </p>
        <h2 className="font-display font-bold text-3xl mb-4">Partner With Us</h2>
        <p className="text-ink/60 mb-8 max-w-lg">
          If your organization is interested in a formal partnership,
          co-funding a campaign, or in-kind institutional support, tell us a
          bit about what you have in mind.
        </p>
        <InquiryForm
          type="PARTNER"
          messagePlaceholder="Tell us about your organization and what kind of partnership you're interested in"
        />
      </section>

      {/* In-Kind */}
      <section id="in-kind" className="bg-paper border-t border-ink/10 px-6 sm:px-12 py-16">
        <div className="max-w-3xl mx-auto">
          <p className="font-mono text-clay text-xs tracking-[0.18em] uppercase mb-3">
            Not everything has to be cash
          </p>
          <h2 className="font-display font-bold text-3xl mb-4">Give In-Kind</h2>
          <p className="text-ink/60 mb-8 max-w-lg">
            Goods, equipment, supplies — if you have something specific to
            offer, let us know what and how much, and we&apos;ll follow up on
            logistics directly.
          </p>
          <InquiryForm
            type="IN_KIND"
            messagePlaceholder="What would you like to give, and roughly how much?"
          />
        </div>
      </section>

      {/* Volunteer */}
      <section id="volunteer" className="border-t border-ink/10 px-6 sm:px-12 py-16">
        <div className="max-w-3xl mx-auto">
          <p className="font-mono text-clay text-xs tracking-[0.18em] uppercase mb-3">
            Time and skills matter too
          </p>
          <h2 className="font-display font-bold text-3xl mb-4">Volunteer</h2>
          <p className="text-ink/60 mb-8 max-w-lg">
            Want to be directly involved — on the ground, remotely, or with a
            specific skill? Tell us what you&apos;d like to contribute.
          </p>
          <InquiryForm
            type="VOLUNTEER"
            messagePlaceholder="What would you like to help with, and how much time can you offer?"
          />
        </div>
      </section>
    </div>
  );
}