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
    {
      label: 'Agama',
      field: 'religion',
      type: 'select',
      options: [
        { value: 'ISLAM', label: 'Islam' },
        { value: 'KRISTEN', label: 'Kristen' },
        { value: 'KATOLIK', label: 'Katolik' },
        { value: 'HINDU', label: 'Hindu' },
        { value: 'BUDDHA', label: 'Buddha' },
        { value: 'KONGHUCU', label: 'Konghucu' },
      ],
    },
    {
      label: 'Status Pernikahan',
      field: 'maritalStatus',
      type: 'select',
      options: [
        { value: 'KAWIN', label: 'Kawin' },
        { value: 'BELUM', label: 'Belum Kawin' },
        { value: 'JANDA', label: 'Janda' },
        { value: 'DUDA', label: 'Duda' },
      ],
    },
    { label: 'Pekerjaan', field: 'occupation' },
    {
      label: 'Kewarganegaraan',
      field: 'nationality',
      type: 'select',
      options: [
        { value: 'WNI', label: 'WNI' },
        { value: 'WNA', label: 'WNA' },
      ],
    },
    { label: 'Tempat Lahir', field: 'placeOfBirth' },
    {
      label: 'Jenis Kelamin',
      field: 'gender',
      type: 'select',
      options: [
        { value: 'LAKI_LAKI', label: 'Laki-laki' },
        { value: 'PEREMPUAN', label: 'Perempuan' },
      ],
    },
    {
      label: 'Golongan Darah',
      field: 'bloodType',
      type: 'select',
      options: [
        { value: 'A', label: 'A' },
        { value: 'B', label: 'B' },
        { value: 'AB', label: 'AB' },
        { value: 'O', label: 'O' },
      ],
    },
    { label: 'Nomor Kartu Keluarga', field: 'familyCardNumber' },
    { label: 'Nama Ayah', field: 'fatherName' },
    { label: 'Nama Ibu', field: 'motherName' },
    { label: 'Kecamatan', field: 'district' },
    { label: 'Kabupaten', field: 'regency' },
    { label: 'Provinsi', field: 'province' },
    { label: 'Kode Pos', field: 'postalCode' },
    {
      label: 'RT',
      field: 'rt',
      type: 'number',
      min: 1,
      max: 999,
    },
    {
      label: 'RW',
      field: 'rw',
      type: 'number',
      min: 1,
      max: 999,
    },
    {
      label: 'Alamat KTP',
      field: 'idCardAddress',
      type: 'textarea',
    },
    {
      label: 'Alamat Domisili',
      field: 'residentialAddress',
      type: 'textarea',
    },
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
              <div key={item.field} className="space-y-2">
                <p className="label-form">{item.label}</p>
                <p>
                  {item.format && residentData[item.field]
                    ? item.format(residentData[item.field])
                    : item.type === 'select'
                      ? item.options?.find(
                          (option) => option.value === residentData[item.field],
                        )?.label || residentData[item.field]
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
            value: residentData
              ? item.field === 'dateOfBirth'
                ? toInputDateValue(residentData[item.field])
                : residentData[item.field]
              : '',
            required: true,
            type:
              item.type ||
              (item.field === 'dateOfBirth'
                ? 'date'
                : item.field === 'idCardAddress' ||
                    item.field === 'residentialAddress'
                  ? 'textarea'
                  : 'text'),
            options: item.options,
            min: item.min,
            max: item.max,
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
