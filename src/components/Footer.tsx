import React from 'react';

const Footer: React.FC = () => (
  <footer className="border-t border-slate-100 bg-white/80">
    <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100 text-primary-700 font-bold">FA</div>
        <p className="font-semibold text-slate-900">Fitness Assistant</p>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <a className="hover:text-primary-700" href="#features">
          Features
        </a>
        <a className="hover:text-primary-700" href="#planner">
          Planner
        </a>
        <a className="hover:text-primary-700" href="#cta">
          Launch
        </a>
        <span className="text-slate-400">|</span>
        <p className="text-slate-500">Built for the LensKeep MVP track.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
