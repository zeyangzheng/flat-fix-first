
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePropertyManagerContext } from '@/context/PropertyManagerContext';
import IssuesList from './IssuesList';
import ContractorAvailability from './ContractorAvailability';

const PropertyManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState<string>('issues');
  const { propertyManager } = usePropertyManagerContext();
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">Welcome, {propertyManager.name}</h3>
            <p className="text-gray-500 mt-1">Managing {propertyManager.assignedProperties} properties</p>
          </div>
          <div className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
            {propertyManager.activeIssues} Active Issues
          </div>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-6 pt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="issues">Issues</TabsTrigger>
            <TabsTrigger value="contractors">Contractor Availability</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="issues" className="p-6">
          <IssuesList />
        </TabsContent>
        
        <TabsContent value="contractors" className="p-6">
          <ContractorAvailability />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PropertyManagerDashboard;
