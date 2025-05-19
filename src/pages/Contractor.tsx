
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContractorDashboard from '@/components/contractor/ContractorDashboard';

const Contractor = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-8">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-3">Contractor Portal</h2>
              <p className="text-gray-600">
                Manage your schedule and respond to assigned repair jobs.
              </p>
            </div>
            
            <ContractorDashboard />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contractor;
