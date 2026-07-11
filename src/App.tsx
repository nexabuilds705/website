import React, { useState, useEffect, useRef } from 'react';
import { Bot, Sparkles, ArrowUpRight, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Disqualifier from './components/Disqualifier';
import Questionnaire from './components/Questionnaire';
import Dashboard from './components/Dashboard';
import { LeadSubmission } from './types';

export default function App() {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [submissionsUpdatedToggle, setSubmissionsUpdatedToggle] = useState(false);
  const [showFloatingBox, setShowFloatingBox] = useState(true);
  const [isBooked, setIsBooked] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Hide the floating CTA once the booking form scrolls into view
  useEffect(() => {
    const container = scrollContainerRef.current;

    const handleScroll = () => {
      const bookingSection = document.getElementById('book-demo');
      if (!bookingSection) return;

      let topOffset = 0;
      if (container && window.innerWidth >= 768) {
        topOffset = bookingSection.getBoundingClientRect().top - container.getBoundingClientRect().top;
      } else {
        topOffset = bookingSection.getBoundingClientRect().top;
      }

      const containerHeight = container ? container.clientHeight : window.innerHeight;
      const threshold = containerHeight - 80; // pill top-edge contact point (pill height ~48px + bottom-8 ~32px)
      setShowFloatingBox(topOffset >= threshold);
    };

    if (container) {
      container.addEventListener('scroll', handleScroll);
    } else {
      window.addEventListener('scroll', handleScroll);
    }

    handleScroll();

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      } else {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const handleBookingSuccess = (_submission: LeadSubmission) => {
    setSubmissionsUpdatedToggle(prev => !prev);
    setIsBooked(true);
  };

  const scrollToBooking = () => {
    const el = document.getElementById('book-demo');
    const container = scrollContainerRef.current;

    if (container && window.innerWidth >= 768) {
      container.scrollTo({ top: el?.offsetTop ?? 0, behavior: 'smooth' });
    } else {
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#EBE8DF] text-ink flex flex-col items-center justify-center font-sans antialiased selection:bg-ink selection:text-paper p-0 md:p-10 relative">

      {/* Phone simulator shell */}
      <div
        id="mobile-viewport"
        ref={scrollContainerRef}
        className="w-full h-screen md:h-[840px] md:max-w-[410px] bg-[#F4F1EA] border-0 md:border-4 md:border-ink md:shadow-2xl overflow-y-auto scroll-smooth flex flex-col relative custom-scrollbar md:rounded-[40px]"
      >

        {/* Sticky header */}
        <header className="sticky top-0 z-30 bg-[#F4F1EA]/95 backdrop-blur-sm border-b border-ink/15 py-3.5 px-5 flex items-center justify-center w-full">
          <div className="text-center flex flex-col items-center justify-center">
            <span className="font-serif font-bold text-sm tracking-widest text-ink block leading-none">NexaBuilds</span>
            <span className="text-[7.5px] font-mono tracking-wider text-ink-muted/85 uppercase block mt-1">Autonomous Systems</span>
          </div>
        </header>

        {/* Section 1: Corporate profile */}
        <section className="bg-white px-6 py-12 border-b border-ink/10 space-y-8 flex-shrink-0 text-center">
          <div className="space-y-3">
            <div className="inline-flex items-center justify-center gap-1.5 px-2.5 py-0.5 border border-ink/40 text-ink/75 text-[10px] font-mono uppercase tracking-widest rounded-full">
              <Sparkles className="w-3 h-3 text-ink animate-pulse" />
              PART I — CORPORATE PROFILE
            </div>
            <h1 className="font-serif text-[2.27rem] font-bold tracking-tight text-ink leading-tight">
              Follow up with your inbound leads immediately.
            </h1>
            <div className="w-12 h-[1.5px] bg-ink mx-auto" />
          </div>
          <div className="space-y-4 font-serif text-sm leading-relaxed text-ink-muted italic">
            <p>
              We are built for businesses that already generate inbound enquiries but don't have enough staff to immediately contact every lead. Our goal is to ensure inbound leads receive an immediate response before they lose interest or contact a competitor.
            </p>
            <p>
              By replacing traditional call-backs and email delay loops with immediate conversational action, we halt client leakage for high-ticket service operations.
            </p>
          </div>
        </section>

        {/* Section 2: Product mechanics */}
        <section className="bg-white px-6 py-12 border-b border-ink/10 space-y-8 flex-shrink-0 text-center">
          <div className="space-y-3">
            <h2 className="font-serif text-[2.27rem] font-bold tracking-tight text-ink leading-tight">
              How Our Lead Agents Convert Traffic
            </h2>
            <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/50 font-bold flex items-center justify-center gap-1.5">
              <Bot className="w-3 h-3" />
              Autonomous Dispatch Mechanics
            </h3>
            <div className="w-12 h-[1.5px] bg-ink mx-auto" />
          </div>
          <div className="space-y-5 pt-4 text-xs font-mono uppercase tracking-wide text-ink">
            {[
              { title: '90-Second Lead Capture', desc: 'Inbounds are instantly engaged via automated voice or text message parameters.' },
              { title: 'Real-time Intent Screening', desc: 'Our system verifies budgets and schedules before submitting slots to your CRM.' },
              { title: 'Guaranteed Pipeline Safety', desc: 'Eliminates the cost of missed weekend leads and late-night inquiries entirely.' },
            ].map(({ title, desc }) => (
              <div key={title} className="flex gap-4 items-start p-3 border border-ink/10 rounded-2xl bg-neutral-50/50">
                <div className="p-2 border border-ink bg-[#F4F1EA] flex-shrink-0 rounded-lg">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <div className="space-y-0.5">
                  <span className="font-bold block">{title}</span>
                  <p className="text-[10px] text-ink-muted font-normal lowercase font-serif italic tracking-normal">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Disqualifier */}
        <Disqualifier onScrollToQuestionnaire={scrollToBooking} />

        {/* Section 4: Booking questionnaire */}
        <Questionnaire
          onBookingSuccess={handleBookingSuccess}
          onReset={() => setIsBooked(false)}
          isAnimationTarget={!showFloatingBox}
        />

        {/* Footer */}
        <footer className="bg-[#E8E5DC] border-t border-ink/20 py-10 px-6 text-center space-y-6 flex-shrink-0">
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border border-ink bg-white flex items-center justify-center text-ink rounded-md">
              <Bot className="w-3 h-3" />
            </div>
            <span className="font-serif font-bold text-xs uppercase text-ink">NexaBuilds Autonomous</span>
          </div>
          <p className="text-[11px] font-serif text-ink-muted italic leading-relaxed max-w-xs mx-auto">
            Providing modern conversion engineering for high-intent business inquiries.
          </p>
          <div className="text-[9px] font-mono uppercase tracking-widest text-ink/40 space-y-2">
            <span>© 2026 NEXABUILDS AGENCY INC.</span>
            <div className="flex justify-center gap-2 pt-2 text-[8px] text-ink/50">
              <span>SLA GUARANTEED</span>
            </div>
          </div>
        </footer>

        {/* Floating "Book a Call Now" CTA pill */}
        <AnimatePresence>
          {showFloatingBox && !isBooked && (
            <motion.div
              layoutId="booking-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 28 }}
              onClick={scrollToBooking}
              style={{ left: '50%', transform: 'translateX(-50%)' }}
              className="fixed md:absolute bottom-8 z-40 bg-ink text-paper px-6 py-3 rounded-full shadow-2xl flex items-center justify-center gap-2 cursor-pointer hover:bg-neutral-800 border border-ink min-w-[170px] text-center"
            >
              <span className="font-mono text-[10px] md:text-xs uppercase tracking-widest font-bold">
                Book a Call Now
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-paper stroke-[2.5]" />
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Admin CRM modal */}
      <AnimatePresence>
        {isAdminMode && (
          <div className="fixed inset-0 z-50 bg-ink/75 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border-2 border-ink w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 md:p-8 rounded-3xl relative shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6 border-b border-ink/20 pb-4">
                <span className="inline-flex items-center gap-2 px-3 py-1 border border-ink text-ink text-[10px] font-mono font-bold uppercase tracking-wider bg-[#F4F1EA] rounded-lg">
                  ⚡ SECURE DISPATCH TELEMETRY
                </span>
                <button
                  type="button"
                  id="btn-close-crm-modal"
                  onClick={() => setIsAdminMode(false)}
                  className="p-1.5 border border-transparent hover:border-ink hover:bg-neutral-100 text-ink font-mono text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 rounded-xl transition-all"
                >
                  <X className="w-4 h-4" /> [ CLOSE ]
                </button>
              </div>
              <Dashboard submissionsUpdatedToggle={submissionsUpdatedToggle} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
