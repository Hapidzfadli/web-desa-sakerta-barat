import React from 'react';
import dynamic from 'next/dynamic';
const DynamicDaftarPengguna = dynamic(
  () => import('../../../components/DaftarPengguna/DaftarPengguna'),
  { ssr: false },
);

const Pengguna = () => {
  return <DynamicDaftarPengguna />;
};

export default Pengguna;
