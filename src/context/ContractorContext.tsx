
import React, { createContext, useContext, useState } from 'react';
import { Contractor, Job, TimeSlot } from '@/types/contractor';
import { isEqual } from 'date-fns';
import { toast } from 'sonner';

// Mock data for demonstration
const MOCK_CONTRACTOR: Contractor = {
  id: 'C001',
  name: 'John Smith',
  trade: 'Plumber',
  email: 'john.smith@example.com',
  phone: '555-123-4567',
  activeJobs: 2,
};

const MOCK_JOBS: Job[] = [
  {
    id: 'J001',
    title: 'Leaking Pipe',
    description: 'Water leaking from under kitchen sink',
    tenant: 'Alice Johnson',
    address: '123 Main St, Apt 4B',
    urgency: 'high',
    category: 'plumbing',
    status: 'scheduled',
    createdAt: new Date(2025, 4, 20, 10, 30),
    scheduledDate: new Date(2025, 4, 22),
    timeSlot: { start: '10:00', end: '11:00' }
  },
  {
    id: 'J002',
    title: 'Bathroom Faucet Dripping',
    description: 'Continuous dripping from bathroom sink faucet',
    tenant: 'Bob Williams',
    address: '456 Oak Ave, Apt 2A',
    urgency: 'normal',
    category: 'plumbing',
    status: 'pending',
    createdAt: new Date(2025, 4, 19, 14, 15),
    scheduledDate: null,
    timeSlot: { start: '', end: '' }
  },
];

type AvailabilityMap = {
  [date: string]: TimeSlot[];
};

interface ContractorContextType {
  contractor: Contractor;
  jobs: Job[];
  addAvailability: (date: Date, slots: TimeSlot[]) => void;
  getAvailabilityForDate: (date: Date) => TimeSlot[];
  findNextAvailableSlot: (forDate?: Date) => { date: Date; slot: TimeSlot } | null;
  scheduleJob: (jobId: string, date: Date, slot: TimeSlot) => void;
  completeJob: (jobId: string) => void;
}

const ContractorContext = createContext<ContractorContextType | undefined>(undefined);

export const ContractorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contractor, setContractor] = useState<Contractor>(MOCK_CONTRACTOR);
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [availability, setAvailability] = useState<AvailabilityMap>({});
  
  // Helper to format date as a string key
  const dateToKey = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };
  
  // Add or update availability for a date
  const addAvailability = (date: Date, slots: TimeSlot[]) => {
    const dateKey = dateToKey(date);
    setAvailability(prev => ({
      ...prev,
      [dateKey]: slots
    }));
  };
  
  // Get availability for a specific date
  const getAvailabilityForDate = (date: Date): TimeSlot[] => {
    const dateKey = dateToKey(date);
    return availability[dateKey] || [];
  };
  
  // Find the next available time slot
  const findNextAvailableSlot = (forDate?: Date): { date: Date; slot: TimeSlot } | null => {
    const startDate = forDate || new Date();
    
    // Look for slots in the next 14 days
    for (let i = 0; i < 14; i++) {
      const checkDate = new Date(startDate);
      checkDate.setDate(startDate.getDate() + i);
      
      const dateKey = dateToKey(checkDate);
      const slots = availability[dateKey];
      
      if (slots && slots.length > 0) {
        // Find a slot that doesn't conflict with scheduled jobs
        for (const slot of slots) {
          const hasConflict = jobs.some(job => 
            job.scheduledDate && 
            dateToKey(job.scheduledDate) === dateKey && 
            job.timeSlot.start === slot.start
          );
          
          if (!hasConflict) {
            return { date: checkDate, slot };
          }
        }
      }
    }
    
    return null;
  };
  
  // Schedule a job
  const scheduleJob = (jobId: string, date: Date, slot: TimeSlot) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId 
        ? { ...job, scheduledDate: date, timeSlot: slot, status: 'scheduled' as const }
        : job
    ));
    
    // You would typically notify the tenant here
    toast.success(`Job scheduled for ${dateToKey(date)} at ${slot.start}`);
  };
  
  // Mark a job as completed
  const completeJob = (jobId: string) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId 
        ? { ...job, status: 'completed' as const }
        : job
    ));
    
    // Update contractor active jobs count
    setContractor(prev => ({
      ...prev,
      activeJobs: Math.max(0, prev.activeJobs - 1)
    }));
    
    toast.success("Job marked as completed");
  };
  
  return (
    <ContractorContext.Provider value={{
      contractor,
      jobs,
      addAvailability,
      getAvailabilityForDate,
      findNextAvailableSlot,
      scheduleJob,
      completeJob
    }}>
      {children}
    </ContractorContext.Provider>
  );
};

export const useContractorContext = () => {
  const context = useContext(ContractorContext);
  if (context === undefined) {
    throw new Error('useContractorContext must be used within a ContractorProvider');
  }
  return context;
};
