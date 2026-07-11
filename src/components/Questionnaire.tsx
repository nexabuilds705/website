import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Mail, Phone, User, Check, AlertCircle, Sparkles, Building, PhoneCall, ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LeadSubmission } from '../types';

interface QuestionnaireProps {
  onBookingSuccess: (newSubmission: LeadSubmission) => void;
  onReset?: () => void;
}

const COMMON_SERVICES = [
  { id: 'hvac', label: 'HVAC & Plumbing', icon: '🔧' },
  { id: 'electrical', label: 'Electrical Services', icon: '⚡' },
  { id: 'realestate', label: 'Real Estate & Brokerage', icon: '🏠' },
  { id: 'legal', label: 'Legal & Consulting', icon: '💼' },
  { id: 'marketing', label: 'Digital Marketing / Agency', icon: '📈' },
  { id: 'healthcare', label: 'Medical & Dental Clinic', icon: '🩺' },
  { id: 'it', label: 'SaaS & IT Solutions', icon: '💻' },
  { id: 'general', label: 'Other B2B / B2C Trades', icon: '⚙️' },
];

const TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM', '01:30 PM', '02:30 PM', '03:30 PM', '04:30 PM'
];

export default function Questionnaire({ onBookingSuccess, onReset }: QuestionnaireProps) {
  // Wizard steps: 1 (Info), 2 (Services/Volume), 3 (Staffing pain), 4 (Calendar Book), 5 (Success)
  const [step, setStep] = useState<number>(1);
  const [formError, setFormError] = useState<string>('');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [staffingProblem, setStaffingProblem] = useState<boolean | null>(null);
  const [inboundVolume, setInboundVolume] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [notes, setNotes] = useState('');

  // Calendar state — months are 0-indexed (6 = July, 7 = August)
  const [activeMonth, setActiveMonth] = useState(6);
  const [selectedDateStr, setSelectedDateStr] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');

  // Generate calendar day objects for July (month=6) or August (month=7) 2026
  const getCalendarDays = (month: number) => {
    const daysInMonth = 31; // both July and August have 31 days
    const startDayOfWeek = month === 6 ? 3 : 6; // Jul 1 = Wednesday, Aug 1 = Saturday
    const days = [];

    // Empty spaces for padding
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push({ dayNum: 0, isWeekend: false, dateStr: '' });
    }

    // Days list
    for (let d = 1; d <= daysInMonth; d++) {
      const dayOfWeek = (startDayOfWeek + d - 1) % 7;
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const formattedMonth = String(month + 1).padStart(2, '0');
      const formattedDay = String(d).padStart(2, '0');
      const dateStr = `2026-${formattedMonth}-${formattedDay}`;

      // In July 2026, the current date is July 11th. So disable dates before 11th.
      const isPast = month === 6 && d < 11;

      days.push({
        dayNum: d,
        isWeekend,
        isPast,
        dateStr,
      });
    }

    return days;
  };

  const calendarDays = getCalendarDays(activeMonth);

  const handleServiceToggle = (id: string) => {
    if (selectedServices.includes(id)) {
      setSelectedServices(selectedServices.filter(s => s !== id));
    } else {
      setSelectedServices([...selectedServices, id]);
    }
  };

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
      if (selectedServices.length === 0) {
        setFormError('Please select at least one service category you offer.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (staffingProblem === null) {
        setFormError('Please select if you face staffing challenges for leads.');
        return;
      }
      setStep(4);
    }
  };

  const handlePrevStep = () => {
    setFormError('');
    setStep(prev => prev - 1);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDateStr) {
      setFormError('Please pick a date on the calendar.');
      return;
    }
    if (!selectedTimeSlot) {
      setFormError('Please select a preferred meeting slot.');
      return;
    }

    const submission: LeadSubmission = {
      id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      name,
      email,
      phone,
      services: selectedServices,
      preferredDate: selectedDateStr,
      preferredTime: selectedTimeSlot,
      staffingProblem: !!staffingProblem,
      inboundVolume,
      notes,
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
    setStep(5);
  };

  const formatDateLabel = (dateStr: string) => {
    if (!dateStr) return '';
    const [, m, d] = dateStr.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[parseInt(m) - 1]} ${parseInt(d)}, 2026`;
  };

  return (
    <section id="book-demo" className="py-12 bg-[#F4F1EA] relative border-b border-[#1A1A1A]">
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#1A1A1A]/40 text-[#1A1A1A]/70 text-[10px] font-mono uppercase tracking-widest mb-4">
            <CalendarDays className="w-3 h-3 text-ink" />
            PART III — SECURE A CALL
          </div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-ink mb-3">
            Lock in a Live Demonstration
          </h2>
          <div className="w-12 h-[1px] bg-[#1A1A1A] mx-auto mb-3"></div>
          <p className="font-serif text-xs md:text-sm text-ink-muted leading-relaxed italic">
            Select a preferred day and time. We will configure a custom agent mock for your specific trade, then walk you through its core mechanics.
          </p>
        </div>

        {/* Wizard Container */}
        <div className="rounded-2xl shadow-sm overflow-hidden min-h-[460px] flex flex-col relative border-2 border-[#1A1A1A] bg-[#1A1A1A] z-10">

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
                    <p className="text-paper/60 text-sm font-serif italic mt-1">Select all categories that apply to your business operations.</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {COMMON_SERVICES.map((srv) => {
                      const selected = selectedServices.includes(srv.id);
                      return (
                        <button
                          key={srv.id}
                          type="button"
                          id={`service-toggle-${srv.id}`}
                          onClick={() => handleServiceToggle(srv.id)}
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
                      <PhoneCall className="w-5 h-5 text-paper" />
                      3. Operational Bottlenecks
                    </h3>
                    <p className="text-paper/60 text-sm font-serif italic mt-1">
                      Are you currently facing the problem of not having enough dedicated staff to handle all of your inbound leads?
                    </p>
                  </div>

                  <div className="space-y-4">
                    <button
                      type="button"
                      id="staff-problem-yes"
                      onClick={() => setStaffingProblem(true)}
                      className={`w-full p-6 border text-left flex items-start gap-4 transition-all rounded-2xl ${
                        staffingProblem === true
                          ? 'bg-white border-white text-ink shadow-lg'
                          : 'bg-neutral-900 border-white/10 hover:border-white/30 text-paper'
                      }`}
                    >
                      <div className={`p-2 border text-lg rounded-lg ${
                        staffingProblem === true ? 'bg-neutral-100 border-ink/10' : 'bg-neutral-800 border-white/10'
                      }`}>
                        ⚠️
                      </div>
                      <div>
                        <span className={`font-serif text-lg font-bold block ${
                          staffingProblem === true ? 'text-ink' : 'text-paper'
                        }`}>Yes, we suffer from inbound capacity constraints</span>
                        <p className={`text-xs mt-2 leading-relaxed font-serif ${
                          staffingProblem === true ? 'text-ink/80' : 'text-paper/60'
                        }`}>
                          We miss calls, fail to respond within golden minutes, or lack dedicated staff to work evenings & weekends. Leads eventually drop off and buy elsewhere.
                        </p>
                      </div>
                    </button>

                    <button
                      type="button"
                      id="staff-problem-no"
                      onClick={() => setStaffingProblem(false)}
                      className={`w-full p-6 border text-left flex items-start gap-4 transition-all rounded-2xl ${
                        staffingProblem === false
                          ? 'bg-white border-white text-ink shadow-lg'
                          : 'bg-neutral-900 border-white/10 hover:border-white/30 text-paper'
                      }`}
                    >
                      <div className={`p-2 border text-lg rounded-lg ${
                        staffingProblem === false ? 'bg-neutral-100 border-ink/10' : 'bg-neutral-800 border-white/10'
                      }`}>
                        ✓
                      </div>
                      <div>
                        <span className={`font-serif text-lg font-bold block ${
                          staffingProblem === false ? 'text-ink' : 'text-paper'
                        }`}>No, we have robust instant answering systems</span>
                        <p className={`text-xs mt-2 leading-relaxed font-serif ${
                          staffingProblem === false ? 'text-ink/80' : 'text-paper/60'
                        }`}>
                          We employ dedicated inside sales agents who respond via call and text in under 2 minutes, 24/7/365, without exception.
                        </p>
                      </div>
                    </button>
                  </div>

                  {staffingProblem === true && (
                    <div className="p-5 border border-white/10 bg-neutral-950 text-paper text-xs leading-relaxed flex gap-3 rounded-xl font-serif">
                      <Sparkles className="w-4 h-4 text-paper flex-shrink-0 mt-0.5 animate-pulse" />
                      <span>
                        <strong>Staffing Solution Eligibility:</strong> Since you have an inbound bottleneck, you qualify for our <strong>Comprehensive Launch Suite</strong>. This packages our custom Lead Agent with a highly-tuned Business Website to convert traffic, available under our introductory setup + retainer tier detailed below.
                      </span>
                    </div>
                  )}
                </motion.div>
              )}

              {/* STEP 4: Beautiful Interactive Calendar Booking */}
              {step === 4 && (
                <form onSubmit={handleFinalSubmit} className="space-y-6">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-paper flex items-center gap-3">
                      <CalendarIcon className="w-5 h-5 text-paper" />
                      4. Dispatch Scheduling
                    </h3>
                    <p className="text-paper/60 text-sm font-serif italic mt-1">Select a business day in July or August 2026. (Closed weekends).</p>
                  </div>

                  <div className="grid md:grid-cols-12 gap-8">
                    {/* Calendar Grid (8 cols) */}
                    <div className="md:col-span-7 bg-neutral-900/60 p-5 border border-white/10 rounded-2xl">
                      {/* Month Toggle Header */}
                      <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-3">
                        <span className="font-mono text-xs uppercase tracking-wider font-bold text-paper">
                          {activeMonth === 6 ? 'July 2026' : 'August 2026'}
                        </span>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            id="btn-month-prev"
                            disabled={activeMonth === 6}
                            onClick={() => setActiveMonth(6)}
                            className="p-1.5 bg-neutral-800 border border-white/10 text-paper hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-colors"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            id="btn-month-next"
                            disabled={activeMonth === 7}
                            onClick={() => setActiveMonth(7)}
                            className="p-1.5 bg-neutral-800 border border-white/10 text-paper hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-colors"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Day of Week Headers */}
                      <div className="grid grid-cols-7 text-center gap-1 mb-3">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                          <span key={d} className="text-[10px] font-mono uppercase tracking-widest text-paper/50 font-bold py-1">
                            {d}
                          </span>
                        ))}
                      </div>

                      {/* Calendar Days */}
                      <div className="grid grid-cols-7 gap-1">
                        {calendarDays.map((day, idx) => {
                          if (day.dayNum === 0) {
                            return <div key={`empty-${idx}`} />;
                          }

                          const isSelected = selectedDateStr === day.dateStr;
                          const selectable = !day.isWeekend && !day.isPast;

                          return (
                            <button
                              key={`day-${day.dateStr}`}
                              type="button"
                              id={`calendar-day-${day.dateStr}`}
                              disabled={!selectable}
                              onClick={() => {
                                setSelectedDateStr(day.dateStr);
                                setFormError('');
                              }}
                              className={`py-2 text-xs font-mono font-bold transition-all border rounded-lg ${
                                isSelected
                                  ? 'bg-white border-white text-ink shadow-md'
                                  : selectable
                                  ? 'bg-neutral-800 text-paper border-white/10 hover:border-white/30 hover:bg-neutral-700 cursor-pointer'
                                  : 'text-neutral-600 bg-neutral-900/20 border-transparent cursor-not-allowed'
                              }`}
                            >
                              <span>{day.dayNum}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Time slots and summary (5 cols) */}
                    <div className="md:col-span-5 flex flex-col justify-between space-y-6">
                      <div>
                        <span className="block text-xs font-mono uppercase tracking-widest text-paper font-bold mb-3">
                          [ SLOTS: {selectedDateStr ? formatDateLabel(selectedDateStr).toUpperCase() : 'SELECT DATE'} ]
                        </span>
                        
                        {!selectedDateStr ? (
                          <div className="p-8 text-center border border-dashed border-white/10 bg-neutral-950/40 flex flex-col items-center justify-center min-h-[160px] rounded-xl">
                            <Clock className="w-5 h-5 text-paper/40 mb-2.5" />
                            <span className="text-xs font-serif italic text-paper/50">Select an active weekday to view available booking hours.</span>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-2">
                            {TIME_SLOTS.map((slot) => {
                              const isSelected = selectedTimeSlot === slot;
                              return (
                                <button
                                  key={slot}
                                  type="button"
                                  id={`time-slot-${slot.replace(':', '-').replace(' ', '-')}`}
                                  onClick={() => setSelectedTimeSlot(slot)}
                                  className={`py-2.5 px-3 text-xs font-mono uppercase tracking-wider border transition-all rounded-xl ${
                                    isSelected
                                      ? 'bg-white border-white text-ink font-bold shadow-md'
                                      : 'bg-neutral-800 border-white/10 hover:border-white/30 text-paper'
                                  }`}
                                >
                                  {slot}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Brief Notes */}
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-paper font-bold mb-2.5" htmlFor="input-notes">
                          Special Instructions or Context (Optional)
                        </label>
                        <textarea
                          id="input-notes"
                          rows={2}
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="e.g., We use ServiceTitan CRM, call cell..."
                          className="w-full text-xs p-3.5 bg-neutral-900 border border-white/20 text-paper placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-white focus:bg-neutral-800 font-sans rounded-xl transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Booking Recap */}
                  {selectedDateStr && selectedTimeSlot && (
                    <div className="bg-neutral-950 border border-white/15 p-4 flex items-center justify-between text-paper mt-6 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white text-ink rounded-lg">
                          <Check className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-widest text-paper/60 font-bold block">CONFIRMED DISPATCH SLOT</span>
                          <span className="text-sm font-serif font-bold">
                            {formatDateLabel(selectedDateStr)} @ {selectedTimeSlot} (Eastern Standard Time)
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Submission Buttons */}
                  <div className="flex items-center justify-between border-t border-white/10 pt-6 mt-8">
                    <button
                      type="button"
                      id="btn-back-step4"
                      onClick={handlePrevStep}
                      className="inline-flex items-center gap-2 py-3 px-5 border border-transparent hover:bg-neutral-800 text-paper/70 font-mono text-xs uppercase tracking-wider transition-all"
                    >
                      <ChevronLeft className="w-4 h-4" /> Back
                    </button>
                    <button
                      type="submit"
                      id="btn-submit-booking"
                      className="inline-flex items-center gap-3 py-4 px-8 bg-white hover:bg-neutral-100 text-ink font-mono text-xs uppercase tracking-wider transition-all border border-white font-bold rounded-xl shadow-md"
                    >
                      SECURE RESERVATION
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 5: Success Screen */}
              {step === 5 && (
                <motion.div
                  key="step5"
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

                  {/* Calendar Event Card */}
                  <div className="bg-neutral-950 border border-white/10 p-6 text-left space-y-4 rounded-xl">
                    <div className="flex justify-between items-center border-b border-white/10 pb-3">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-paper/50 font-bold">DISPATCH INVITATION</span>
                      <span className="px-2.5 py-0.5 border border-white/20 text-paper text-[9px] font-mono uppercase tracking-wider">VIDEO CONFERENCE</span>
                    </div>

                    <div className="space-y-2.5 font-sans">
                      <div className="flex items-center gap-3 text-paper">
                        <CalendarIcon className="w-4 h-4 text-paper" />
                        <span className="text-xs font-mono font-bold">{formatDateLabel(selectedDateStr).toUpperCase()}</span>
                      </div>
                      <div className="flex items-center gap-3 text-paper">
                        <Clock className="w-4 h-4 text-paper" />
                        <span className="text-xs font-mono">{selectedTimeSlot} (Eastern Standard Time)</span>
                      </div>
                      <div className="flex items-center gap-3 text-paper">
                        <Mail className="w-4 h-4 text-paper" />
                        <span className="text-xs font-mono text-paper/70">{email}</span>
                      </div>
                    </div>

                    <div className="pt-3.5 text-paper/60 text-xs leading-relaxed border-t border-white/10 font-serif italic">
                      <strong>Next Steps:</strong> A calendar invitation with video bridge instructions will arrive at <strong>{email}</strong> momentarily. Please prepare access parameters or URLs for your current business website.
                    </div>
                  </div>

                  {staffingProblem === true ? (
                    <div className="p-5 border border-white/10 bg-neutral-900/40 text-left text-paper text-xs font-serif leading-relaxed rounded-xl">
                      <span className="font-mono font-bold uppercase tracking-wider block mb-1 text-[10px] text-paper">[ COMPREHENSIVE SUITE ACTIVE ]</span>
                      Since you selected active staffing bottlenecks, we have queued our bundled <strong>Lead Agent + Responsive Companion Website</strong> package at the discounted setup fee shown in our pricing directory below.
                    </div>
                  ) : (
                    <div className="p-5 border border-white/10 bg-neutral-900/40 text-left text-paper text-xs font-serif leading-relaxed rounded-xl">
                      <span className="font-mono font-bold uppercase tracking-wider block mb-1 text-[10px] text-paper">[ COPILOT ROUTING ACTIVE ]</span>
                      Since you employ answering staff, we have configured an overflow playbook where the agent captures after-hours prospects and schedules calendar dispatches directly.
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
                        setSelectedServices([]);
                        setStaffingProblem(null);
                        setSelectedDateStr('');
                        setSelectedTimeSlot('');
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

                <button
                  type="button"
                  id={`btn-next-step${step}`}
                  onClick={handleNextStep}
                  className="inline-flex items-center gap-3 py-3.5 px-6 bg-white hover:bg-neutral-100 text-ink font-mono text-xs uppercase tracking-wider transition-all font-bold border border-white rounded-xl shadow-md cursor-pointer"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
