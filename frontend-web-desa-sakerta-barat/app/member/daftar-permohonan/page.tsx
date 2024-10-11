import React from 'react';
import dynamic from 'next/dynamic';
const DynamicListLetterRequests = dynamic(
  () => import('../../../components/ListLetterRequests/ListLetterRequests'),
  { ssr: false },
);
const ListLetterRequestsWarga = () => {
  return <DynamicListLetterRequests />;
};

export default ListLetterRequestsWarga;
