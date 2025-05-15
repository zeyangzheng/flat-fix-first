
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Download } from 'lucide-react';

interface TroubleshootingGuideProps {
  category: string;
  pdfUrl: string;
}

const TroubleshootingGuide = ({ category, pdfUrl }: TroubleshootingGuideProps) => {
  // In a real app, you'd have actual PDF guides
  // For this demo, we'll simulate PDF content with embedded HTML content
  
  const renderGuideContent = () => {
    // This would normally display an embedded PDF or instructions
    // For this demo we'll show simulated content based on category
    
    switch (category) {
      case 'Washing Machine Not Working':
        return (
          <div className="space-y-4">
            <h3 className="font-medium">Common Washing Machine Issues & Solutions</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                <strong>Machine won't turn on</strong>
                <p>Check that the machine is properly plugged in and the circuit breaker hasn't tripped.</p>
              </li>
              <li>
                <strong>Machine won't drain</strong>
                <p>Check the drain filter (usually at the bottom front) for blockages like coins or debris.</p>
              </li>
              <li>
                <strong>Unusual noises</strong>
                <p>Make sure the machine is level and that there aren't any small items caught in the drum.</p>
              </li>
              <li>
                <strong>Error codes</strong>
                <p>Try turning the machine off at the wall, waiting 5 minutes, then turning it back on.</p>
              </li>
            </ol>
          </div>
        );
        
      case 'Heating Issue':
        return (
          <div className="space-y-4">
            <h3 className="font-medium">Heating System Troubleshooting</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                <strong>No heat at all</strong>
                <p>Check that your thermostat is set correctly and has working batteries.</p>
              </li>
              <li>
                <strong>Radiators cold at the top</strong>
                <p>Your radiators may need bleeding to remove trapped air.</p>
              </li>
              <li>
                <strong>Boiler pressure too low</strong>
                <p>Check the pressure gauge - it should be between 1-1.5 bar. If low, follow repressurizing instructions.</p>
              </li>
            </ol>
          </div>
        );
        
      case 'Plumbing Problem':
        return (
          <div className="space-y-4">
            <h3 className="font-medium">Common Plumbing Issues</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                <strong>Dripping taps</strong>
                <p>Turn off water supply under sink, replace the washer inside the tap.</p>
              </li>
              <li>
                <strong>Blocked toilet</strong>
                <p>Use a plunger with an up-and-down motion to create suction.</p>
              </li>
              <li>
                <strong>Slow draining sink</strong>
                <p>Try a mixture of baking soda and vinegar, followed by hot water.</p>
              </li>
            </ol>
          </div>
        );
        
      default:
        return (
          <div className="p-6 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="font-medium">Guide not available</h3>
            <p className="text-gray-500">
              We don't have a specific guide for this issue type yet.
            </p>
          </div>
        );
    }
  };
  
  return (
    <Card className="p-4 bg-secondary/50">
      <div className="mb-4 border-b pb-2">
        <h3 className="font-medium">Troubleshooting Guide: {category}</h3>
      </div>
      
      <div className="overflow-auto max-h-80 mb-4">
        {renderGuideContent()}
      </div>
      
      {pdfUrl && (
        <div className="flex justify-end">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download PDF Guide
          </Button>
        </div>
      )}
    </Card>
  );
};

export default TroubleshootingGuide;
