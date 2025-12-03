import React from 'react';

type PlanItem = {
  title: string;
  description: string;
  duration: string;
  focus: string;
};

type PlanSectionProps = {
  headline: string;
  summary: string;
  items: PlanItem[];
};

const PlanSection: React.FC<PlanSectionProps> = ({ headline, summary, items }) => (
  <section id="planner" className="bg-white/80">
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-16 lg:flex-row lg:items-start">
      <div className="max-w-xl space-y-4">
        <div className="pill w-fit">Weekly blueprint</div>
        <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">{headline}</h2>
        <p className="text-lg leading-relaxed text-slate-600">{summary}</p>
        <ul className="space-y-3 text-sm text-slate-700">
          <li>✔️ 3 strength days, 2 cardio days, 2 recovery days.</li>
          <li>✔️ Warm-up and cool-down baked into every session.</li>
          <li>✔️ Auto-adjust intensity based on how you feel.</li>
        </ul>
      </div>
      <div className="grid flex-1 gap-4 md:grid-cols-2">
        {items.map((item) => (
          <article key={item.title} className="card flex flex-col gap-3 p-5">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold uppercase tracking-wide text-primary-600">{item.focus}</div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {item.duration}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
            <p className="text-sm leading-relaxed text-slate-600">{item.description}</p>
            <button className="mt-auto inline-flex w-fit items-center gap-2 text-sm font-semibold text-primary-700">
              View session details
              <span aria-hidden>→</span>
            </button>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export type { PlanItem };
export default PlanSection;
