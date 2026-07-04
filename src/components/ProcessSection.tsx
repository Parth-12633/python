import React from 'react';
import { motion } from 'framer-motion';
import type { IconType } from 'react-icons';

type Step = {
  id: number;
  number: string;
  label: string;
  icon: React.ComponentType<any>;
  heading: string;
  description: string;
  deliverables: string[];
  duration: string;
  durationLabel: string;
  output: string;
};

export default function ProcessSection({
  steps,
  activeStepIndex,
  setActiveStepIndex,
  onStepView
}: {
  steps: Step[];
  activeStepIndex: number;
  setActiveStepIndex: (i: number) => void;
  onStepView?: (stepLabel: string) => void;
}) {
  const activeStep = steps[activeStepIndex] ?? steps[0];

  return (
    <section id="process" data-scene-section="process" className="relative z-50 px-6 py-24 md:px-12 lg:px-16" style={{ opacity: 1 }}>
      <div className="mx-auto max-w-7xl">
        <div className="h-fit self-start">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-white/70">Sticky storytelling</p>
          <div className="space-y-6">
            <div className="text-3xl font-normal leading-tight text-white md:text-5xl">
              A process designed to move from ambition to execution without friction.
            </div>
            <p className="text-base leading-7 text-white/80 max-w-3xl">
              We combine strategic clarity, premium product design, and thoughtful engineering to build systems that feel effortless to use and durable in the long term.
            </p>
          </div>
        </div>

        <div className="mt-10 overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/95 shadow-[0_50px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          <div className="grid grid-cols-6 divide-x divide-white/10 border-b border-white/10 bg-slate-950/75">
            {steps.map((step, index) => {
              const StepIcon = step.icon as any;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => {
                    setActiveStepIndex(index);
                    if (onStepView) onStepView(step.label);
                  }}
                  className={`relative flex flex-col items-start gap-2 px-5 py-5 text-left transition duration-200 ${
                    activeStepIndex === index ? 'bg-slate-900/95 text-white' : 'text-white/40 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className={`text-[11px] font-semibold uppercase tracking-[0.35em] ${activeStepIndex === index ? 'text-blue-300' : 'text-white/40'}`}>
                    {step.number}
                  </span>
                  <div className="flex items-center gap-2">
                    <StepIcon size={16} className={activeStepIndex === index ? 'text-white' : 'text-white/40'} />
                    <span className={`text-sm font-semibold tracking-[0.01em] ${activeStepIndex === index ? 'text-white' : 'text-white/40'}`}>{step.label}</span>
                  </div>
                  {activeStepIndex === index && <div className="absolute inset-x-0 bottom-0 h-1 bg-blue-500" />}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_0.95fr] gap-0 overflow-visible min-h-[520px]">
            <div className="p-10 border-r border-white/10 bg-slate-950/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
              <div className="space-y-8">
                <div className="flex flex-wrap items-center gap-3 text-white/40">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-blue-300">
                    {React.createElement(activeStep.icon as any, { size: 18, className: 'text-blue-300' })}
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.35em] text-blue-300">
                    {activeStep.number} — {activeStep.label}
                  </span>
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl md:text-4xl font-semibold text-white leading-tight">{activeStep.heading}</h3>
                  <p className="text-white text-base leading-relaxed max-w-2xl">{activeStep.description}</p>
                </div>
                <div className="space-y-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-white/40 mb-3">What you get</p>
                  {activeStep.deliverables.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="mt-2 block h-2 w-2 rounded-full bg-blue-400 shrink-0" />
                      <span className="text-sm text-white/70 leading-6">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-10 bg-slate-950/80 border-l border-white/10 flex flex-col justify-between shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
              <div className="flex h-full flex-col justify-between">
                <div>
                  <p className="text-xs tracking-widest text-white/30 uppercase mb-6">Typical Duration</p>
                  <p className="text-5xl font-bold text-white">{activeStep.duration}</p>
                  <p className="text-white/30 text-sm mt-1">{activeStep.durationLabel}</p>
                </div>
                <div className="mt-8">
                  <p className="text-xs tracking-widest text-white/30 uppercase mb-4">Key Output</p>
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4">
                    <p className="text-white/70 text-sm leading-relaxed italic">"{activeStep.output}"</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
