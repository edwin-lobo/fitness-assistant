import React from 'react';

type Feature = {
  title: string;
  description: string;
  icon: React.ReactNode;
  badge?: string;
};

type FeatureGridProps = {
  features: Feature[];
};

const FeatureGrid: React.FC<FeatureGridProps> = ({ features }) => (
  <section id="features" className="mx-auto max-w-6xl px-6 py-16">
    <div className="mb-10 flex flex-col gap-4 text-center">
      <div className="pill mx-auto">Workout insights</div>
      <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">A coach in your pocket</h2>
      <p className="text-lg text-slate-600 md:max-w-3xl md:mx-auto">
        Lightweight planning, actionable cues, and visual progress tracking so you can focus on moving well.
      </p>
    </div>
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {features.map((feature) => (
        <article key={feature.title} className="card flex h-full flex-col gap-4 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
              {feature.icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
              {feature.badge && (
                <span className="mt-1 inline-flex rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-cyan-700">
                  {feature.badge}
                </span>
              )}
            </div>
          </div>
          <p className="text-sm leading-relaxed text-slate-600">{feature.description}</p>
          <div className="mt-auto text-sm font-semibold text-primary-700">See how it works →</div>
        </article>
      ))}
    </div>
  </section>
);

export type { Feature };
export default FeatureGrid;
