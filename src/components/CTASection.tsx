import React from 'react';

type CTASectionProps = {
  onPrimaryClick?: () => void;
};

const CTASection: React.FC<CTASectionProps> = ({ onPrimaryClick }) => (
  <section id="cta" className="mx-auto max-w-6xl px-6 pb-16">
    <div className="card gradient-bg relative overflow-hidden px-8 py-12 text-center">
      <div className="absolute inset-0 bg-gradient-to-r from-primary-50 via-transparent to-accent/5" aria-hidden />
      <div className="relative space-y-4">
        <div className="pill mx-auto bg-white/70 text-primary-700">Launch-ready MVP</div>
        <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Ready to ship to S3</h2>
        <p className="mx-auto max-w-2xl text-lg text-slate-700">
          Deploy the static build to Amazon S3 or CloudFront and start onboarding early adopters with confidence.
        </p>
        <div className="flex flex-col items-center justify-center gap-3 md:flex-row md:gap-4">
          <button
            type="button"
            onClick={onPrimaryClick}
            className="rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-200 transition hover:bg-primary-700"
          >
            Generate build
          </button>
          <a
            className="text-sm font-semibold text-primary-700"
            href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html"
            target="_blank"
            rel="noreferrer"
          >
            How to host on S3 →
          </a>
        </div>
      </div>
    </div>
  </section>
);

export default CTASection;
