
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PropertyManagerDashboard from '@/components/property-manager/PropertyManagerDashboard';
import { PropertyManagerProvider } from '@/context/PropertyManagerContext';

const PropertyManager = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-8">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-3">Property Manager Portal</h2>
              <p className="text-gray-600">
                Manage tenant issues and assign contractors to repair jobs.
              </p>
            </div>
            
            <PropertyManagerProvider>
              <PropertyManagerDashboard />
            </PropertyManagerProvider>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PropertyManager;
