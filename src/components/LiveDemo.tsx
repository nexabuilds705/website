import React, { useState, useEffect, useRef } from 'react';
import { Bot, User, Send, CheckCheck, Smartphone, Sparkles, MessageSquare, Zap, BadgeAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatMessage {
  id: string;
  sender: 'prospect' | 'agent';
  text: string;
  timestamp: string;
}

const PRESET_PROMPTS = [
  { id: 'need_hvac', label: '🔥 AC Failure Emergency', text: "My AC broke down and it's 95 degrees inside. Can someone come out today? I need an appointment ASAP." },
  { id: 'quote', label: '💰 Service Call Rates', text: "Do you charge an inspection fee or are estimates free? Need a quote for replacement windows." },
  { id: 'weekend', label: '📅 Weekend Availability', text: "Do you have any availability tomorrow (Saturday)? Most offices are closed." },
  { id: 'slow', label: '⚡ Competitor Slow Response', text: "I called three other contractors and none of them called back. Are you guys actually fast?" },
];

export default function LiveDemo() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'agent',
      text: "👋 Welcome to Apex Mechanical Trades. I am your Instant Assistant. Our field crews are currently active on service dispatches, but I am trained to verify live slots, confirm rates, and register an expert technician in under 30 seconds. How may we assist you today?",
      timestamp: 'Just now'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (text: string) => {
    // Add prospect message
    const prospectMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'prospect',
      text,
      timestamp: 'Just now'
    };
    setMessages(prev => [...prev, prospectMsg]);
    setIsTyping(true);

    // Formulate a custom agent reply based on key phrases
    setTimeout(() => {
      let replyText = "I can certainly help you with that! Our automated agent system is pulling up live dispatch coordinates. Let's book an expert technician or representative to handle this. Could you share your name, phone number, and email so we can lock in a priority ticket?";

      const lowTxt = text.toLowerCase();
      if (lowTxt.includes('ac') || lowTxt.includes('broke') || lowTxt.includes('appointment')) {
        replyText = "🚨 AC failures under current temperature parameters are cataloged as Priority 1 Emergency dispatches. I have an active emergency slot with our lead technician between 2:00 PM and 4:00 PM today. Let's lock this in—please share your name, cell number, and email so I can notify the dispatch office.";
      } else if (lowTxt.includes('charge') || lowTxt.includes('cost') || lowTxt.includes('quote') || lowTxt.includes('fee')) {
        replyText = "💵 For repairs and emergency dispatches, we charge a flat $89 service dispatch fee which is 100% waived if we perform the repair work today. For major system replacements, we offer completely free physical estimates. What is your name and business email so I can forward our price catalog?";
      } else if (lowTxt.includes('saturday') || lowTxt.includes('weekend') || lowTxt.includes('tomorrow')) {
        replyText = "📅 Yes, we offer full weekend service dispatch with absolutely zero overtime surcharges. I have a dispatch slot available tomorrow at 9:30 AM. What is the best cell number and name to register under?";
      } else if (lowTxt.includes('competitors') || lowTxt.includes('slow') || lowTxt.includes('fast')) {
        replyText = "⚡ Over 45% of inbound trade service requests hire the provider who responds first. While other firms take up to 24 hours to check general voicemail boxes, I am trained to lock in your booking parameters in 15 seconds. Please provide your name and phone number to verify this speed!";
      }

      const agentReply: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        sender: 'agent',
        text: replyText,
        timestamp: 'Just now'
      };

      setMessages(prev => [...prev, agentReply]);
      setIsTyping(false);
    }, 1100);
  };

  return (
    <section id="live-simulator" className="py-24 bg-[#F4F1EA] border-b border-[#1A1A1A] relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Pitch Side (6 cols) */}
          <div className="lg:col-span-6 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#1A1A1A]/40 text-[#1A1A1A]/70 text-xs font-mono uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-ink" />
              PART IV — INTERACTIVE DEMONSTRATION
            </div>
            
            <h2 className="font-serif text-4xl md:text-5xl font-normal tracking-tight text-ink leading-tight">
              Test Drive a Autonomous Agent Core
            </h2>
            <div className="w-16 h-[1.5px] bg-[#1A1A1A] mb-4"></div>
            
            <p className="font-serif text-base text-ink-muted leading-relaxed italic">
              Our systems are specifically trained on your specific services, custom rate cards, and operational rules. Interact with the active terminal opposite to evaluate live responsiveness.
            </p>

            <div className="space-y-6 pt-2">
              <div className="flex gap-4">
                <div className="p-2 border border-ink text-sm bg-white font-mono h-fit">
                  [01]
                </div>
                <div>
                  <h4 className="font-mono text-xs uppercase tracking-wider font-bold text-ink">Zero-Latency Lead Qualification</h4>
                  <p className="text-xs font-serif text-ink-muted mt-1 leading-relaxed">
                    By immediately engaging hot prospects before they browse competitor indexes, you maximize your lead conversion potential from day one.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="p-2 border border-ink text-sm bg-white font-mono h-fit">
                  [02]
                </div>
                <div>
                  <h4 className="font-mono text-xs uppercase tracking-wider font-bold text-ink">Empathetic Objections Playbook</h4>
                  <p className="text-xs font-serif text-ink-muted mt-1 leading-relaxed">
                    Programmed with premium customer support scripts, our agent handles emergency classifications, logs bookings, and manages pricing questions perfectly.
                  </p>
                </div>
              </div>
            </div>

            {/* Click to test presets */}
            <div className="space-y-4 pt-6 border-t border-[#1A1A1A]/10">
              <span className="block text-xs font-mono uppercase tracking-widest text-ink font-bold">
                [ DEMO INJECTION SYSTEM ]
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PRESET_PROMPTS.map((prompt) => (
                  <button
                    key={prompt.id}
                    id={`preset-${prompt.id}`}
                    onClick={() => {
                      if (!isTyping) {
                        handleSendMessage(prompt.text);
                      }
                    }}
                    disabled={isTyping}
                    className="p-3 text-left border border-[#1A1A1A]/40 bg-white text-xs font-mono uppercase tracking-tight text-ink hover:bg-[#1A1A1A] hover:text-paper hover:border-ink transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {prompt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Ledger Terminal Side (6 cols) */}
          <div className="lg:col-span-6 flex justify-center w-full">
            <div className="w-full max-w-[440px] bg-white border-2 border-[#1A1A1A] flex flex-col justify-between shadow-sm overflow-hidden h-[580px]">
              
              {/* Telemetry Header */}
              <div className="border-b border-[#1A1A1A] bg-[#fbfaf8] px-6 py-3 flex justify-between items-center text-[10px] font-mono text-ink">
                <span className="font-bold">AGENT PORTAL v4.11</span>
                <span className="flex items-center gap-1.5 font-bold">
                  <span className="w-2 h-2 bg-black rounded-full animate-pulse" />
                  ONLINE RECEIVING
                </span>
              </div>

              {/* Chat screen content */}
              <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-white flex flex-col custom-scrollbar">
                
                <div className="text-center py-2">
                  <span className="px-3 py-1 border border-[#1A1A1A]/20 text-[9px] text-ink-muted uppercase tracking-widest font-mono">
                    TRANSACTION DIALOGUE ACTIVE
                  </span>
                </div>

                {messages.map((msg) => {
                  const isAgent = msg.sender === 'agent';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col max-w-[85%] ${isAgent ? 'self-start' : 'self-end items-end'}`}
                    >
                      {/* Sender label */}
                      <span className="text-[8px] font-mono uppercase tracking-widest text-ink-muted mb-1 font-bold">
                        {isAgent ? '[ APEX DISPATCH AGENT ]' : '[ PROSPECT INQUIRY ]'}
                      </span>

                      <div
                        className={`p-4 border text-xs leading-relaxed ${
                          isAgent
                            ? 'bg-[#fbfaf8] border-[#1A1A1A] text-ink font-serif italic'
                            : 'bg-ink border-ink text-paper font-sans'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })}

                {isTyping && (
                  <div className="flex flex-col max-w-[85%] self-start">
                    <span className="text-[8px] font-mono uppercase tracking-widest text-ink-muted mb-1 font-bold">
                      [ AGENT COMPILING ]
                    </span>
                    <div className="p-3 bg-[#fbfaf8] border border-[#1A1A1A]/40 text-ink text-xs font-mono flex items-center gap-1">
                      <span className="animate-pulse">Analyzing dispatch criteria...</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Bottom input area */}
              <div className="p-4 bg-[#fbfaf8] border-t border-[#1A1A1A] flex gap-2 items-center">
                <input
                  type="text"
                  disabled
                  placeholder="Select emergency cues above..."
                  className="flex-1 bg-white text-ink border border-[#1A1A1A]/30 px-3 py-2.5 text-xs font-serif italic focus:outline-none cursor-not-allowed"
                />
                <button
                  type="button"
                  disabled
                  className="p-2.5 bg-ink text-paper border border-ink opacity-40 cursor-not-allowed transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
