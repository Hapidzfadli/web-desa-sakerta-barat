import React, { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import EditPopup from '../shared/EditPopup';
import { ResidentData } from './types/profile.types';
import {
  updateResidentSchema,
  formatDate,
  toInputDateValue,
} from './utils/profileUtils';

interface ResidentCardProps {
  residentData: ResidentData | null;
  onSave: (data: Record<string, string>) => Promise<void>;
  isPopupOpen: boolean;
  setIsPopupOpen: (isOpen: boolean) => void;
}

const ResidentCard: React.FC<ResidentCardProps> = ({
  residentData,
  onSave,
  isPopupOpen,
  setIsPopupOpen,
}) => {
  const residentFields = [
    { label: 'Nama Lengkap', field: 'name' },
    { label: 'NIK', field: 'nationalId' },
    { label: 'Tanggal Lahir', field: 'dateOfBirth', format: formatDate },
    { label: 'Agama', field: 'religion' },
    { label: 'Status Pernikahan', field: 'maritalStatus' },
    { label: 'Pekerjaan', field: 'occupation' },
    { label: 'Kewarganegaraan', field: 'nationality' },
    { label: 'Tempat Lahir', field: 'placeOfBirth' },
    { label: 'Jenis Kelamin', field: 'gender' },
    { label: 'Nomor Kartu Keluarga', field: 'familyCardNumber' },
    { label: 'Kecamatan', field: 'district' },
    { label: 'Kabupaten', field: 'regency' },
    { label: 'Provinsi', field: 'province' },
    { label: 'Kode Pos', field: 'postalCode' },
    { label: 'RT', field: 'rt' },
    { label: 'RW', field: 'rw' },
    { label: 'Alamat KTP', field: 'idCardAddress' },
    { label: 'Alamat Domisili', field: 'residentialAddress' },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="head-form">Biodata Penduduk</CardTitle>
          <Button
            className="bg-edit h-8 w-8 rounded-full p-0"
            title="Edit"
            onClick={() => setIsPopupOpen(true)}
          >
            <FontAwesomeIcon
              className="h-4 w-4 text-white"
              icon={faPenToSquare}
            />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {residentData ? (
          <div className="grid md:grid-cols-2 gap-4">
            {residentFields.map((item) => (
              <div key={item.field}>
                <p className="label-form">{item.label}</p>
                <p>
                  {item.format && residentData[item.field]
                    ? item.format(residentData[item.field])
                    : residentData[item.field] || 'Belum diisi'}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>
            Data penduduk belum diisi. Silakan klik tombol edit untuk mengisi
            data.
          </p>
        )}
      </CardContent>
      <Suspense fallback={<div>Loading...</div>}>
        <EditPopup
          title="Edit Biodata Penduduk"
          fields={residentFields.map((item) => ({
            label: item.label,
            name: item.field,
            value: residentData ? residentData[item.field] : '',
            required: true,
            type:
              item.field === 'dateOfBirth'
                ? 'date'
                : item.field === 'idCardAddress' ||
                    item.field === 'residentialAddress'
                  ? 'textarea'
                  : 'text',
          }))}
          onSave={onSave}
          validationSchema={updateResidentSchema}
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
        />
      </Suspense>
    </Card>
  );
};

export default ResidentCard;
