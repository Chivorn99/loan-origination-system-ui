'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  X,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Zap,
  Smartphone,
  LayoutDashboard,
  Search,
  MessageSquare,
  Clock,
  Lock,
} from 'lucide-react';

// --- Types & Data ---

interface StoryStep {
  title: string;
  tag: string;
  description: string;
  benefit: string;
  icon: React.ReactNode;
  color: string;
}

const businessStory: StoryStep[] = [
  {
    tag: 'The Vision',
    title: 'Modernizing Collateral Loans',
    description:
      'Loy Pawn Shop bridges the gap between traditional lending and digital convenience. We provide a transparent ecosystem that empowers both the business and the client.',
    benefit: '24/7 digital access to loan information.',
    icon: <ShieldCheck className="h-6 w-6" />,
    color: 'bg-blue-600',
  },
  {
    tag: 'The Challenge',
    title: 'Ending Operational Lag',
    description:
      'Manual paperwork and physical ledgers lead to human error and a lack of transparency. Without a digital heartbeat, growth is limited by communication gaps.',
    benefit: 'Eliminates errors caused by manual tracking.',
    icon: <ShieldAlert className="h-6 w-6" />,
    color: 'bg-rose-500',
  },
  {
    tag: 'The Innovation',
    title: 'Seamless Digital Service',
    description:
      'We have transformed the experience into a high-speed system. Your clients get a "Pocket Assistant" via Telegram to check status instantly, anywhere.',
    benefit: 'Increased trust through real-time updates.',
    icon: <Sparkles className="h-6 w-6" />,
    color: 'bg-emerald-500',
  },
];

// --- Sub-Components ---

const GridBackground = () => (
  <div className="pointer-events-none absolute inset-0 z-[-1] overflow-hidden">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-[size:40px_40px]" />
  </div>
);

// --- Main Page Component ---

