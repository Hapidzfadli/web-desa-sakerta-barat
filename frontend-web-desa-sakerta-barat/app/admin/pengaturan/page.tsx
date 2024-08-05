'use client';
import React, { useState } from 'react';
import { cn } from '../../../lib/utils';
import BiodataDiri from '../../../components/BiodataDiri/BiodataDiri';
import Keamanan from '../../../components/Keamanan/Keamanan';

const Pengaturan = () => {
  const [activeTab, setActiveTab] = useState('biodata');

  const tabs = [
    { id: 'biodata', label: 'Biodata Diri', component: <BiodataDiri /> },
    { id: 'keamanan', label: 'Keamanan', component: <Keamanan /> },
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
