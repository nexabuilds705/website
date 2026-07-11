import React, { useState } from 'react';
import { Check, ShieldCheck, HelpCircle, Activity, Sparkles, Receipt, Database, Globe, Sliders, Smartphone, CheckCircle, Flame } from 'lucide-react';
import { motion } from 'motion/react';

export default function Pricing() {
  // Calculator States
  const [monthlyLeads, setMonthlyLeads] = useState<number>(50);
  const [avgLeadValue, setAvgLeadValue] = useState<number>(350);
  const [responseSpeed, setResponseSpeed] = useState<'instant' | 'hour' | 'day'>('hour');

  // Interactive configurations
  const [setupFee, setSetupFee] = useState<number>(1499);
  const [monthlyRetainer, setMonthlyRetainer] = useState<number>(249);
  const [currency, setCurrency] = useState<string>('$');

  // ROI Math
  const getLossRate = () => {
    if (responseSpeed === 'instant') return 0.05;
    if (responseSpeed === 'hour') return 0.45;
    return 0.75;
  };

  const leadsLost = Math.round(monthlyLeads * getLossRate());
  const revenueBleed = leadsLost * avgLeadValue;
  
  // With Lead Agent, we recover 85% of those lost leads
  const recoveredLeads = Math.round(leadsLost * 0.85);
  const recoveredRevenue = recoveredLeads * avgLeadValue;
  const netROI = recoveredRevenue - (monthlyRetainer);

  return (
    <section id="pricing" className="py-24 bg-[#F4F1EA] text-ink relative border-b border-[#1A1A1A] overflow-hidden">
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#1A1A1A]/40 text-[#1A1A1A]/70 text-xs font-mono uppercase tracking-widest mb-6">
            <Receipt className="w-3.5 h-3.5 text-ink" />
            PART III — COST & INVESTMENT DIRECTORY
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-normal tracking-tight text-ink mb-6">
            Simple, Transparent Fee Tiers
          </h2>
          <div className="w-16 h-[1.5px] bg-[#1A1A1A] mx-auto mb-6"></div>
          <p className="font-serif text-base text-ink-muted leading-relaxed italic">
            Whether you seek incidental nighttime backup or a complete, end-to-end inbound solution to compensate for staffing shortages, our tiers offer direct performance ROI.
          </p>
        </div>

        {/* Dynamic Pricing Configuration Panel */}
        <div className="bg-white border-2 border-[#1A1A1A] p-5 max-w-lg mx-auto mb-16 flex items-center justify-between gap-4">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-ink">
            [ DISPLAY CURRENCY PARAMETERS ]
          </span>
          <div className="flex gap-1.5">
            {['$', '£', '€'].map((curr) => (
              <button
                key={curr}
                type="button"
                id={`currency-${curr}`}
                onClick={() => setCurrency(curr)}
                className={`w-9 h-9 border text-xs font-mono font-bold transition-all rounded-none ${
                  currency === curr ? 'bg-ink border-ink text-paper' : 'bg-white border-[#1A1A1A]/30 text-ink hover:border-ink'
                }`}
              >
                {curr}
              </button>
            ))}
          </div>
        </div>

        {/* Side-by-side Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-10 items-stretch mb-24 max-w-5xl mx-auto">
          
          {/* Plan 1: Standard Copilot (For businesses WITH staff) */}
          <div className="p-8 md:p-10 bg-white border-2 border-[#1A1A1A] flex flex-col justify-between relative shadow-sm">
            <div className="space-y-8">
              <div className="flex justify-between items-start border-b border-[#1A1A1A]/10 pb-5">
                <div>
                  <span className="inline-block px-2.5 py-1 border border-[#1A1A1A]/30 text-[#1A1A1A]/70 text-[10px] font-mono uppercase tracking-wider font-bold">
                    Copilot Backup
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-ink mt-3">Night & Weekend Coverage</h3>
                </div>
              </div>

              <p className="font-serif text-sm text-ink-muted italic leading-relaxed">
                Designed for established organizations with daytime sales staff, securing continuous client acquisition coverage across nighttime, holiday, and overflow lead traffic.
              </p>

              {/* Price block */}
              <div className="py-6 border-y border-[#1A1A1A]/10 space-y-3">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-serif font-bold text-ink">{currency}799</span>
                  <span className="text-xs font-mono uppercase tracking-wider text-ink-muted font-bold">one-time setup</span>
                </div>
                <div className="flex items-baseline gap-1.5 text-ink font-mono text-sm">
                  <span>SUBS MONTHS RETAINER:</span>
                  <span className="text-xl font-bold font-serif text-ink">{currency}149</span>
                  <span className="text-xs text-ink-muted">/mo</span>
                </div>
              </div>

              {/* Features list */}
              <div className="space-y-4">
                <span className="block text-[10px] font-mono uppercase tracking-widest text-ink font-bold">[ INCLUDED UTILITIES ]</span>
                <ul className="space-y-3 text-xs font-mono uppercase tracking-wide text-ink-muted">
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-ink flex-shrink-0" />
                    <span>Custom Autonomous Lead Agent (Chat & SMS)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-ink flex-shrink-0" />
                    <span>Standard Lead Qualifying Playbook</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-ink flex-shrink-0" />
                    <span>Calendar API Booking Sync (Calendly, etc.)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-ink flex-shrink-0" />
                    <span>Standard Uptime & Hosting Maintenance</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-8 mt-10 border-t border-[#1A1A1A]/10">
              <a
                href="#book-demo"
                id="btn-copilot-tier"
                className="block w-full py-4 text-center bg-[#F4F1EA] hover:bg-ink hover:text-paper border border-[#1A1A1A] text-ink font-mono text-xs tracking-wider uppercase font-bold transition-all"
              >
                SELECT COPILOT SYSTEM
              </a>
            </div>
          </div>

          {/* Plan 2: Complete Staffing Solution (Includes Agent + Website) */}
          <div className="p-8 md:p-10 bg-white border-2 border-ink flex flex-col justify-between relative shadow-md">
            
            {/* Best value tag */}
            <div className="absolute -top-3.5 right-6 inline-flex items-center gap-1.5 px-3 py-1 bg-ink text-paper text-[9px] font-mono uppercase tracking-widest font-bold">
              <Flame className="w-3.5 h-3.5 text-paper" />
              RECOMMENDED FOR STAFF SHORTAGES
            </div>

            <div className="space-y-8">
              <div className="flex justify-between items-start border-b border-[#1A1A1A]/10 pb-5">
                <div>
                  <span className="inline-block px-2.5 py-1 bg-ink text-paper text-[10px] font-mono uppercase tracking-wider font-bold">
                    Full Suite Bundle
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-ink mt-3">Staff Replacement Playbook</h3>
                </div>
              </div>

              <p className="font-serif text-sm text-ink-muted italic leading-relaxed">
                For operations struggling with severe human staff shortages. We construct a <strong>fully-customized matching Business Website</strong> paired directly with your autonomous 24/7 Lead Agent.
              </p>

              {/* Price block */}
              <div className="py-6 border-y border-[#1A1A1A]/10 space-y-3">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-5xl font-serif font-bold text-ink">{currency}{setupFee}</span>
                  <span className="text-xs font-mono uppercase tracking-wider text-ink-muted font-bold">one-time setup</span>
                </div>
                <div className="flex items-baseline gap-1.5 text-ink font-mono text-sm">
                  <span>SUBS MONTHS RETAINER:</span>
                  <span className="text-2xl font-bold font-serif text-ink">{currency}{monthlyRetainer}</span>
                  <span className="text-xs text-ink-muted">/mo</span>
                </div>
              </div>

              {/* Package Details */}
              <div className="space-y-4">
                <span className="block text-[10px] font-mono uppercase tracking-widest text-ink font-bold">[ SYSTEM SPECIFICATIONS ]</span>
                <ul className="space-y-3.5 text-xs text-ink font-serif">
                  <li className="flex items-start gap-3">
                    <Globe className="w-4 h-4 text-ink flex-shrink-0 mt-0.5" />
                    <span><strong>High-Converting Website:</strong> Elegant, mobile-first, high-contrast grid layouts. Customized corporate copywriting, domain mappings, and lightning-fast static CDN hosting.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-ink flex-shrink-0 mt-0.5" />
                    <span><strong>Autonomous Agent Core:</strong> Custom-trained behaviors to capture details, qualify specific trades, address common objections, and route inquiries instantly.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Database className="w-4 h-4 text-ink flex-shrink-0 mt-0.5" />
                    <span><strong>SMS Instant Dispatcher:</strong> Intercepts lead arrivals from any contact form and initiates automated text messaging sequences within golden responder seconds.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ShieldCheck className="w-4 h-4 text-ink flex-shrink-0 mt-0.5" />
                    <span><strong>Fully Managed Maintenance:</strong> Monthly telemetry checks, regular playbook revisions, database storage limits, and full hosting administration included.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-8 mt-10 border-t border-[#1A1A1A]/10">
              <a
                href="#book-demo"
                id="btn-complete-tier"
                className="block w-full py-4 text-center bg-ink hover:bg-neutral-800 text-paper font-mono text-xs tracking-wider uppercase font-bold transition-all border border-ink"
              >
                SECURE BUNDLED PLATFORM
              </a>
            </div>
          </div>
        </div>

        {/* Interactive Cost & ROI Calculator */}
        <div className="max-w-4xl mx-auto bg-white border-2 border-ink p-8 md:p-10 shadow-sm relative">
          <div className="absolute top-0 right-12 -translate-y-1/2 bg-ink text-paper px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-wider">
            [ ROI TELEMETRY CALCULATOR ]
          </div>

          <div className="text-center max-w-2xl mx-auto mb-10 border-b border-[#1A1A1A]/10 pb-8">
            <h3 className="font-serif text-2xl md:text-3xl font-normal text-ink mb-3">
              Answering Delay Revenue Loss
            </h3>
            <p className="text-xs font-mono text-ink-muted uppercase tracking-wider">
              Adjust parameters below to map your actual monthly commercial traffic.
            </p>
          </div>

          <div className="grid md:grid-cols-12 gap-10 items-start">
            {/* Sliders Side */}
            <div className="md:col-span-7 space-y-8">
              {/* Slider 1: Leads */}
              <div>
                <div className="flex justify-between text-xs font-mono uppercase tracking-wider text-ink font-bold mb-3.5">
                  <span>[ Monthly Inbound Leads ]</span>
                  <span className="text-ink font-bold font-serif text-sm">{monthlyLeads} Leads</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="500"
                  value={monthlyLeads}
                  onChange={(e) => setMonthlyLeads(parseInt(e.target.value))}
                  className="w-full h-1 bg-[#1A1A1A]/20 rounded-none appearance-none cursor-pointer accent-[#1A1A1A] focus:outline-none"
                />
                <div className="flex justify-between text-[10px] font-mono text-ink-muted mt-1.5">
                  <span>5 Leads</span>
                  <span>500 Leads</span>
                </div>
              </div>

              {/* Slider 2: Ticket size */}
              <div>
                <div className="flex justify-between text-xs font-mono uppercase tracking-wider text-ink font-bold mb-3.5">
                  <span>[ Average Job/Contract Value ]</span>
                  <span className="text-ink font-bold font-serif text-sm">{currency}{avgLeadValue}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="5000"
                  step="50"
                  value={avgLeadValue}
                  onChange={(e) => setAvgLeadValue(parseInt(e.target.value))}
                  className="w-full h-1 bg-[#1A1A1A]/20 rounded-none appearance-none cursor-pointer accent-[#1A1A1A] focus:outline-none"
                />
                <div className="flex justify-between text-[10px] font-mono text-ink-muted mt-1.5">
                  <span>{currency}50</span>
                  <span>{currency}5,000</span>
                </div>
              </div>

              {/* Response Speed Choices */}
              <div>
                <span className="block text-xs font-mono uppercase tracking-widest text-ink font-bold mb-4">
                  [ YOUR TYPICAL RESPONSE SPEED ]
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'instant', label: 'Under 5 min', loss: 'Low Loss (5%)' },
                    { id: 'hour', label: '30m - 4 hours', loss: 'Heavy Loss (45%)' },
                    { id: 'day', label: 'Next Day+', loss: 'Extreme Loss (75%)' },
                  ].map((speed) => (
                    <button
                      key={speed.id}
                      type="button"
                      id={`calc-speed-${speed.id}`}
                      onClick={() => setResponseSpeed(speed.id as any)}
                      className={`p-3 border text-left transition-all rounded-none ${
                        responseSpeed === speed.id
                          ? 'bg-ink border-ink text-paper'
                          : 'bg-white border-[#1A1A1A]/20 text-ink hover:border-ink'
                      }`}
                    >
                      <span className="text-xs font-mono font-bold block leading-tight">{speed.label}</span>
                      <span className="text-[9px] block mt-1.5 font-mono uppercase opacity-85 leading-none">{speed.loss}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Calculations Side */}
            <div className="md:col-span-5 p-6 bg-[#fbfaf8] border border-ink/40 space-y-6">
              <h4 className="text-[10px] font-mono uppercase tracking-widest text-ink font-bold text-center border-b border-[#1A1A1A]/10 pb-3">
                PROJECTED RECOVERY MATRIX
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div className="border border-red-900/10 p-3 bg-red-50/20">
                  <span className="text-[9px] font-mono text-red-950 font-bold block uppercase tracking-wide">LEADS LOST</span>
                  <span className="text-xl font-mono font-bold text-red-900 mt-1 block">{leadsLost}</span>
                </div>

                <div className="border border-red-900/10 p-3 bg-red-50/20">
                  <span className="text-[9px] font-mono text-red-950 font-bold block uppercase tracking-wide">REVENUE BLEED</span>
                  <span className="text-xl font-mono font-bold text-red-900 mt-1 block">
                    {currency}{revenueBleed.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="border border-[#1A1A1A]/40 p-4 bg-white relative overflow-hidden">
                <span className="text-[9px] font-mono text-ink font-bold block uppercase tracking-wider mb-2">
                  [ RECOVERED BY LEAD AGENT ]
                </span>
                <span className="text-2xl font-serif font-bold text-ink mt-1 block">
                  +{currency}{recoveredRevenue.toLocaleString()}
                </span>
                <p className="text-[11px] font-serif italic text-ink-muted mt-2 leading-relaxed">
                  By engaging inquiries inside <strong>15 golden seconds</strong>, you claim bookings before they browse competitor options.
                </p>
              </div>

              {/* Net monthly value after retainer */}
              <div className="flex justify-between items-center text-xs font-mono font-bold text-ink pt-3 border-t border-[#1A1A1A]/10">
                <span>NET MONTHLY GAIN:</span>
                <span className="text-base font-serif font-bold text-ink">
                  +{currency}{netROI.toLocaleString()}/MO
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
