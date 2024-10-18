import React from 'react';
import dynamic from 'next/dynamic';
const DynamicListUsers = dynamic(
  () => import('../../../components/ListUsers/ListUsers'),
  { ssr: false },
);

const Pengguna = () => {
  return <DynamicListUsers />;
};

export default Pengguna;
