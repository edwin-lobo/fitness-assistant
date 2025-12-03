import React from 'react';
import CTASection from './components/CTASection';
import FeatureGrid, { type Feature } from './components/FeatureGrid';
import Footer from './components/Footer';
import GoalTracker, { type Goal } from './components/GoalTracker';
import Header from './components/Header';
import PlanSection, { type PlanItem } from './components/PlanSection';

const features: Feature[] = [
  {
    title: 'Balanced programming',
    description: 'Evidence-based templates that mix strength, conditioning, and recovery in easy-to-run blocks.',
    icon: <SparklesIcon />,
  },
  {
    title: 'Smart scheduling',
    description: 'Drag-and-drop sessions, swap lifts on the fly, and auto-shift days when life happens.',
    icon: <CalendarIcon />,
    badge: 'Adaptive',
  },
  {
    title: 'Habit loop cues',
    description: 'Concise checklists for warm-ups, technique reminders, and post-session reflections.',
    icon: <CheckIcon />,
  },
  {
    title: 'Recovery aware',
    description: 'Sleep, HRV, and RPE inputs inform your next session so you never guess load or intensity.',
    icon: <HeartIcon />,
  },
  {
    title: 'Nutrition friendly',
    description: 'Macros, hydration, and fueling nudges surface alongside workouts to keep you consistent.',
    icon: <BoltIcon />,
  },
  {
    title: 'Export ready',
    description: 'Static build deploys to Amazon S3 or CloudFront with no backend required.',
    icon: <CloudIcon />,
  },
];

const weeklyPlan: PlanItem[] = [
  {
    title: 'Full-body power',
    description: 'Contrast training: hex bar jumps, trap bar pulls, and sled pushes to prime the nervous system.',
    duration: '45 min',
    focus: 'Strength',
  },
  {
    title: 'Tempo lower',
    description: 'Time-under-tension squats, single-leg hinge work, and core carries to build resilient hips.',
    duration: '50 min',
    focus: 'Strength',
  },
  {
    title: 'Zone 2 run',
    description: 'Conversational pace run with cadence cues and breathing drills to expand aerobic capacity.',
    duration: '35 min',
    focus: 'Cardio',
  },
  {
    title: 'Mobility reset',
    description: 'Low-load isometrics, thoracic rotation flows, and soft-tissue checkpoints for recovery days.',
    duration: '20 min',
    focus: 'Recovery',
  },
];

const goals: Goal[] = [
  { label: 'Training consistency', progress: 82, target: '5 sessions/week' },
  { label: 'Sleep score', progress: 74, target: '7.5 hrs avg' },
  { label: 'Vo2 max trend', progress: 68, target: '46 ml/kg/min' },
  { label: 'Mobility habit', progress: 60, target: '10 mins daily' },
];

const App: React.FC = () => {
  const handleCta = () => {
    window.location.hash = '#cta';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50 to-white">
      <Header onCtaClick={handleCta} />
      <main>
        <HeroSection onCtaClick={handleCta} />
        <FeatureGrid features={features} />
        <PlanSection
          headline="A simple routine that flexes with your week"
          summary="Pick your goal, adjust the slider for session length, and the assistant generates a balanced week you can run as-is or tweak on the fly."
          items={weeklyPlan}
        />
        <GoalTracker goals={goals} />
        <CTASection onPrimaryClick={handleCta} />
      </main>
      <Footer />
    </div>
  );
};

const HeroSection: React.FC<{ onCtaClick: () => void }> = ({ onCtaClick }) => (
  <section className="gradient-bg relative overflow-hidden">
    <div
      className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(148,163,184,0.3),transparent_55%)] [mask-image:radial-gradient(ellipse_at_center,white,transparent_65%)]"
      aria-hidden
    />
    <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-10 px-6 pb-20 pt-16 text-center md:flex-row md:items-center md:text-left">
      <div className="flex-1 space-y-6">
        <div className="pill mx-auto md:mx-0">AI-assisted training</div>
        <h1 className="text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
          Design your week. Execute with confidence.
        </h1>
        <p className="text-lg leading-relaxed text-slate-700 md:max-w-2xl">
          The Fitness Assistant MVP turns your goals into daily actions with short checklists, smart swaps, and a clear view of
          recovery signals.
        </p>
        <div className="flex flex-col items-center gap-3 md:flex-row md:items-center md:justify-start">
          <button
            type="button"
            onClick={onCtaClick}
            className="w-full rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-200 transition hover:bg-primary-700 md:w-auto"
          >
            Build my week
          </button>
          <a
            href="#features"
            className="w-full rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-primary-200 hover:text-primary-700 md:w-auto"
          >
            Explore features
          </a>
        </div>
        <div className="grid gap-4 text-left text-sm text-slate-700 sm:grid-cols-2">
          <div className="flex items-start gap-3">
            <div className="mt-1 h-2 w-2 rounded-full bg-primary-500" aria-hidden />
            <p>
              AI-generated cues keep you focused on form, while human readable checklists make every session easy to follow.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-1 h-2 w-2 rounded-full bg-accent" aria-hidden />
            <p>Built as a static site — no servers to manage. Deploy straight to S3 and iterate fast.</p>
          </div>
        </div>
      </div>
      <div className="card relative w-full max-w-md overflow-hidden border-primary-100/60 bg-white/80">
        <div className="absolute right-6 top-6 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
          MVP Preview
        </div>
        <div className="space-y-3 px-6 pb-6 pt-16">
          <h3 className="text-xl font-semibold text-slate-900">Today — Full-body power</h3>
          <ul className="space-y-3 text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-primary-500" aria-hidden />
              Dynamic warm-up · 8 min
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-primary-500" aria-hidden />
              A1 Trap bar deadlift · 3x6 @ RPE 7
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-primary-500" aria-hidden />
              B1 Sled push + jump combo · 4 rounds
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-primary-500" aria-hidden />
              Cool down + mobility · 6 min
            </li>
          </ul>
          <div className="rounded-xl bg-slate-900 px-4 py-3 text-white">
            <div className="flex items-center justify-between text-sm text-slate-200">
              <span>Intensity</span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">Auto</span>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <div className="h-3 flex-1 rounded-full bg-slate-700">
                <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-primary-400 to-accent" />
              </div>
              <span className="text-sm font-semibold">72%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M11 2.5 9 8l-5.5 2L9 12l2 5.5L13 12l5.5-2L13 8 11 2.5Zm9 3-1 3-3 1 3 1 1 3 1-3 3-1-3-1-1-3Zm-16 8-1 3-3 1 3 1 1 3 1-3 3-1-3-1-1-3Z" />
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
    <rect x="3" y="5" width="18" height="16" rx="3" />
    <path d="M16 3v4M8 3v4M3 11h18" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
  </svg>
);

const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
    <path d="M12 21s-7-4.35-7-10a5 5 0 0 1 9-2.7A5 5 0 0 1 19 11c0 5.65-7 10-7 10Z" />
  </svg>
);

const BoltIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="m13 2-8 11h6v9l8-12h-6l.04-8Z" />
  </svg>
);

const CloudIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
    <path d="M7 18h10a4 4 0 1 0-.9-7.9A6 6 0 0 0 5 11a4.5 4.5 0 0 0 2 8" />
  </svg>
);

export default App;
