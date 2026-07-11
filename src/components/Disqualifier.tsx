import React, { useState } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, HelpCircle, ArrowRight, Activity, Zap } from 'lucide-react';
import { motion } from 'motion/react';

interface DisqualifierProps {
  onScrollToQuestionnaire: () => void;
}

export default function Disqualifier({ onScrollToQuestionnaire }: DisqualifierProps) {
  // Diagnostic state
  const [hasInboundLeads, setHasInboundLeads] = useState<boolean | null>(null);
  const [responseLatency, setResponseLatency] = useState<string | null>(null);
  const [expectsMagic, setExpectsMagic] = useState<boolean | null>(null);

  // Compute the alignment verdict
  const getVerdict = () => {
    if (hasInboundLeads === null || responseLatency === null || expectsMagic === null) {
      return {
        status: 'pending',
        title: 'Compatibility Diagnostic',
        desc: 'Select options above to calculate alignment in real-time.',
        bgColor: 'bg-[#F4F1EA] border border-ink text-ink',
        icon: <HelpCircle className="w-4 h-4 text-ink" />
      };
    }

    if (hasInboundLeads === false) {
      return {
        status: 'disqualified_no_leads',
        title: 'NOT A MATCH (YET)',
        desc: "Automated systems cannot process zero inbound flow. Our agent responds immediately to incoming leads, but cannot manufacture traffic. Invest in local search ads or SEO first.",
        bgColor: 'bg-red-50 border border-red-900 text-red-950',
        icon: <AlertTriangle className="w-4 h-4 text-red-700" />
      };
    }

    if (expectsMagic === true) {
      return {
        status: 'disqualified_magic',
        title: 'NOT A MATCH',
        desc: "Our agents resolve slow response times, but cannot convert uninterested leads or fix a poor product-market fit. If your core service is weak, speed will not solve it.",
        bgColor: 'bg-red-50 border border-red-900 text-red-950',
        icon: <XCircle className="w-4 h-4 text-red-700" />
      };
    }

    if (responseLatency === 'under6h') {
      return {
        status: 'qualified_already_good',
        title: 'MODERATE LATENCY',
        desc: "Responding under 6 hours is better than most, but still misses the critical 'golden response window'. Speeding this up to under 90 seconds will capture leads who would otherwise buy from competitors.",
        bgColor: 'bg-neutral-100 border border-ink text-ink',
        icon: <CheckCircle2 className="w-4 h-4 text-ink" />
      };
    }

    return {
      status: 'qualified',
      title: 'OPTIMAL COMPATIBILITY',
      desc: "You are actively bleeding valuable prospects to faster competitors. Deploying an autonomous agent will capture and book leads in under 90 seconds.",
      bgColor: 'bg-[#1A1A1A] text-paper border border-ink',
      icon: <Zap className="w-4 h-4 text-paper animate-pulse" />
    };
  };

  const verdict = getVerdict();

  return (
    <div id="alignment" className="py-12 bg-[#F4F1EA] text-ink border-t border-b border-[#1A1A1A] px-4 space-y-8">
      
      {/* Section Header */}
      <div className="space-y-3 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 border border-ink/40 text-ink/70 text-[10px] font-mono uppercase tracking-widest rounded-full">
          <Activity className="w-3 h-3 text-ink" />
          PART II — SERVICE EXCLUSIONS
        </div>
        <h2 className="font-serif text-[1.82rem] font-bold tracking-tight text-ink">
          Who We Are Not For
        </h2>
        <div className="w-12 h-[1px] bg-ink mx-auto"></div>
        <p className="font-serif text-xs text-ink-muted leading-relaxed italic max-w-sm mx-auto">
          &ldquo;Our goal is to ensure inbound leads receive an immediate response before they lose interest.&rdquo;
        </p>
      </div>

      {/* Disqualifiers Checklist */}
      <div className="border border-ink bg-white p-5 space-y-4 shadow-sm rounded-2xl">
        <h3 className="font-serif text-sm font-bold text-ink uppercase tracking-wider border-b border-ink/10 pb-2 flex items-center gap-2">
          <XCircle className="w-4 h-4 text-ink" />
          Who We Cannot Serve
        </h3>
        
        <div className="space-y-4 text-xs font-serif leading-relaxed text-ink-muted">
          <div className="flex gap-2.5 items-start">
            <span className="w-1.5 h-1.5 bg-ink mt-1.5 flex-shrink-0 rounded-full" />
            <p>
              <strong>Firms Expecting Magic:</strong> We are not for businesses that expect AI to magically convert cold leads.
            </p>
          </div>

          <div className="flex gap-2.5 items-start">
            <span className="w-1.5 h-1.5 bg-ink mt-1.5 flex-shrink-0 rounded-full" />
            <p>
              <strong>Cold Calling:</strong> We are not a cold-calling agency.
            </p>
          </div>

          <div className="flex gap-2.5 items-start">
            <span className="w-1.5 h-1.5 bg-ink mt-1.5 flex-shrink-0 rounded-full" />
            <p>
              <strong>Staff Limitations:</strong> We are built for businesses that already generate inbound enquiries but don't have enough staff to immediately contact every lead.
            </p>
          </div>

          <div className="flex gap-2.5 items-start">
            <span className="w-1.5 h-1.5 bg-ink mt-1.5 flex-shrink-0 rounded-full" />
            <p>
              <strong>Competitive Advantage:</strong> Our goal is to ensure inbound leads receive an immediate response before they lose interest or contact a competitor.
            </p>
          </div>
        </div>
      </div>

      {/* Diagnostic check */}
      <div className="bg-white border border-ink p-5 space-y-5 shadow-sm rounded-2xl">
        <div className="text-center">
          <h3 className="font-serif text-base font-bold text-ink">Compatibility Diagnostic</h3>
          <span className="text-[9px] font-mono text-ink-muted uppercase tracking-widest">[ SELF-CHECK MATRIX ]</span>
        </div>

        <div className="space-y-5 text-xs">
          {/* Question 1 */}
          <div className="space-y-2">
            <label className="block font-serif text-xs text-ink font-bold">
              1. Do you receive active digital inquiries?
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                id="btn-leads-yes"
                onClick={() => setHasInboundLeads(true)}
                className={`py-2 px-3 font-mono text-[10px] uppercase tracking-wider border transition-all rounded-xl ${
                  hasInboundLeads === true
                    ? 'bg-ink border-ink text-paper font-bold'
                    : 'bg-white border-ink/20 text-ink-muted hover:border-ink hover:text-ink'
                }`}
              >
                Yes, we get leads
              </button>
              <button
                type="button"
                id="btn-leads-no"
                onClick={() => setHasInboundLeads(false)}
                className={`py-2 px-3 font-mono text-[10px] uppercase tracking-wider border transition-all rounded-xl ${
                  hasInboundLeads === false
                    ? 'bg-ink border-ink text-paper font-bold'
                    : 'bg-white border-ink/20 text-ink-muted hover:border-ink hover:text-ink'
                }`}
              >
                No active traffic
              </button>
            </div>
          </div>

          {/* Question 2 */}
          <div className="space-y-2">
            <label className="block font-serif text-xs text-ink font-bold">
              2. Average response time to digital leads?
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'under6h', label: '< 6H' },
                { id: 'sameday', label: 'same day' },
                { id: 'nextday', label: 'next day or later' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  id={`btn-time-${opt.id}`}
                  onClick={() => setResponseLatency(opt.id)}
                  className={`py-2 px-1 font-mono text-[9px] uppercase tracking-wider border transition-all text-center rounded-xl ${
                    responseLatency === opt.id
                      ? 'bg-ink border-ink text-paper font-bold'
                      : 'bg-white border-ink/20 text-ink-muted hover:border-ink hover:text-ink'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Question 3 */}
          <div className="space-y-2">
            <label className="block font-serif text-xs text-ink font-bold">
              3. Expecting magic or conversions of bad leads?
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                id="btn-magic-no"
                onClick={() => setExpectsMagic(false)}
                className={`py-2 px-3 font-mono text-[10px] uppercase tracking-wider border transition-all rounded-xl ${
                  expectsMagic === false
                    ? 'bg-ink border-ink text-paper font-bold'
                    : 'bg-white border-ink/20 text-ink-muted hover:border-ink hover:text-ink'
                }`}
              >
                No, block response leaks
              </button>
              <button
                type="button"
                id="btn-magic-yes"
                onClick={() => setExpectsMagic(true)}
                className={`py-2 px-3 font-mono text-[10px] uppercase tracking-wider border transition-all rounded-xl ${
                  expectsMagic === true
                    ? 'bg-ink border-ink text-paper font-bold'
                    : 'bg-white border-ink/20 text-ink-muted hover:border-ink hover:text-ink'
                }`}
              >
                Yes, expect miracles
              </button>
            </div>
          </div>

          {/* Verdict Panel */}
          <div className={`p-4 border transition-all duration-200 rounded-xl ${verdict.bgColor}`}>
            <div className="flex gap-3 items-start">
              <div className="mt-0.5 flex-shrink-0">{verdict.icon}</div>
              <div className="space-y-1">
                <h4 className="font-mono text-[10px] uppercase tracking-wider font-bold">{verdict.title}</h4>
                <p className="font-serif text-xs leading-relaxed opacity-90">{verdict.desc}</p>
              </div>
            </div>
          </div>

          {/* Qualified Button */}
          {hasInboundLeads === true && expectsMagic === false && responseLatency !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center pt-2"
            >
              <button
                type="button"
                id="btn-qualified-cta"
                onClick={onScrollToQuestionnaire}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-ink hover:bg-neutral-800 text-paper font-mono text-xs uppercase tracking-wider transition-all border border-ink group rounded-xl"
              >
                PROCEED TO RESERVATION
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
