import React, { useState } from 'react';
import { Mail, User, Check, Sparkles, Building, ChevronLeft, ChevronRight, CalendarDays, AlertCircle, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LeadSubmission } from '../types';

interface QuestionnaireProps {
  onBookingSuccess: (newSubmission: LeadSubmission) => void;
  onReset?: () => void;
  isAnimationTarget?: boolean;
}

const COMMON_SERVICES = [
  { id: 'pool', label: 'Pool Installation & Design', icon: '🏊' },
  { id: 'homeservices', label: 'Home Services', icon: '🏠' },
  { id: 'realestate', label: 'Real Estate & Brokerage', icon: '🏢' },
  { id: 'other', label: 'Other Industry', icon: '⚙️' },
];

const DUBAI_HOME_SERVICES = [
  { id: 'home_ac', label: 'AC Maintenance & Repair', icon: '❄️' },
  { id: 'home_cleaning', label: 'Deep Cleaning & Maid Services', icon: '🧹' },
  { id: 'home_handyman', label: 'Plumbing & Handyman Work', icon: '🔧' },
  { id: 'home_pest', label: 'Pest Control Services', icon: '🐜' },
];


export default function Questionnaire({ onBookingSuccess, onReset, isAnimationTarget }: QuestionnaireProps) {
  // Wizard steps: 1 (Info), 2 (Services/Volume), 3 (Special Instructions), 4 (Success)
  const [step, setStep] = useState<number>(1);
  const [formError, setFormError] = useState<string>('');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [subHomeService, setSubHomeService] = useState('');
  const [otherIndustry, setOtherIndustry] = useState('');
  const [crm, setCrm] = useState('');
  const [leadScoring, setLeadScoring] = useState('');
  const [inboundVolume, setInboundVolume] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [notes, setNotes] = useState('');





  const handleNextStep = () => {
    setFormError('');
    if (step === 1) {
      if (!name.trim()) {
        setFormError('Please enter your full name.');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setFormError('Please enter a valid business email.');
        return;
      }
      if (!phone.trim() || phone.replace(/\D/g, '').length < 8) {
        setFormError('Please enter a valid contact phone number.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!selectedCategory) {
        setFormError('Please select a service category.');
        return;
      }
      if (selectedCategory === 'homeservices' && !subHomeService) {
        setFormError('Please select a specific home service.');
        return;
      }
      if (selectedCategory === 'other' && !otherIndustry.trim()) {
        setFormError('Please specify your industry.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    }
  };

  const handlePrevStep = () => {
    setFormError('');
    setStep(prev => prev - 1);
  };

  const handleFinalSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();

    let finalServices: string[] = [];
    if (selectedCategory === 'homeservices') {
      const subLabel = DUBAI_HOME_SERVICES.find(s => s.id === subHomeService)?.label || subHomeService;
      finalServices = [`Home Services: ${subLabel}`];
    } else if (selectedCategory === 'other') {
      finalServices = [`Other: ${otherIndustry.trim()}`];
    } else {
      const mainLabel = COMMON_SERVICES.find(s => s.id === selectedCategory)?.label || selectedCategory;
      finalServices = [mainLabel];
    }

    const submission: LeadSubmission = {
      id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      name,
      email,
      phone,
      services: finalServices,
      preferredDate: "",
      preferredTime: "",
      staffingProblem: false,
      inboundVolume,
      notes,
      crm: crm.trim() || undefined,
      leadScoring: leadScoring.trim() || undefined,
      bookedAt: new Date().toISOString()
    };

    // Save to LocalStorage
    try {
      const existing = localStorage.getItem('lead_submissions');
      const submissions = existing ? JSON.parse(existing) : [];
      submissions.push(submission);
      localStorage.setItem('lead_submissions', JSON.stringify(submissions));
    } catch (e) {
      console.error("Storage error:", e);
    }

    // Pass up
    onBookingSuccess(submission);
    setStep(4);
  };

  return (
    <section id="book-demo" className="py-12 bg-white relative border-b border-[#1A1A1A]">
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#1A1A1A]/40 text-[#1A1A1A]/70 text-[10px] font-mono uppercase tracking-widest mb-4">
            <CalendarDays className="w-3 h-3 text-ink" />
            PART III — SECURE A CALL
          </div>
          <h2 className="font-serif text-[1.82rem] font-bold tracking-tight text-ink mb-3">
            Secure Your Call & Live Demo
          </h2>
          <div className="w-12 h-[1px] bg-[#1A1A1A] mx-auto mb-3"></div>
          <p className="font-serif text-xs md:text-sm text-ink-muted leading-relaxed italic">
            Fill out the form and witness our service in action.
          </p>
        </div>

        {/* Wizard Container */}
        <motion.div
          layoutId={isAnimationTarget ? 'booking-card' : undefined}
          transition={{ type: 'spring', stiffness: 200, damping: 28 }}
          className="rounded-2xl shadow-sm overflow-hidden min-h-[460px] flex flex-col relative border-2 border-[#1A1A1A] bg-[#1A1A1A] z-10"
        >

          {/* Progress indicator */}
          {step < 5 && (
            <div className="border-b border-white/10 px-5 py-2.5 bg-neutral-900/90 backdrop-blur-sm flex justify-between items-center text-[10px] font-mono text-paper/60 rounded-t-2xl">
              <span>PROTOTYPE DISPATCHER</span>
              <span className="font-bold">STEP 0{step} OF 04</span>
            </div>
          )}

          {/* Error Banner */}
          {formError && (
            <div className="bg-red-950/90 border-b border-white/10 px-5 py-3 flex items-center gap-2 text-red-200 text-xs font-serif italic">
              <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Wizard Content */}
          <div className="p-5 md:p-8 flex-1 flex flex-col justify-between rounded-b-2xl">
            <AnimatePresence mode="wait">
              {/* STEP 1: Basic Info */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="border-b border-white/10 pb-4">
                    <h3 className="font-serif text-2xl font-bold text-paper flex items-center gap-3">
                      <User className="w-5 h-5 text-paper" />
                      1. Registrant Particulars
                    </h3>
                    <p className="text-paper/60 text-sm font-serif italic mt-1">Please introduce yourself and your firm.</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-paper font-bold mb-2.5" htmlFor="input-name">
                        Full Name of Registrant
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-paper/40">
                          <User className="w-4 h-4" />
                        </span>
                        <input
                          type="text"
                          id="input-name"
                          placeholder="Jane Doe"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full pl-11 pr-4 py-3.5 bg-neutral-900 border border-white/20 text-paper placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-white focus:bg-neutral-800 text-sm font-sans rounded-xl transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-paper font-bold mb-2.5" htmlFor="input-email">
                          Corporate Email Address
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-paper/40">
                            <Mail className="w-4 h-4" />
                          </span>
                          <input
                            type="email"
                            id="input-email"
                            placeholder="jane@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-11 pr-4 py-3.5 bg-neutral-900 border border-white/20 text-paper placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-white focus:bg-neutral-800 text-sm font-sans rounded-xl transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-paper font-bold mb-2.5" htmlFor="input-phone">
                          Primary Voice / SMS Number
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-paper/40">
                            <Phone className="w-4 h-4" />
                          </span>
                          <input
                            type="tel"
                            id="input-phone"
                            placeholder="(555) 000-0000"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full pl-11 pr-4 py-3.5 bg-neutral-900 border border-white/20 text-paper placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-white focus:bg-neutral-800 text-sm font-sans rounded-xl transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Service & Inbound Volume */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="border-b border-white/10 pb-4">
                    <h3 className="font-serif text-2xl font-bold text-paper flex items-center gap-3">
                      <Building className="w-5 h-5 text-paper" />
                      2. Service Offerings & Scope
                    </h3>
                    <p className="text-paper/60 text-sm font-serif italic mt-1">Select the primary category that applies to your business operations.</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {COMMON_SERVICES.map((srv) => {
                      const selected = selectedCategory === srv.id;
                      return (
                        <button
                          key={srv.id}
                          type="button"
                          id={`service-toggle-${srv.id}`}
                          onClick={() => {
                            setSelectedCategory(srv.id);
                            setFormError('');
                          }}
                          className={`p-4 border text-left transition-all rounded-xl flex flex-col justify-between h-28 ${
                            selected
                              ? 'bg-white border-white text-ink font-bold shadow-md'
                              : 'bg-neutral-900 border-white/10 hover:border-white/30 text-paper'
                          }`}
                        >
                          <span className="text-2xl block mb-2">{srv.icon}</span>
                          <div>
                            <span className="text-xs font-mono uppercase tracking-tight block leading-tight font-bold">{srv.label}</span>
                            {selected && (
                              <span className="inline-flex items-center gap-1 mt-1.5 text-[9px] font-mono tracking-wider uppercase text-ink/75">
                                [ SELECTED ]
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Sub Home Services (if Home Services is selected) */}
                  {selectedCategory === 'homeservices' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-5 border border-white/10 bg-neutral-900/60 rounded-xl space-y-4"
                    >
                      <label className="block text-xs font-mono uppercase tracking-widest text-paper font-bold">
                        [ SELECT POPULAR DUBAI HOME SERVICE ]
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {DUBAI_HOME_SERVICES.map((sub) => {
                          const isSel = subHomeService === sub.id;
                          return (
                            <button
                              key={sub.id}
                              type="button"
                              id={`sub-home-${sub.id}`}
                              onClick={() => {
                                setSubHomeService(sub.id);
                                setFormError('');
                              }}
                              className={`p-3 border text-left transition-all rounded-xl flex items-center gap-3 ${
                                isSel
                                  ? 'bg-white border-white text-ink font-bold shadow-md'
                                  : 'bg-neutral-900 border-white/10 hover:border-white/30 text-paper'
                              }`}
                            >
                              <span className="text-xl">{sub.icon}</span>
                              <span className="text-xs font-mono uppercase tracking-tight block leading-tight font-bold">{sub.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* Other Industry Input (if Other is selected) */}
                  {selectedCategory === 'other' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-5 border border-white/10 bg-neutral-900/60 rounded-xl space-y-3"
                    >
                      <label className="block text-xs font-mono uppercase tracking-widest text-paper font-bold" htmlFor="input-other-industry">
                        [ SPECIFY YOUR INDUSTRY ]
                      </label>
                      <input
                        type="text"
                        id="input-other-industry"
                        placeholder="e.g. Landscaping, E-commerce, Logistics"
                        value={otherIndustry}
                        onChange={(e) => {
                          setOtherIndustry(e.target.value);
                          setFormError('');
                        }}
                        className="w-full px-4 py-3 bg-neutral-900 border border-white/20 text-paper placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-white focus:bg-neutral-800 text-sm font-sans rounded-xl transition-colors"
                      />
                    </motion.div>
                  )}

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-paper font-bold mb-3">
                      [ ESTIMATED MONTHLY INBOUND VOLUME ]
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { id: 'low', label: '1 - 20 leads/mo', desc: 'Incidental flow' },
                        { id: 'medium', label: '21 - 100 leads/mo', desc: 'Steady flow' },
                        { id: 'high', label: '101 - 300 leads/mo', desc: 'High demand' },
                        { id: 'critical', label: '300+ leads/mo', desc: 'Overloaded' },
                      ].map((vol) => {
                        const isSel = inboundVolume === vol.id;
                        return (
                          <button
                            key={vol.id}
                            type="button"
                            id={`volume-${vol.id}`}
                            onClick={() => setInboundVolume(vol.id as any)}
                            className={`p-3 border text-center transition-all rounded-xl ${
                              isSel
                                ? 'bg-white border-white text-ink font-bold shadow-md'
                                : 'bg-neutral-900 border-white/10 hover:border-white/30 text-paper'
                            }`}
                          >
                            <span className="text-xs font-mono font-bold block">{vol.label}</span>
                            <span className={`text-[9px] font-mono block mt-1 ${isSel ? 'text-ink/70' : 'text-paper/50'}`}>
                              {vol.desc}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Staffing Bottleneck check */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="border-b border-white/10 pb-4">
                    <h3 className="font-serif text-2xl font-bold text-paper flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-paper" />
                      3. Special Instructions & Integrations
                    </h3>
                    <p className="text-paper/60 text-sm font-serif italic mt-1 leading-relaxed">
                      Providing details regarding your current lead scoring workflow or CRM platforms will allow our engineering team to pre-configure integration hooks prior to our call, ensuring a highly productive meeting.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-paper font-bold mb-2.5" htmlFor="input-crm">
                        CRM / Lead Management Software (Optional)
                      </label>
                      <input
                        type="text"
                        id="input-crm"
                        placeholder="e.g. ServiceTitan, HubSpot, Salesforce, custom CRM..."
                        value={crm}
                        onChange={(e) => setCrm(e.target.value)}
                        className="w-full px-4 py-3.5 bg-neutral-900 border border-white/20 text-paper placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-white focus:bg-neutral-800 text-sm font-sans rounded-xl transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-paper font-bold mb-2.5" htmlFor="input-scoring">
                        Lead Scoring Process & Workflow Requirements (Optional)
                      </label>
                      <textarea
                        id="input-scoring"
                        rows={4}
                        placeholder="e.g. Tell us how you score, route, or filter inbound leads so we can prepare specialized handling playbooks..."
                        value={leadScoring}
                        onChange={(e) => setLeadScoring(e.target.value)}
                        className="w-full px-4 py-3.5 bg-neutral-900 border border-white/20 text-paper placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-white focus:bg-neutral-800 text-sm font-sans rounded-xl transition-colors"
                      />
                    </div>
                  </div>
                </motion.div>
              )}



              {/* STEP 4: Success Screen */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6 space-y-8 max-w-lg mx-auto"
                >
                  <div className="w-16 h-16 border-2 border-white text-paper bg-neutral-900 flex items-center justify-center mx-auto rounded-full">
                    <Check className="w-8 h-8 stroke-[2.5]" />
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-serif text-3xl font-bold text-paper">
                      Reservation Locked
                    </h3>
                    <p className="text-paper/60 text-sm font-serif italic">
                      Thank you, {name}. Your automated lead agent staging environment has been initialized.
                    </p>
                  </div>

                  {/* Dispatch Confirmation Card */}
                  <div className="bg-neutral-950 border border-white/10 p-6 text-left space-y-4 rounded-xl">
                    <div className="flex justify-between items-center border-b border-white/10 pb-3">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-paper/50 font-bold">DISPATCH CONFIRMATION</span>
                      <span className="px-2.5 py-0.5 border border-white/20 text-paper text-[9px] font-mono uppercase tracking-wider">ACTIVE AGENT QUEUE</span>
                    </div>

                    <div className="space-y-2.5 font-sans">
                      <div className="flex items-center gap-3 text-paper">
                        <User className="w-4 h-4 text-paper" />
                        <span className="text-xs font-mono font-bold">{name.toUpperCase()}</span>
                      </div>
                      <div className="flex items-center gap-3 text-paper">
                        <Mail className="w-4 h-4 text-paper" />
                        <span className="text-xs font-mono text-paper/70">{email}</span>
                      </div>
                    </div>

                    <div className="pt-3.5 text-paper/60 text-xs leading-relaxed border-t border-white/10 font-serif italic">
                      <strong>Next Steps:</strong> A confirmation email has been dispatched. Our team will contact you momentarily to align on parameters and schedule your live deployment workspace.
                    </div>
                  </div>

                  {crm ? (
                    <div className="p-5 border border-white/10 bg-neutral-900/40 text-left text-paper text-xs font-serif leading-relaxed rounded-xl">
                      <span className="font-mono font-bold uppercase tracking-wider block mb-1 text-[10px] text-paper">[ CRM INTEGRATION QUEUED ]</span>
                      Our integration suite has been configured for <strong>{crm}</strong>. We will demonstrate live contact syncing and dispatch webhooks during our review session.
                    </div>
                  ) : (
                    <div className="p-5 border border-white/10 bg-neutral-900/40 text-left text-paper text-xs font-serif leading-relaxed rounded-xl">
                      <span className="font-mono font-bold uppercase tracking-wider block mb-1 text-[10px] text-paper">[ STANDARD LOGGING ACTIVE ]</span>
                      We have configured standard secure email and telemetry dispatcher logs. Integrations can be added at any time during our onboarding walkthrough.
                    </div>
                  )}

                  <div className="pt-4">
                    <button
                      type="button"
                      id="btn-success-reset"
                      onClick={() => {
                        // Reset
                        setStep(1);
                        setName('');
                        setEmail('');
                        setPhone('');
                        setSelectedCategory('');
                        setSubHomeService('');
                        setOtherIndustry('');
                        setCrm('');
                        setLeadScoring('');
                        setNotes('');
                        onReset?.();
                      }}
                      className="text-xs font-mono uppercase tracking-widest text-paper/50 hover:text-paper font-bold underline cursor-pointer transition-colors"
                    >
                      Book Another Slot / Start Over
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step navigation for steps 1-3 */}
            {step < 4 && (
              <div className="flex items-center justify-between border-t border-white/10 pt-6 mt-10">
                <button
                  type="button"
                  id={`btn-prev-step${step}`}
                  disabled={step === 1}
                  onClick={handlePrevStep}
                  className="inline-flex items-center gap-2 py-2 px-4 hover:bg-neutral-800 text-paper/60 font-mono text-xs uppercase tracking-wider transition-all disabled:opacity-20 disabled:hover:bg-transparent rounded-lg"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>

                {step === 3 ? (
                  <button
                    type="button"
                    id="btn-submit-booking"
                    onClick={() => handleFinalSubmit()}
                    className="inline-flex items-center gap-3 py-3.5 px-8 bg-white hover:bg-neutral-100 text-ink font-mono text-xs uppercase tracking-wider transition-all border border-white font-bold rounded-xl shadow-md cursor-pointer"
                  >
                    SECURE RESERVATION
                  </button>
                ) : (
                  <button
                    type="button"
                    id={`btn-next-step${step}`}
                    onClick={handleNextStep}
                    className="inline-flex items-center gap-3 py-3.5 px-6 bg-white hover:bg-neutral-100 text-ink font-mono text-xs uppercase tracking-wider transition-all font-bold border border-white rounded-xl shadow-md cursor-pointer"
                  >
                    Continue <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
