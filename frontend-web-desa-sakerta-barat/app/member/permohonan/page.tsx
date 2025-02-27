import React from 'react';
import dynamic from 'next/dynamic';

const DynamicListLetter = dynamic(
  () => import('../../../components/ListLetters/ListLetters'),
  { ssr: false },
);

const Permohonan = () => {
  return <DynamicListLetter />;
};

export default Permohonan;
