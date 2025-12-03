import React from 'react';

type Goal = {
  label: string;
  progress: number;
  target: string;
};

type GoalTrackerProps = {
  goals: Goal[];
};

const GoalTracker: React.FC<GoalTrackerProps> = ({ goals }) => (
  <section className="mx-auto max-w-6xl px-6 py-16">
    <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <div className="pill w-fit">Progress at a glance</div>
        <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">Stay accountable</h2>
        <p className="text-lg text-slate-600">Track your inputs, outputs, and recovery signals in one place.</p>
      </div>
      <div className="rounded-2xl bg-slate-900 px-6 py-4 text-white shadow-card">
        <p className="text-sm text-slate-300">This week</p>
        <p className="text-3xl font-bold">4 / 5 sessions completed</p>
        <p className="text-sm text-slate-300">Next up: Tempo Lower (45 min)</p>
      </div>
    </div>
    <div className="grid gap-4 md:grid-cols-2">
      {goals.map((goal) => (
        <article key={goal.label} className="card p-5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-slate-700">{goal.label}</p>
            <span className="text-xs font-semibold text-primary-700">Target: {goal.target}</span>
          </div>
          <div className="mt-3 h-3 rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent"
              style={{ width: `${Math.min(goal.progress, 100)}%` }}
            />
          </div>
          <p className="mt-2 text-sm font-semibold text-slate-900">{goal.progress}%</p>
        </article>
      ))}
    </div>
  </section>
);

export type { Goal };
export default GoalTracker;
