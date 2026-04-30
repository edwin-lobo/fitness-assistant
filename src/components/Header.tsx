import React from 'react';

type HeaderProps = {
  onCtaClick?: () => void;
};

const Header: React.FC<HeaderProps> = ({ onCtaClick }) => (
  <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-slate-100">
    <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-700 font-bold">FA</div>
        <div>
          <p className="text-sm font-semibold text-primary-600">Fitness planning</p>
          <p className="text-lg font-semibold text-slate-900">Fitness Assistant</p>
        </div>
      </div>
      <div className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
        <a href="#features" className="hover:text-primary-600">
          Features
        </a>
        <a href="#planner" className="hover:text-primary-600">
          Weekly plan
        </a>
        <a href="#cta" className="hover:text-primary-600">
          Get started
        </a>
        <button
          type="button"
          onClick={onCtaClick}
          className="rounded-full bg-primary-600 px-4 py-2 text-white shadow hover:bg-primary-700"
        >
          Start free
        </button>
      </div>
    </div>
  </header>
);

export default Header;
