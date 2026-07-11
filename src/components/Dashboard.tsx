import React, { useState, useEffect } from 'react';
import { Database, Download, Trash2, Calendar, Phone, Mail, User, PlusCircle, Check, Search, Tag } from 'lucide-react';
import { LeadSubmission } from '../types';

interface DashboardProps {
  submissionsUpdatedToggle: boolean;
}

export default function Dashboard({ submissionsUpdatedToggle }: DashboardProps) {
  const [submissions, setSubmissions] = useState<LeadSubmission[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  // Load submissions from localstorage
  const loadSubmissions = () => {
    try {
      const existing = localStorage.getItem('lead_submissions');
      if (existing) {
        setSubmissions(JSON.parse(existing));
      } else {
        // Seed with a few realistic mock bookings for demonstration purposes
        const mockSubmissions: LeadSubmission[] = [
          {
            id: 'lead_mock_1',
            name: 'Marcus Vance',
            email: 'marcus@vanceplumbing.com',
            phone: '2025550143',
            services: ['hvac'],
            preferredDate: '2026-07-15',
            preferredTime: '10:00 AM',
            staffingProblem: true,
            inboundVolume: 'high',
            notes: 'We are currently running Google Local Services ads but miss half the calls during our busy plumbing hours.',
            bookedAt: new Date(Date.now() - 3600000 * 4).toISOString()
          },
          {
            id: 'lead_mock_2',
            name: 'Sarah Jenkins',
            email: 's.jenkins@jenkinslawyers.net',
            phone: '3125550189',
            services: ['legal'],
            preferredDate: '2026-07-17',
            preferredTime: '02:30 PM',
            staffingProblem: false,
            inboundVolume: 'medium',
            notes: 'Need standard lead agent qualifying flow to screen cases before booking consultations.',
            bookedAt: new Date(Date.now() - 3600000 * 20).toISOString()
          }
        ];
        localStorage.setItem('lead_submissions', JSON.stringify(mockSubmissions));
        setSubmissions(mockSubmissions);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, [submissionsUpdatedToggle]);

  const handleDelete = (id: string) => {
    const updated = submissions.filter(s => s.id !== id);
    localStorage.setItem('lead_submissions', JSON.stringify(updated));
    setSubmissions(updated);
    setStatusMsg('Lead record deleted successfully.');
    setTimeout(() => setStatusMsg(''), 3000);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all leads?')) {
      localStorage.removeItem('lead_submissions');
      setSubmissions([]);
      setStatusMsg('All records cleared.');
      setTimeout(() => setStatusMsg(''), 3000);
    }
  };

  const handleAddMockLead = () => {
    const names = ['Ethan Brooks', 'Clara Henderson', 'Vikram Patel', 'Danielle Moreau'];
    const domains = ['brooksroofing.com', 'claramedical.org', 'patelconsulting.co', 'moreaudesign.ca'];
    const serviceIds = ['general', 'healthcare', 'it', 'electrical'];
    const notesList = [
      'Need SMS auto-reply setup for weekend roofing inquiries.',
      'Staff too busy with active operations. Greet and book new appointments.',
      'We get 250 leads monthly, response is usually next business day. Help!',
      'Looking to bundle a new high-end React marketing site + custom GPT chatbot.'
    ];

    const idx = Math.floor(Math.random() * names.length);
    const mockLead: LeadSubmission = {
      id: `lead_sim_${Date.now()}`,
      name: names[idx],
      email: `contact@${domains[idx]}`,
      phone: `8005550${Math.floor(100 + Math.random() * 899)}`,
      services: [serviceIds[Math.floor(Math.random() * serviceIds.length)]],
      preferredDate: '2026-07-20',
      preferredTime: '11:00 AM',
      staffingProblem: Math.random() > 0.4,
      inboundVolume: 'medium',
      notes: notesList[idx],
      bookedAt: new Date().toISOString()
    };

    const updated = [...submissions, mockLead];
    localStorage.setItem('lead_submissions', JSON.stringify(updated));
    setSubmissions(updated);
    setStatusMsg('Mock lead injected into CRM state.');
    setTimeout(() => setStatusMsg(''), 3000);
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(submissions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `lead_agent_agency_CRM_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setStatusMsg('Export file generated.');
    setTimeout(() => setStatusMsg(''), 3000);
  };

  const filtered = submissions.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.phone.includes(searchQuery)
  );

  return (
    <div className="bg-white border-2 border-ink p-8 text-ink space-y-8 rounded-none shadow-sm">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-ink/20 pb-6">
        <div>
          <div className="flex items-center gap-2 text-ink/70 font-mono text-xs font-bold uppercase tracking-widest mb-1.5">
            <Database className="w-3.5 h-3.5" />
            PART V — CENTRAL TELEMETRY DATABASE
          </div>
          <h3 className="font-serif text-2xl font-bold">Inbound Dispatch Directory</h3>
          <p className="text-ink-muted text-xs font-serif italic mt-1 leading-relaxed">
            Verify real-time booking logs and qualifying indicators. Double-click simulation elements to check dispatch configurations.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            id="btn-crm-mock"
            onClick={handleAddMockLead}
            className="inline-flex items-center gap-1.5 py-2 px-4 border border-[#1A1A1A]/40 bg-[#F4F1EA] hover:bg-ink hover:text-paper hover:border-ink text-xs font-mono font-bold uppercase tracking-wider transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            SIMULATE LEAD
          </button>
          
          <button
            type="button"
            id="btn-crm-export"
            disabled={submissions.length === 0}
            onClick={handleExportJSON}
            className="inline-flex items-center gap-1.5 py-2 px-4 bg-ink hover:bg-neutral-800 text-paper text-xs font-mono font-bold uppercase tracking-wider transition-all border border-ink disabled:opacity-35 disabled:cursor-not-allowed"
          >
            <Download className="w-3.5 h-3.5" />
            EXPORT CRM
          </button>

          <button
            type="button"
            id="btn-crm-clear"
            disabled={submissions.length === 0}
            onClick={handleClearAll}
            className="inline-flex items-center gap-1.5 py-2 px-4 border border-red-800 text-red-950 hover:bg-red-900 hover:text-paper text-xs font-mono font-bold uppercase tracking-wider transition-all disabled:opacity-35 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-3.5 h-3.5" />
            CLEAR CRM
          </button>
        </div>
      </div>

      {statusMsg && (
        <div className="p-4 bg-[#fbfaf8] border border-ink text-ink text-xs font-mono uppercase tracking-wider flex items-center gap-2.5">
          <Check className="w-4 h-4 text-ink" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Stats counter */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#fbfaf8] border border-ink/30 p-5 rounded-none">
          <span className="text-[9px] text-ink-muted font-mono font-bold block uppercase tracking-widest">[ Captured Leads ]</span>
          <span className="text-3xl font-serif font-bold mt-1.5 block text-ink">{submissions.length}</span>
        </div>
        <div className="bg-[#fbfaf8] border border-ink/30 p-5 rounded-none">
          <span className="text-[9px] text-ink-muted font-mono font-bold block uppercase tracking-widest">[ Staff Pain Cases ]</span>
          <span className="text-3xl font-serif font-bold mt-1.5 block text-ink">
            {submissions.filter(s => s.staffingProblem).length}
          </span>
        </div>
        <div className="bg-[#fbfaf8] border border-ink/30 p-5 rounded-none">
          <span className="text-[9px] text-ink-muted font-mono font-bold block uppercase tracking-widest">[ Covered Niches ]</span>
          <span className="text-3xl font-serif font-bold mt-1.5 block text-ink">
            {Array.from(new Set(submissions.flatMap(s => s.services))).length}
          </span>
        </div>
        <div className="bg-[#fbfaf8] border border-ink/30 p-5 rounded-none">
          <span className="text-[9px] text-ink-muted font-mono font-bold block uppercase tracking-widest">[ System State ]</span>
          <span className="text-xs font-mono font-bold text-ink mt-3 block flex items-center gap-1">
            <span className="w-2.5 h-2.5 bg-black rounded-full animate-pulse inline-block" />
            MONITORED
          </span>
        </div>
      </div>

      {/* Filter and search bar */}
      <div className="relative">
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-muted/55">
          <Search className="w-4 h-4" />
        </span>
        <input
          type="text"
          id="crm-search"
          placeholder="Filter dispatch logs by name, email, phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-[#fbfaf8] border border-ink text-ink placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-ink focus:bg-white text-xs font-mono uppercase tracking-wider rounded-none"
        />
      </div>

      {/* Table & List View */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-[#fbfaf8] border border-dashed border-ink/30 text-ink-muted text-xs font-serif italic">
          No records matching active search filters. Use simulated triggers above to seed.
        </div>
      ) : (
        <div className="space-y-4 max-h-[440px] overflow-y-auto pr-2 custom-scrollbar">
          {filtered.map((lead) => (
            <div
              key={lead.id}
              className="p-5 border border-ink/60 bg-white hover:border-ink transition-all flex flex-col md:flex-row md:items-start justify-between gap-4"
            >
              <div className="space-y-3.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-serif text-base font-bold text-ink flex items-center gap-1.5">
                    <User className="w-4 h-4 text-ink flex-shrink-0" />
                    {lead.name}
                  </span>
                  
                  {lead.staffingProblem && (
                    <span className="px-2 py-0.5 bg-red-50 border border-red-200 text-red-950 text-[8px] font-mono font-bold uppercase tracking-widest">
                      🚨 STAFF SHORTAGE
                    </span>
                  )}

                  <span className="px-2 py-0.5 bg-neutral-100 border border-neutral-300 text-ink text-[8px] font-mono font-bold uppercase tracking-widest">
                    {lead.inboundVolume} vol
                  </span>
                </div>

                <div className="grid sm:grid-cols-3 gap-3 text-xs font-mono text-ink-muted uppercase tracking-tight">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-ink-muted" />
                    {lead.email}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-ink-muted" />
                    {lead.phone}
                  </span>
                  <span className="flex items-center gap-1.5 text-ink font-bold">
                    <Calendar className="w-3.5 h-3.5 text-ink" />
                    {lead.preferredDate} @ {lead.preferredTime}
                  </span>
                </div>

                {lead.services.length > 0 && (
                  <div className="flex flex-wrap gap-1 items-center">
                    <Tag className="w-3 h-3 text-ink-muted mr-1.5" />
                    {lead.services.map((s) => (
                      <span key={s} className="px-2 py-0.5 border border-ink/20 text-[9px] font-mono text-ink-muted uppercase">
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                {lead.notes && (
                  <div className="p-3 bg-[#fbfaf8] border border-ink/20 text-ink-muted text-xs font-serif leading-relaxed italic">
                    <strong>Particulars:</strong> &ldquo;{lead.notes}&rdquo;
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 self-end md:self-start flex-shrink-0">
                <span className="text-[9px] text-ink-muted font-mono font-bold">
                  {new Date(lead.bookedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <button
                  type="button"
                  id={`btn-del-lead-${lead.id}`}
                  onClick={() => handleDelete(lead.id)}
                  className="p-1.5 border border-transparent hover:border-ink hover:bg-neutral-100 text-ink-muted hover:text-ink transition-all"
                  title="Remove record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
