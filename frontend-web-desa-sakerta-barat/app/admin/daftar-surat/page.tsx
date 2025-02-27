import React from 'react';
import dynamic from 'next/dynamic';

const DynamicListLetters = dynamic(
  () => import('../../../components/ListLetters/ListLetters'),
  { ssr: false },
);

const ListLettersAdmin = () => {
  return <DynamicListLetters />;
};
export default ListLettersAdmin;
