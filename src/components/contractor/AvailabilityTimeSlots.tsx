
import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TimeSlot } from '@/types/contractor';

// Time slots from 8 AM to 6 PM
const TIME_SLOTS: string[] = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
];

interface AvailabilityTimeSlotsProps {
  selectedTimeSlots: TimeSlot[];
  onSlotsChange: (slots: TimeSlot[]) => void;
}

const AvailabilityTimeSlots = ({ selectedTimeSlots, onSlotsChange }: AvailabilityTimeSlotsProps) => {
  
  const toggleTimeSlot = (start: string) => {
    const end = getEndTime(start);
    const timeSlot = { start, end };
    
    // Check if time slot is already selected
    const isSelected = selectedTimeSlots.some(slot => slot.start === start);
    
    if (isSelected) {
      // Remove time slot
      const updatedSlots = selectedTimeSlots.filter(slot => slot.start !== start);
      onSlotsChange(updatedSlots);
    } else {
      // Add time slot
      onSlotsChange([...selectedTimeSlots, timeSlot]);
    }
  };
  
  const getEndTime = (start: string): string => {
    const [hours] = start.split(':');
    const endHour = parseInt(hours) + 1;
    return `${endHour.toString().padStart(2, '0')}:00`;
  };
  
  const isTimeSlotSelected = (start: string): boolean => {
    return selectedTimeSlots.some(slot => slot.start === start);
  };
  
  return (
    <div className="border rounded-md p-4 space-y-2 max-h-80 overflow-y-auto">
      {TIME_SLOTS.map((time, index) => (
        index < TIME_SLOTS.length - 1 && (
          <div 
            key={time}
            onClick={() => toggleTimeSlot(time)}
            className={cn(
              "flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors",
              isTimeSlotSelected(time) 
                ? "bg-primary/10 hover:bg-primary/20" 
                : "hover:bg-gray-50"
            )}
          >
            <span>{time} - {getEndTime(time)}</span>
            {isTimeSlotSelected(time) ? (
              <CheckCircle className="h-5 w-5 text-primary" />
            ) : (
              <Circle className="h-5 w-5 text-gray-300" />
            )}
          </div>
        )
      ))}
      
      {selectedTimeSlots.length === 0 && (
        <p className="text-gray-500 text-center py-2">
          No time slots selected. Click to add availability.
        </p>
      )}
    </div>
  );
};

export default AvailabilityTimeSlots;
