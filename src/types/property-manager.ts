
import { Job, TimeSlot } from '@/types/contractor';

export interface Property {
  id: string;
  address: string;
  tenantName: string;
  tenantEmail: string;
  tenantPhone: string;
}

export interface Issue extends Job {
  propertyId: string;
  images?: string[];
  emergencyType?: string;
  emergencyConfirmed?: boolean;
}

export interface PropertyManager {
  id: string;
  name: string;
  email: string;
  phone: string;
  assignedProperties: number;
  activeIssues: number;
}

export type IssueStatus = 'pending' | 'acknowledged' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';

export type IssuePriority = 'urgent' | 'high' | 'normal' | 'low';

export type TradeType = 'plumbing' | 'electrical' | 'hvac' | 'maintenance' | 'general' | 'other';

export interface ContractorAvailability {
  contractorId: string;
  contractorName: string;
  trade: TradeType;
  date: Date;
  slots: TimeSlot[];
}

export interface SortOption {
  field: 'date' | 'priority' | 'property' | 'status';
  direction: 'asc' | 'desc';
}

export interface FilterOption {
  field: 'status' | 'priority' | 'trade' | 'property';
  value: string;
}
