import React from 'react';
import dynamic from 'next/dynamic';
const DynamicDaftarPermohonan = dynamic(
  () => import('../../../components/DaftarPermohonan/DaftarPermohonan'),
  { ssr: false },
);
const DaftarPermohonanWarga = () => {
  return <DynamicDaftarPermohonan />;
};

export default DaftarPermohonanWarga;
