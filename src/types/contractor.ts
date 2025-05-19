
export interface TimeSlot {
  start: string;
  end: string;
}

export interface Contractor {
  id: string;
  name: string;
  trade: string;
  email: string;
  phone: string;
  activeJobs: number;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  tenant: string;
  address: string;
  urgency: 'high' | 'normal' | 'low';
  category: 'plumbing' | 'electrical' | 'hvac' | 'maintenance' | 'other';
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  createdAt: Date;
  scheduledDate: Date | null;
  timeSlot: TimeSlot;
}
