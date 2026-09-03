import { SITE_NAME } from "@/lib/config";

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-12 py-16 sm:py-20">
      <h1 className="font-display font-extrabold text-4xl sm:text-5xl tracking-tight mb-4">
        Privacy Policy
      </h1>
      <p className="text-ink/50 text-sm mb-12">Last updated: [DATE]</p>

      {/* TODO: this is a draft template, not reviewed by a lawyer. Have this
          reviewed against Uganda's Data Protection and Privacy Act and, if
          serving EU/UK donors, GDPR/UK GDPR, before treating it as final. */}

      <div className="prose prose-ink max-w-none space-y-8 text-ink/70 leading-relaxed">
        <section>
          <h2 className="font-display font-bold text-xl text-ink mb-3">
            What we collect
          </h2>
          <p>
            When you donate, sign up for our newsletter, or submit an
            inquiry, we collect your name, email address, and any other
            details you choose to provide (such as phone number or a
            message). If you donate, our payment provider also processes
            your payment details directly — we do not store your card or
            mobile money credentials ourselves.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl text-ink mb-3">
            How we use it
          </h2>
          <p>
            We use your information to process donations, respond to
            inquiries, and — only if you explicitly opt in — send updates
            about the foundation&apos;s work. We do not sell your information
            to third parties.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl text-ink mb-3">
            Your choices
          </h2>
          <p>
            You can unsubscribe from emails at any time. To request that we
            delete your personal data, contact us at [CONTACT EMAIL] and
            we&apos;ll act on it within a reasonable timeframe.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl text-ink mb-3">
            Payment processing
          </h2>
          <p>
            Donations are processed by a third-party payment provider. Their
            own privacy policy governs how they handle your payment
            information.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl text-ink mb-3">
            Contact
          </h2>
          <p>
            Questions about this policy or your data can be sent to
            [CONTACT EMAIL].
          </p>
        </section>
      </div>
    </div>
  );
}
