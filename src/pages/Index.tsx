
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import IssueForm from '@/components/IssueForm';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-8">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-3">Report an Issue</h2>
              <p className="text-gray-600">
                Having a problem with your rental property? Use this form to report any issues.
              </p>
            </div>
            
            <IssueForm />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
