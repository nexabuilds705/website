export interface LeadSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  services: string[];
  preferredDate: string; // YYYY-MM-DD
  preferredTime: string; // e.g. "10:00 AM"
  staffingProblem: boolean;
  inboundVolume: 'low' | 'medium' | 'high' | 'critical';
  notes?: string;
  crm?: string;
  leadScoring?: string;
  bookedAt: string; // ISO timestamp
}
