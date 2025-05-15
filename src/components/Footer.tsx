
import React from 'react';

const Footer = () => {
  return (
    <footer className="py-6 border-t mt-12">
      <div className="container-custom">
        <div className="text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Tenant Issue Reporter</p>
          <p className="mt-1">Powered by LoftyWorks Property Management Platform</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