export default function CombinedHomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const botSectionRef = useRef<HTMLElement>(null);

  // Auto-open modal on first entry
  useEffect(() => {
    const timer = setTimeout(() => setIsModalOpen(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleFinishOnboarding = () => {
    setIsModalOpen(false);
    // Smooth scroll to the bot section after closing
    setTimeout(() => {
      botSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const botFeatures = [
    {
      id: '01',
      title: 'Instant Inquiries',
      description: 'Customers check balances instantly via unique Loan Codes.',
      icon: <Search className="h-5 w-5 text-blue-600" />,
    },
    {
      id: '02',
      title: 'Live Data Sync',
      description: 'Real-time synchronization ensures data is always accurate.',
      icon: <Clock className="h-5 w-5 text-blue-600" />,
    },
    {
      id: '03',
      title: 'Simple Interface',
      description: 'Numeric menu system accessible for all users.',
      icon: <MessageSquare className="h-5 w-5 text-blue-600" />,
    },
    {
      id: '04',
      title: 'Smart Alerts',
      description: 'Automated reminders to help customers avoid late fees.',
      icon: <Zap className="h-5 w-5 text-blue-600" />,
    },
  ];

  const activeStory = businessStory[currentStep];

  return (
    <div
      className={`relative min-h-screen bg-slate-50/50 transition-all duration-700 selection:bg-blue-100 ${isModalOpen ? 'overflow-hidden' : ''}`}
    >
      <GridBackground />

      {/* --- Main Website Background --- */}
      <nav className="sticky top-0 z-40 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-lg shadow-blue-200">
              <span className="text-lg font-bold">L</span>
            </div>
            <span className="text-sm font-black tracking-widest text-slate-800 uppercase">Loy Pawn Shop</span>
          </div>
          <Link
            href="/login"
            className="group flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-xs font-bold text-white transition-all hover:bg-blue-600"
          >
            Staff Portal
            <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </nav>

      <main
        className={`mx-auto max-w-7xl px-6 pb-24 transition-all duration-1000 ${isModalOpen ? 'scale-[0.98] opacity-50 blur-md' : 'blur-0 scale-100 opacity-100'}`}
      >
        {/* Hero */}
        <section className="flex flex-col items-center py-20 text-center lg:py-32">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/50 px-3 py-1 text-[10px] font-bold tracking-widest text-blue-600 uppercase">
            <Sparkles className="h-3 w-3" /> The Future of Pawn Services
          </div>
          <h1 className="max-w-4xl text-5xl font-extrabold tracking-tighter text-slate-900 md:text-7xl">
            Bridging tradition with{' '}
            <span className="text-blue-600 underline decoration-blue-200 underline-offset-8">digital convenience.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed font-medium text-slate-500 md:text-xl">
            A comprehensive Loan Origination System designed to modernize the industry. We provide Main Character Energy
            to both shop owners and customers through transparency and security.
          </p>
        </section>

        {/* Values */}
        <section className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: 'Eliminate Errors',
              desc: 'Move away from physical ledgers and manual calculations.',
              icon: <ShieldCheck className="h-6 w-6 text-emerald-500" />,
            },
            {
              title: 'Real-Time Visibility',
              desc: 'Give customers 24/7 visibility into their loan status.',
              icon: <LayoutDashboard className="h-6 w-6 text-blue-500" />,
            },
            {
              title: 'Scalable Security',
              desc: 'Advanced protection for sensitive records as your business grows.',
              icon: <Lock className="h-6 w-6 text-indigo-500" />,
            },
          ].map((item, i) => (
            <div
              key={i}
              className="group rounded-3xl border border-slate-200 bg-white p-8 transition-all hover:shadow-xl hover:shadow-slate-200/50"
            >
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 transition-transform group-hover:scale-110">
                {item.icon}
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900">{item.title}</h3>
              <p className="text-sm leading-relaxed font-medium text-slate-500">{item.desc}</p>
            </div>
          ))}
        </section>

        {/* Telegram Section */}
        <section
          ref={botSectionRef}
          className="relative mt-24 scroll-mt-24 overflow-hidden rounded-[3rem] bg-slate-900 p-8 text-white shadow-2xl md:p-16"
        >
          <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-blue-600/20 blur-[100px]" />
          <div className="relative z-10 grid gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-[10px] font-black tracking-widest text-blue-400 uppercase">
                The Customer Experience
              </div>
              <h2 className="mb-6 text-4xl font-extrabold tracking-tight md:text-5xl">The Pocket Assistant</h2>
              <p className="mb-8 text-lg leading-relaxed text-slate-400">
                The centerpiece of our technology. A digital concierge that allows customers to track loans instantly
                via Telegram.
              </p>
              <div className="inline-flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 shadow-lg">
                  <Smartphone size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Try it now</p>
                  <p className="font-bold text-white">@LoyPawnBot</p>
                </div>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {botFeatures.map(f => (
                <div
                  key={f.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors hover:bg-white/[0.08]"
                >
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600">
                    {f.icon}
                  </div>
                  <h4 className="mb-2 text-xs font-bold tracking-wide text-white uppercase">{f.title}</h4>
                  <p className="text-xs leading-relaxed font-medium text-slate-400">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200/60 bg-white py-12 text-center">
        <p className="text-[10px] font-bold tracking-[0.4em] text-slate-300 uppercase">
          © {new Date().getFullYear()} Modern Loan Origination.
        </p>
      </footer>

      {/* --- Onboarding Modal Overlay --- */}
      {isModalOpen && (
        <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center p-4 duration-300">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />

          <div className="animate-in zoom-in-95 relative w-full max-w-2xl overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-2xl duration-300">
            <div className="absolute top-0 right-0 left-0 flex h-1.5 gap-1 p-1">
              {businessStory.map((_, i) => (
                <div
                  key={i}
                  className={`h-full flex-1 rounded-full transition-all duration-500 ${i <= currentStep ? activeStory.color : 'bg-slate-100'}`}
                />
              ))}
            </div>

            <div className="p-8 md:p-12">
              <div className="mb-10 flex items-center justify-between">
                <div
                  className={`rounded-full px-4 py-1 text-[10px] font-black tracking-[0.2em] text-white uppercase ${activeStory.color}`}
                >
                  {activeStory.tag}
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full p-2 text-slate-400 hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid items-start gap-8 md:grid-cols-5">
                <div className="space-y-6 md:col-span-3">
                  <h2 className="text-4xl leading-none font-extrabold tracking-tighter text-slate-900 md:text-5xl">
                    {activeStory.title}
                  </h2>
                  <p className="text-lg leading-relaxed font-medium text-slate-500">{activeStory.description}</p>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <div className="rounded-lg border border-slate-100 bg-white p-2 shadow-sm">{activeStory.icon}</div>
                    <span className="text-sm font-bold text-slate-700">{activeStory.benefit}</span>
                  </div>
                </div>
                <div className="relative hidden aspect-square items-center justify-center overflow-hidden rounded-[2rem] border border-dashed border-slate-200 bg-slate-50 md:col-span-2 md:flex">
                  <div className={`absolute inset-0 opacity-10 ${activeStory.color} blur-3xl`} />
                  <div className="relative text-slate-300">
                    <div className="h-16 w-16 rotate-12 animate-pulse rounded-2xl border-4 border-slate-200" />
                  </div>
                </div>
              </div>

              <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-slate-50 pt-8 sm:flex-row">
                <p className="text-[10px] font-bold tracking-widest text-slate-300 uppercase">
                  Step {currentStep + 1} of 3
                </p>
                <div className="flex w-full gap-3 sm:w-auto">
                  {currentStep > 0 && (
                    <button
                      onClick={() => setCurrentStep(prev => prev - 1)}
                      className="px-6 py-4 font-bold text-slate-400 hover:text-slate-900"
                    >
                      Back
                    </button>
                  )}
                  <button
                    onClick={
                      currentStep === businessStory.length - 1
                        ? handleFinishOnboarding
                        : () => setCurrentStep(prev => prev + 1)
                    }
                    className={`flex flex-1 items-center justify-center gap-2 sm:flex-none ${activeStory.color} rounded-2xl px-10 py-4 font-bold text-white transition-all active:scale-95`}
                  >
                    {currentStep === businessStory.length - 1 ? 'Explore Solution' : 'Next Chapter'}
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
