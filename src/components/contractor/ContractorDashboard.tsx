
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AvailabilityCalendar from './AvailabilityCalendar';
import JobsList from './JobsList';
import { useContractorContext } from '@/context/ContractorContext';

const ContractorDashboard = () => {
  const [activeTab, setActiveTab] = useState<string>('calendar');
  const { contractor } = useContractorContext();
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">Welcome, {contractor?.name || 'Contractor'}</h3>
            <p className="text-gray-500 mt-1">Trade: {contractor?.trade || 'General'}</p>
          </div>
          <div className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
            {contractor?.activeJobs || 0} Active Jobs
          </div>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-6 pt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calendar">Availability</TabsTrigger>
            <TabsTrigger value="jobs">Assigned Jobs</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="calendar" className="p-6">
          <AvailabilityCalendar />
        </TabsContent>
        
        <TabsContent value="jobs" className="p-6">
          <JobsList />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContractorDashboard;
