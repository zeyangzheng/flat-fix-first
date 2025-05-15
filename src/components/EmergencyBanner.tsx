
import React, { useState } from 'react';
import { AlertCircle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmergencyBannerProps {
  emergencyType: string;
  emergencyNumber: string;
  onConfirmed: () => void;
}

const EmergencyBanner = ({ emergencyType, emergencyNumber, onConfirmed }: EmergencyBannerProps) => {
  const [called, setCalled] = useState(false);
  
  const handleConfirmCall = () => {
    setCalled(true);
    onConfirmed();
  };

  return (
    <div className="emergency-banner">
      <div className="flex items-start mb-4">
        <AlertCircle className="h-6 w-6 mr-2 flex-shrink-0" />
        <div>
          <h3 className="font-bold text-lg">Emergency: {emergencyType}</h3>
          <p className="mb-2">
            This is an urgent issue that requires immediate attention for your safety.
          </p>
          <p className="font-bold">
            Please call emergency number: <a href={`tel:${emergencyNumber}`} className="underline">{emergencyNumber}</a>
          </p>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleConfirmCall}
          className="flex items-center gap-2"
          variant={called ? "outline" : "secondary"}
        >
          {called && <Check className="h-4 w-4" />}
          {called ? "Emergency call confirmed" : "I've called the emergency number"}
        </Button>
      </div>
    </div>
  );
};

export default EmergencyBanner;
