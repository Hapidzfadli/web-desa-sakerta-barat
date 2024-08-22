import React from 'react';
import dynamic from 'next/dynamic';
const DynamicDaftarPermohonan = dynamic(
  () => import('../../../components/DaftarPermohonan/DaftarPermohonan'),
  { ssr: false },
);

const DaftarPermohonanAdmin = () => {
  return <DynamicDaftarPermohonan />;
};

export default DaftarPermohonanAdmin;
