export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-12 py-16 sm:py-20">
      <h1 className="font-display font-extrabold text-4xl sm:text-5xl tracking-tight mb-4">
        Terms of Service
      </h1>
      <p className="text-ink/50 text-sm mb-12">Last updated: [DATE]</p>

      {/* TODO: draft template, not reviewed by a lawyer — review before final launch */}

      <div className="prose prose-ink max-w-none space-y-8 text-ink/70 leading-relaxed">
        <section>
          <h2 className="font-display font-bold text-xl text-ink mb-3">
            Donations
          </h2>
          <p>
            Donations made through this site are voluntary and, except
            where required by law or agreed otherwise in writing,
            non-refundable. Funds raised for a specific campaign are
            directed toward that campaign&apos;s stated purpose.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl text-ink mb-3">
            Content
          </h2>
          <p>
            Photos, videos, and stories shared on this site depict real
            people and communities. They are shared with consent and are
            not to be reproduced elsewhere without permission.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl text-ink mb-3">
            Changes
          </h2>
          <p>
            We may update these terms from time to time. Continued use of
            the site after changes means you accept the updated terms.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl text-ink mb-3">
            Contact
          </h2>
          <p>Questions about these terms can be sent to [CONTACT EMAIL].</p>
        </section>
      </div>
    </div>
  );
}
