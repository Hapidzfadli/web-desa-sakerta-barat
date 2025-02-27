'use client';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { cn } from '../../../lib/utils';

// Use dynamic imports with ssr: false
const DynamicBiodata = dynamic(
  () => import('../../../components/Biodata/Biodata'),
  { ssr: false },
);

const DynamicSecurity = dynamic(
  () => import('../../../components/Security/Security'),
  { ssr: false },
);

const Pengaturan = () => {
  const [activeTab, setActiveTab] = useState('biodata');

  const tabs = [
    { id: 'biodata', label: 'Biodata Diri', component: <DynamicBiodata /> },
    { id: 'keamanan', label: 'Keamanan', component: <DynamicSecurity /> },
  ];

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 ">
        <nav className="flex space-x-4 border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'py-2 px-4 text-sm font-medium',
                activeTab === tab.id
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700',
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        {tabs.find((tab) => tab.id === activeTab)?.component}
      </div>
    </div>
  );
};

export default Pengaturan;
