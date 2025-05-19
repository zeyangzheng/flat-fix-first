
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useContractorContext } from '@/context/ContractorContext';
import { 
  Property, 
  Issue, 
  PropertyManager, 
  IssueStatus, 
  IssuePriority,
  SortOption, 
  FilterOption,
  TradeType,
  ContractorAvailability
} from '@/types/property-manager';
import { Contractor, TimeSlot, Job } from '@/types/contractor';
import { format } from 'date-fns';

// Mock data
const MOCK_PROPERTIES: Property[] = [
  {
    id: 'P001',
    address: '123 Main St, Apt 4B',
    tenantName: 'Alice Johnson',
    tenantEmail: 'alice.johnson@example.com',
    tenantPhone: '020-1234-5678',
  },
  {
    id: 'P002',
    address: '456 Oak Ave, Apt 2A',
    tenantName: 'Bob Williams',
    tenantEmail: 'bob.williams@example.com',
    tenantPhone: '020-8765-4321',
  },
  {
    id: 'P003',
    address: '789 Pine Lane, House 12',
    tenantName: 'Carol Davis',
    tenantEmail: 'carol.davis@example.com',
    tenantPhone: '020-5555-7777',
  },
];

const MOCK_ISSUES: Issue[] = [
  {
    id: 'I001',
    title: 'Leaking Pipe',
    description: 'Water leaking from under kitchen sink',
    tenant: 'Alice Johnson',
    address: '123 Main St, Apt 4B',
    propertyId: 'P001',
    urgency: 'high',
    category: 'plumbing',
    status: 'pending',
    createdAt: new Date(2025, 4, 20, 10, 30),
    scheduledDate: null,
    timeSlot: { start: '', end: '' },
    images: [],
  },
  {
    id: 'I002',
    title: 'Bathroom Faucet Dripping',
    description: 'Continuous dripping from bathroom sink faucet',
    tenant: 'Bob Williams',
    address: '456 Oak Ave, Apt 2A',
    propertyId: 'P002',
    urgency: 'normal',
    category: 'plumbing',
    status: 'acknowledged',
    createdAt: new Date(2025, 4, 19, 14, 15),
    scheduledDate: null,
    timeSlot: { start: '', end: '' },
    images: [],
  },
  {
    id: 'I003',
    title: 'Electrical Outlet Not Working',
    description: 'Bedroom outlet not providing power',
    tenant: 'Carol Davis',
    address: '789 Pine Lane, House 12',
    propertyId: 'P003',
    urgency: 'low',
    category: 'electrical',
    status: 'pending',
    createdAt: new Date(2025, 4, 18, 9, 45),
    scheduledDate: null,
    timeSlot: { start: '', end: '' },
    images: [],
  },
  {
    id: 'I004',
    title: 'Gas Smell in Kitchen',
    description: 'Strong smell of gas near the stove',
    tenant: 'Alice Johnson',
    address: '123 Main St, Apt 4B',
    propertyId: 'P001',
    urgency: 'high',
    category: 'other',
    status: 'assigned',
    createdAt: new Date(2025, 4, 17, 18, 20),
    scheduledDate: new Date(2025, 4, 18),
    timeSlot: { start: '10:00', end: '11:00' },
    emergencyType: 'Gas',
    emergencyConfirmed: true,
    images: [],
  },
];

const MOCK_PROPERTY_MANAGER: PropertyManager = {
  id: 'PM001',
  name: 'Sarah Thompson',
  email: 'sarah.thompson@example.com',
  phone: '020-9999-8888',
  assignedProperties: 5,
  activeIssues: 3,
};

// Interface for our context
interface PropertyManagerContextType {
  propertyManager: PropertyManager;
  properties: Property[];
  issues: Issue[];
  getIssuesByStatus: (status: IssueStatus) => Issue[];
  getIssuesByPriority: (priority: IssuePriority) => Issue[];
  getIssuesByProperty: (propertyId: string) => Issue[];
  getPropertyById: (propertyId: string) => Property | undefined;
  updateIssueStatus: (issueId: string, status: IssueStatus) => void;
  assignContractorToIssue: (issueId: string, contractorId: string, date: Date, timeSlot: TimeSlot) => void;
  sortIssues: (option: SortOption) => Issue[];
  filterIssues: (options: FilterOption[]) => Issue[];
  getAvailableContractors: (date: Date, tradeType?: TradeType) => ContractorAvailability[];
  acknowledgeIssue: (issueId: string) => void;
  markIssueInProgress: (issueId: string) => void;
  markIssueCompleted: (issueId: string) => void;
  reassignIssue: (issueId: string, contractorId: string, date: Date, timeSlot: TimeSlot) => void;
}

// Create the context
const PropertyManagerContext = createContext<PropertyManagerContextType | undefined>(undefined);

