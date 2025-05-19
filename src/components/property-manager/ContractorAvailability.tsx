
import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { usePropertyManagerContext } from '@/context/PropertyManagerContext';
import { TradeType, ContractorAvailability as ContractorAvailabilityType } from '@/types/property-manager';
import { format } from 'date-fns';
import { CalendarDays, Filter } from 'lucide-react';

const ContractorAvailability = () => {
  const { getAvailableContractors } = usePropertyManagerContext();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTradeType, setSelectedTradeType] = useState<TradeType | 'all'>('all');
  
  // Get available contractors
  const availableContractors = selectedDate 
    ? getAvailableContractors(
        selectedDate, 
        selectedTradeType === 'all' ? undefined : selectedTradeType as TradeType
      )
    : [];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <h3 className="text-lg font-medium mb-4">Select Date</h3>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="border rounded-md shadow-sm p-3"
          />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-medium mb-4">
            {selectedDate ? `Availability for ${format(selectedDate, 'MMMM d, yyyy')}` : 'Select a date'}
          </h3>
          
          <div className="mb-4 flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <Select value={selectedTradeType} onValueChange={(value) => setSelectedTradeType(value as TradeType | 'all')}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by trade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Trades</SelectItem>
                <SelectItem value="plumbing">Plumbing</SelectItem>
                <SelectItem value="electrical">Electrical</SelectItem>
                <SelectItem value="hvac">HVAC</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {availableContractors.length === 0 ? (
            <div className="text-center p-8 border rounded-md bg-gray-50">
              <CalendarDays className="mx-auto h-12 w-12 text-gray-400 mb-2" />
              <h4 className="text-lg font-medium text-gray-600 mb-1">No Availability Found</h4>
              <p className="text-gray-500 text-sm">
                No contractors are available for the selected date and filters.
              </p>
            </div>
          ) : (
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contractor</TableHead>
                    <TableHead>Trade</TableHead>
                    <TableHead>Available Slots</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {availableContractors.map((contractor) => (
                    <TableRow key={contractor.contractorId}>
                      <TableCell className="font-medium">{contractor.contractorName}</TableCell>
                      <TableCell>{contractor.trade}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {contractor.slots.map((slot, idx) => (
                            <span key={idx} className="px-2 py-1 text-xs bg-primary/10 text-primary rounded">
                              {slot.start} - {slot.end}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractorAvailability;
