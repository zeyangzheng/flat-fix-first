
import React, { useState } from 'react';
import { usePropertyManagerContext } from '@/context/PropertyManagerContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, CalendarDays, Clock, ArrowUp, ArrowDown } from "lucide-react";
import { format } from 'date-fns';
import { Issue, SortOption, FilterOption, IssueStatus } from '@/types/property-manager';
import IssueDetails from './IssueDetails';

const IssuesList = () => {
  const { issues, sortIssues, filterIssues } = usePropertyManagerContext();
  
  // State for sorting and filtering
  const [sortOption, setSortOption] = useState<SortOption>({ field: 'date', direction: 'desc' });
  const [filterOptions, setFilterOptions] = useState<FilterOption[]>([]);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  
  // Toggle sort direction
  const toggleSortDirection = () => {
    setSortOption({
      ...sortOption,
      direction: sortOption.direction === 'asc' ? 'desc' : 'asc'
    });
  };
  
  // Change sort field
  const changeSortField = (field: 'date' | 'priority' | 'property' | 'status') => {
    setSortOption({
      field,
      direction: sortOption.field === field ? 
        (sortOption.direction === 'asc' ? 'desc' : 'asc') : 
        'desc'
    });
  };
  
  // Apply status filter
  const applyStatusFilter = (status: string) => {
    setSelectedStatusFilter(status);
    
    if (status === 'all') {
      // Remove any status filters
      setFilterOptions(filterOptions.filter(f => f.field !== 'status'));
    } else {
      // Add or update status filter
      const newFilters = filterOptions.filter(f => f.field !== 'status');
      newFilters.push({ field: 'status', value: status });
      setFilterOptions(newFilters);
    }
  };
  
  // Get displayed issues based on sorting and filtering
  const getDisplayedIssues = () => {
    const filtered = filterOptions.length > 0 ? filterIssues(filterOptions) : issues;
    return sortIssues(sortOption);
  };
  
  // Handle viewing issue details
  const handleViewIssue = (issue: Issue) => {
    setSelectedIssue(issue);
  };
  
  // Handle closing issue details
  const handleCloseIssueDetails = () => {
    setSelectedIssue(null);
  };
  
  // Get badge color based on status
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
  
  const displayedIssues = getDisplayedIssues();
  
  return (
    <div>
      {selectedIssue ? (
        <IssueDetails issue={selectedIssue} onClose={handleCloseIssueDetails} />
      ) : (
        <div>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <h3 className="text-lg font-medium">Reported Issues</h3>
            
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <Select value={selectedStatusFilter} onValueChange={applyStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="acknowledged">Acknowledged</SelectItem>
                    <SelectItem value="assigned">Assigned</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => changeSortField('date')}
                >
                  <CalendarDays className="h-4 w-4" />
                  Date
                  {sortOption.field === 'date' && (
                    sortOption.direction === 'asc' ? 
                      <ArrowUp className="h-3 w-3" /> : 
                      <ArrowDown className="h-3 w-3" />
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => changeSortField('priority')}
                >
                  Priority
                  {sortOption.field === 'priority' && (
                    sortOption.direction === 'asc' ? 
                      <ArrowUp className="h-3 w-3" /> : 
                      <ArrowDown className="h-3 w-3" />
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => changeSortField('status')}
                >
                  Status
                  {sortOption.field === 'status' && (
                    sortOption.direction === 'asc' ? 
                      <ArrowUp className="h-3 w-3" /> : 
                      <ArrowDown className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>
          </div>
          
          {displayedIssues.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No issues matching the current filters
            </div>
          ) : (
            <div className="grid gap-4">
              {displayedIssues.map(issue => (
                <Card key={issue.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{issue.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {issue.address}
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
                  <CardContent>
                    <p className="text-sm text-gray-700 line-clamp-2 mb-3">
                      {issue.description}
                    </p>
                    <div className="flex flex-wrap text-xs text-gray-500 gap-3">
                      <div className="flex items-center">
                        <CalendarDays className="h-3 w-3 mr-1" />
                        Reported: {format(issue.createdAt, 'dd MMM yyyy')}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        Time: {format(issue.createdAt, 'HH:mm')}
                      </div>
                      {issue.scheduledDate && (
                        <div className="flex items-center">
                          <CalendarDays className="h-3 w-3 mr-1" />
                          Scheduled: {format(issue.scheduledDate, 'dd MMM yyyy')} at {issue.timeSlot.start}
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-3 flex justify-between items-center bg-gray-50">
                    <div className="text-sm">
                      Tenant: <span className="font-medium">{issue.tenant}</span>
                    </div>
                    <Button size="sm" onClick={() => handleViewIssue(issue)}>
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default IssuesList;
