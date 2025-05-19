
import React from 'react';
import { useContractorContext } from '@/context/ContractorContext';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Home, User } from 'lucide-react';

const JobsList = () => {
  const { jobs } = useContractorContext();
  
  if (jobs.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="rounded-full bg-gray-100 p-4 inline-flex mb-4">
          <Home className="h-6 w-6 text-gray-500" />
        </div>
        <h3 className="text-lg font-medium">No Jobs Assigned</h3>
        <p className="text-gray-500 mt-1">
          When you're assigned to a job, it will appear here.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {jobs.map(job => (
        <div key={job.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{job.title}</h3>
                <Badge variant={job.urgency === 'high' ? 'destructive' : 'outline'}>
                  {job.urgency === 'high' ? 'Urgent' : 'Regular'}
                </Badge>
              </div>
              <p className="text-gray-600 mt-1">{job.description}</p>
              
              <div className="mt-3 space-y-1 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{job.tenant}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  <span>{job.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>
                    {job.scheduledDate 
                      ? format(job.scheduledDate, 'MMMM d, yyyy') + ' • ' + job.timeSlot.start + ' - ' + job.timeSlot.end
                      : 'Not scheduled'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              {job.status === 'scheduled' || job.status === 'assigned' ? (
                <Button variant="outline">Mark Complete</Button>
              ) : (
                <Button>Schedule Visit</Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JobsList;
