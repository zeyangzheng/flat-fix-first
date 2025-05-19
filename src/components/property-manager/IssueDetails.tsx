
import React, { useState } from 'react';
import { 
  Issue, 
  TradeType, 
  IssueStatus, 
  ContractorAvailability 
} from '@/types/property-manager';
import { TimeSlot } from '@/types/contractor';
import { usePropertyManagerContext } from '@/context/PropertyManagerContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle,
  Clock,
  PhoneCall,
  User,
  Check,
  CircleX,
  CircleDot,
  RotateCw
} from "lucide-react";
import { format } from 'date-fns';
import { toast } from 'sonner';

interface IssueDetailsProps {
  issue: Issue;
  onClose: () => void;
}

const IssueDetails = ({ issue, onClose }: IssueDetailsProps) => {
  const { 
    getPropertyById,
    updateIssueStatus,
    getAvailableContractors,
    assignContractorToIssue,
    acknowledgeIssue,
    markIssueInProgress,
    markIssueCompleted,
    reassignIssue
  } = usePropertyManagerContext();
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(issue.scheduledDate || new Date());
  const [selectedTrade, setSelectedTrade] = useState<TradeType>(issue.category as TradeType);
  const [selectedContractorId, setSelectedContractorId] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot>({ start: '', end: '' });
  const [showAssignmentForm, setShowAssignmentForm] = useState<boolean>(false);
  
  // Get property details
  const property = getPropertyById(issue.propertyId);
  
  // Get available contractors
  const availableContractors = selectedDate 
    ? getAvailableContractors(selectedDate, selectedTrade)
    : [];
  
  // Get available time slots for selected contractor
  const getAvailableTimeSlots = (): TimeSlot[] => {
    if (!selectedContractorId || !selectedDate) return [];
    
    const contractor = availableContractors.find(c => c.contractorId === selectedContractorId);
    return contractor ? contractor.slots : [];
  };
  
  // Handle acknowledge
  const handleAcknowledge = () => {
    acknowledgeIssue(issue.id);
    onClose();
  };
  
  // Handle mark as in progress
  const handleMarkInProgress = () => {
    markIssueInProgress(issue.id);
    onClose();
  };
  
  // Handle mark as completed
  const handleMarkCompleted = () => {
    markIssueCompleted(issue.id);
    onClose();
  };
  
  // Handle assign contractor
  const handleAssignContractor = () => {
    if (!selectedContractorId || !selectedDate || !selectedTimeSlot.start) {
      toast.error("Please select a contractor, date, and time slot");
      return;
    }
    
    if (issue.status === 'assigned' || issue.status === 'in_progress') {
      // Reassign if already assigned
      reassignIssue(issue.id, selectedContractorId, selectedDate, selectedTimeSlot);
    } else {
      // New assignment
      assignContractorToIssue(issue.id, selectedContractorId, selectedDate, selectedTimeSlot);
    }
    
    setShowAssignmentForm(false);
    onClose();
  };
  
  // Get status badge color
  const getStatusBadgeColor = (status: IssueStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'acknowledged':
        return 'bg-blue-100 text-blue-800';
      case 'assigned':
        return 'bg-purple-100 text-purple-800';
      case 'in_progress':
        return 'bg-orange-100 text-orange-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get urgency badge color
  const getUrgencyBadgeColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'normal':
        return 'bg-blue-100 text-blue-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div>
      <div className="mb-4">
        <Button variant="ghost" onClick={onClose} className="flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back to Issues List
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{issue.title}</CardTitle>
              <CardDescription className="mt-1">
                Issue ID: {issue.id}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge className={getUrgencyBadgeColor(issue.urgency)}>
                {issue.urgency.charAt(0).toUpperCase() + issue.urgency.slice(1)}
              </Badge>
              <Badge className={getStatusBadgeColor(issue.status)}>
                {issue.status.charAt(0).toUpperCase() + issue.status.slice(1).replace('_', ' ')}
              </Badge>
              {issue.emergencyType && (
                <Badge variant="destructive">
                  Emergency: {issue.emergencyType}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div>
            <h4 className="text-sm font-medium mb-2">Description</h4>
            <p className="text-sm">{issue.description}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Property Details</h4>
              <div className="text-sm">
                <p className="mb-1">{issue.address}</p>
                {property && (
                  <>
                    <p className="mb-1">Property ID: {property.id}</p>
                  </>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Tenant Details</h4>
              <div className="text-sm space-y-1">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  {issue.tenant}
                </div>
                {property && (
                  <>
                    <div className="flex items-center">
                      <PhoneCall className="h-4 w-4 mr-2" />
                      {property.tenantPhone}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Issue Details</h4>
              <div className="text-sm space-y-1">
                <div className="flex items-center">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  Reported: {format(issue.createdAt, 'PPP')}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Time: {format(issue.createdAt, 'p')}
                </div>
                <div className="flex items-center">
                  <CircleDot className="h-4 w-4 mr-2" />
                  Category: {issue.category.charAt(0).toUpperCase() + issue.category.slice(1)}
                </div>
              </div>
            </div>
            
            {issue.scheduledDate && (
              <div>
                <h4 className="text-sm font-medium mb-2">Scheduled Repair</h4>
                <div className="text-sm space-y-1">
                  <div className="flex items-center">
                    <CalendarDays className="h-4 w-4 mr-2" />
                    Date: {format(issue.scheduledDate, 'PPP')}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Time: {issue.timeSlot.start} - {issue.timeSlot.end}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Image Gallery - Placeholder for now, would be implemented with real images */}
          {issue.images && issue.images.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Images</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {issue.images.map((image, index) => (
                  <div key={index} className="bg-gray-100 h-24 rounded flex items-center justify-center">
                    {/* In a real app, you would display the actual image */}
                    <span className="text-xs text-gray-500">Image {index + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Contractor Assignment Form */}
          {showAssignmentForm && (
            <div className="border rounded-md p-4 bg-gray-50 mt-4">
              <h4 className="font-medium mb-3">Assign Contractor</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Trade Type</label>
                  <Select 
                    value={selectedTrade} 
                    onValueChange={(value) => setSelectedTrade(value as TradeType)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select trade type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="plumbing">Plumbing</SelectItem>
                      <SelectItem value="electrical">Electrical</SelectItem>
                      <SelectItem value="hvac">HVAC</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-2">Select Date</label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="border rounded-md p-3"
                    disabled={(date) => date < new Date()}
                  />
                </div>
                
                {selectedDate && (
                  <div>
                    <label className="text-sm font-medium">Available Contractors</label>
                    {availableContractors.length === 0 ? (
                      <div className="text-sm text-orange-600 mt-1">
                        No contractors available for selected date and trade
                      </div>
                    ) : (
                      <Select 
                        value={selectedContractorId} 
                        onValueChange={setSelectedContractorId}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select contractor" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableContractors.map(contractor => (
                            <SelectItem key={contractor.contractorId} value={contractor.contractorId}>
                              {contractor.contractorName} ({contractor.trade})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                )}
                
                {selectedContractorId && (
                  <div>
                    <label className="text-sm font-medium">Available Time Slots</label>
                    {getAvailableTimeSlots().length === 0 ? (
                      <div className="text-sm text-orange-600 mt-1">
                        No time slots available for selected contractor
                      </div>
                    ) : (
                      <Select 
                        value={selectedTimeSlot ? `${selectedTimeSlot.start}-${selectedTimeSlot.end}` : ''} 
                        onValueChange={(value) => {
                          const [start, end] = value.split('-');
                          setSelectedTimeSlot({ start, end });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select time slot" />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableTimeSlots().map((slot, index) => (
                            <SelectItem key={index} value={`${slot.start}-${slot.end}`}>
                              {slot.start} - {slot.end}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                )}
                
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setShowAssignmentForm(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAssignContractor}
                    disabled={!selectedContractorId || !selectedTimeSlot.start}
                  >
                    {issue.status === 'assigned' || issue.status === 'in_progress' ? 'Reassign' : 'Assign Contractor'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="border-t pt-4 flex flex-wrap justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            {issue.status === 'pending' && (
              <Button 
                variant="outline" 
                className="flex items-center gap-2" 
                onClick={handleAcknowledge}
              >
                <Check className="h-4 w-4" />
                Acknowledge
              </Button>
            )}
            
            {issue.status === 'acknowledged' && !showAssignmentForm && (
              <Button 
                variant="outline" 
                className="flex items-center gap-2" 
                onClick={() => setShowAssignmentForm(true)}
              >
                <User className="h-4 w-4" />
                Assign Contractor
              </Button>
            )}
            
            {(issue.status === 'assigned' || issue.status === 'in_progress') && !showAssignmentForm && (
              <Button 
                variant="outline" 
                className="flex items-center gap-2" 
                onClick={() => setShowAssignmentForm(true)}
              >
                <RotateCw className="h-4 w-4" />
                Reassign
              </Button>
            )}
            
            {issue.status === 'assigned' && (
              <Button 
                variant="outline" 
                className="flex items-center gap-2" 
                onClick={handleMarkInProgress}
              >
                <CircleDot className="h-4 w-4" />
                Mark In Progress
              </Button>
            )}
            
            {issue.status === 'in_progress' && (
              <Button 
                variant="outline" 
                className="flex items-center gap-2" 
                onClick={handleMarkCompleted}
              >
                <CheckCircle className="h-4 w-4" />
                Mark Completed
              </Button>
            )}
          </div>
          
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default IssueDetails;
