
import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useContractorContext } from '@/context/ContractorContext';
import { TimeSlot } from '@/types/contractor';
import AvailabilityTimeSlots from './AvailabilityTimeSlots';
import { format } from 'date-fns';
import { toast } from 'sonner';

const AvailabilityCalendar = () => {
  const { addAvailability, getAvailabilityForDate } = useContractorContext();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  
  // Handle date selection
  const handleSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      // Get existing availability for the selected date
      const existingSlots = getAvailabilityForDate(date);
      setAvailableTimeSlots(existingSlots);
    }
  };
  
  // Save availability
  const handleSaveAvailability = () => {
    if (selectedDate && availableTimeSlots.length > 0) {
      addAvailability(selectedDate, availableTimeSlots);
      toast.success("Availability saved successfully");
    } else {
      toast.error("Please select at least one time slot");
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <h3 className="text-lg font-medium mb-4">Select Date</h3>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            className="border rounded-md shadow-sm"
          />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-medium mb-4">
            {selectedDate ? `Availability for ${format(selectedDate, 'MMMM d, yyyy')}` : 'Select a date'}
          </h3>
          
          <AvailabilityTimeSlots 
            selectedTimeSlots={availableTimeSlots}
            onSlotsChange={setAvailableTimeSlots}
          />
          
          <div className="mt-4 flex justify-end">
            <Button onClick={handleSaveAvailability}>
              Save Availability
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