// Provider component
export const PropertyManagerProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [propertyManager, setPropertyManager] = useState<PropertyManager>(MOCK_PROPERTY_MANAGER);
  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);
  const [issues, setIssues] = useState<Issue[]>(MOCK_ISSUES);
  
  // Access contractor context to get availability data
  const contractorContext = useContractorContext();
  
  // Filter issues by status
  const getIssuesByStatus = (status: IssueStatus): Issue[] => {
    return issues.filter(issue => issue.status === status);
  };
  
  // Filter issues by priority
  const getIssuesByPriority = (priority: IssuePriority): Issue[] => {
    return issues.filter(issue => issue.urgency === priority);
  };
  
  // Filter issues by property
  const getIssuesByProperty = (propertyId: string): Issue[] => {
    return issues.filter(issue => issue.propertyId === propertyId);
  };
  
  // Get property by ID
  const getPropertyById = (propertyId: string): Property | undefined => {
    return properties.find(property => property.id === propertyId);
  };
  
  // Update issue status
  const updateIssueStatus = (issueId: string, status: IssueStatus): void => {
    setIssues(prevIssues => 
      prevIssues.map(issue => 
        issue.id === issueId ? { ...issue, status } : issue
      )
    );
    
    toast.success(`Issue status updated to ${status}`);
  };
  
  // Acknowledge issue (first step in workflow)
  const acknowledgeIssue = (issueId: string): void => {
    updateIssueStatus(issueId, 'acknowledged');
  };
  
  // Mark issue as in progress
  const markIssueInProgress = (issueId: string): void => {
    updateIssueStatus(issueId, 'in_progress');
  };
  
  // Mark issue as completed
  const markIssueCompleted = (issueId: string): void => {
    updateIssueStatus(issueId, 'completed');
    
    // Update property manager's active issues count
    setPropertyManager(prev => ({
      ...prev,
      activeIssues: Math.max(0, prev.activeIssues - 1)
    }));
  };
  
  // Assign contractor to issue
  const assignContractorToIssue = (
    issueId: string, 
    contractorId: string, 
    date: Date, 
    timeSlot: TimeSlot
  ): void => {
    // Update the issue with contractor assignment
    setIssues(prevIssues => 
      prevIssues.map(issue => 
        issue.id === issueId 
          ? { 
              ...issue, 
              status: 'assigned', 
              scheduledDate: date,
              timeSlot
            } 
          : issue
      )
    );
    
    // You would notify the contractor here in a real app
    toast.success(`Contractor assigned to issue. Scheduled for ${format(date, 'MMMM d, yyyy')} at ${timeSlot.start}`);
    
    // You would notify the tenant here in a real app
    const issue = issues.find(i => i.id === issueId);
    if (issue) {
      toast.info(`Tenant ${issue.tenant} has been notified of the scheduled repair`);
    }
  };
  
  // Reassign issue to different contractor
  const reassignIssue = (
    issueId: string, 
    contractorId: string, 
    date: Date, 
    timeSlot: TimeSlot
  ): void => {
    assignContractorToIssue(issueId, contractorId, date, timeSlot);
    toast.info("Issue has been reassigned to a different contractor");
  };
  
  // Sort issues based on sort option
  const sortIssues = (option: SortOption): Issue[] => {
    const { field, direction } = option;
    
    return [...issues].sort((a, b) => {
      let comparison = 0;
      
      switch (field) {
        case 'date':
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
        case 'priority':
          const priorityMap: Record<string, number> = { 'urgent': 0, 'high': 1, 'normal': 2, 'low': 3 };
          comparison = priorityMap[a.urgency] - priorityMap[b.urgency];
          break;
        case 'property':
          comparison = a.propertyId.localeCompare(b.propertyId);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }
      
      return direction === 'asc' ? comparison : -comparison;
    });
  };
  
  // Filter issues
  const filterIssues = (options: FilterOption[]): Issue[] => {
    if (options.length === 0) return issues;
    
    return issues.filter(issue => {
      return options.every(option => {
        switch (option.field) {
          case 'status':
            return issue.status === option.value;
          case 'priority':
            return issue.urgency === option.value;
          case 'trade':
            return issue.category === option.value;
          case 'property':
            return issue.propertyId === option.value;
          default:
            return true;
        }
      });
    });
  };
  
  // Get available contractors based on date and trade type
  const getAvailableContractors = (date: Date, tradeType?: TradeType): ContractorAvailability[] => {
    // In a real app, this would query the contractor availability from the database
    // For now, we'll use the contractor context's methods
    
    // Convert date to ISO string for date comparison
    const dateKey = date.toISOString().split('T')[0];
    
    // Get all available contractors for the selected date
    const availabilities: ContractorAvailability[] = [];
    
    // This is a simplified example. In a real app, you would query this from a database
    if (contractorContext && contractorContext.contractor) {
      const slots = contractorContext.getAvailabilityForDate(date);
      
      if (slots.length > 0) {
        availabilities.push({
          contractorId: contractorContext.contractor.id,
          contractorName: contractorContext.contractor.name,
          trade: contractorContext.contractor.trade as TradeType,
          date: date,
          slots: slots
        });
      }
    }
    
    // Filter by trade type if specified
    if (tradeType) {
      return availabilities.filter(avail => avail.trade === tradeType);
    }
    
    return availabilities;
  };
  
  // The context value
  const contextValue: PropertyManagerContextType = {
    propertyManager,
    properties,
    issues,
    getIssuesByStatus,
    getIssuesByPriority,
    getIssuesByProperty,
    getPropertyById,
    updateIssueStatus,
    assignContractorToIssue,
    sortIssues,
    filterIssues,
    getAvailableContractors,
    acknowledgeIssue,
    markIssueInProgress,
    markIssueCompleted,
    reassignIssue
  };
  
  return (
    <PropertyManagerContext.Provider value={contextValue}>
      {children}
    </PropertyManagerContext.Provider>
  );
};

// Custom hook to use the property manager context
export const usePropertyManagerContext = () => {
  const context = useContext(PropertyManagerContext);
  if (context === undefined) {
    throw new Error('usePropertyManagerContext must be used within a PropertyManagerProvider');
  }
  return context;
};
