import React, { useState, Suspense } from 'react';
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
  residentData: ResidentData;
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
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { label: 'Nama Lengkap', field: 'name' },
            { label: 'NIK', field: 'nationalId' },
            {
              label: 'Tanggal Lahir',
              field: 'dateOfBirth',
              format: formatDate,
            },
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
          ].map((item) => (
            <div key={item.field}>
              <p className="label-form">{item.label}</p>
              <p>
                {item.format
                  ? item.format(residentData[item.field])
                  : residentData[item.field] || 'Not provided'}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
      <Suspense fallback={<div>Loading...</div>}>
        <EditPopup
          title="Edit Biodata Penduduk"
          fields={[
            {
              label: 'Nama Lengkap',
              name: 'name',
              value: residentData.name,
              required: true,
            },
            {
              label: 'NIK',
              name: 'nationalId',
              value: residentData.nationalId,
              required: true,
            },
            {
              label: 'Tanggal Lahir',
              name: 'dateOfBirth',
              value: toInputDateValue(residentData.dateOfBirth),
              type: 'date',
              required: true,
            },
            {
              label: 'Agama',
              name: 'religion',
              value: residentData.religion,
              required: true,
            },
            {
              label: 'Status Pernikahan',
              name: 'maritalStatus',
              value: residentData.maritalStatus,
              required: true,
            },
            {
              label: 'Pekerjaan',
              name: 'occupation',
              value: residentData.occupation,
              required: true,
            },
            {
              label: 'Kewarganegaraan',
              name: 'nationality',
              value: residentData.nationality,
              required: true,
            },
            {
              label: 'Tempat Lahir',
              name: 'placeOfBirth',
              value: residentData.placeOfBirth,
              required: true,
            },
            {
              label: 'Jenis Kelamin',
              name: 'gender',
              value: residentData.gender,
              required: true,
            },
            {
              label: 'Nomor Kartu Keluarga',
              name: 'familyCardNumber',
              value: residentData.familyCardNumber,
              required: true,
            },
            {
              label: 'Kecamatan',
              name: 'district',
              value: residentData.district,
              required: true,
            },
            {
              label: 'Kabupaten',
              name: 'regency',
              value: residentData.regency,
              required: true,
            },
            {
              label: 'Provinsi',
              name: 'province',
              value: residentData.province,
              required: true,
            },
            {
              label: 'Kode Pos',
              name: 'postalCode',
              value: residentData.postalCode,
              required: true,
            },
            { label: 'RT', name: 'rt', value: residentData.rt, required: true },
            { label: 'RW', name: 'rw', value: residentData.rw, required: true },
            {
              label: 'Alamat KTP',
              name: 'idCardAddress',
              value: residentData.idCardAddress,
              type: 'textarea',
              required: true,
            },
            {
              label: 'Alamat Domisili',
              name: 'residentialAddress',
              value: residentData.residentialAddress,
              type: 'textarea',
              required: true,
            },
          ]}
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
