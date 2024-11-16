import React from 'react';
import { Resident } from '../types';
import EditPopup from '../../../components/shared/EditPopup';
import { formatDate } from '../utils/helpers';

interface ApplicantDetailsProps {
  resident: Resident;
  isOpen: boolean;
  onClose: () => void;
  isEditing: boolean;
  onEdit: (name: string, value: string) => void;
  onSave: () => void;
}

const ApplicantDetails: React.FC<ApplicantDetailsProps> = ({
  resident,
  isOpen,
  onClose,
  isEditing,
  onEdit,
  onSave,
}) => {
  const renderResidentFields = () => {
    return [
      { label: 'Nama', name: 'name', value: resident.name },
      { label: 'NIK', name: 'nationalId', value: resident.nationalId },
      {
        label: 'Tanggal Lahir',
        name: 'dateOfBirth',
        value: formatDate(resident.dateOfBirth),
        type: 'date',
      },
      { label: 'Agama', name: 'religion', value: resident.religion },
      {
        label: 'Status Pernikahan',
        name: 'maritalStatus',
        value: resident.maritalStatus,
      },
      { label: 'Pekerjaan', name: 'occupation', value: resident.occupation },
      {
        label: 'Kewarganegaraan',
        name: 'nationality',
        value: resident.nationality,
      },
      {
        label: 'Tempat Lahir',
        name: 'placeOfBirth',
        value: resident.placeOfBirth,
      },
      { label: 'Jenis Kelamin', name: 'gender', value: resident.gender },
      {
        label: 'No. Kartu Keluarga',
        name: 'familyCardNumber',
        value: resident.familyCardNumber,
      },
      { label: 'Kecamatan', name: 'district', value: resident.district },
      { label: 'Kabupaten', name: 'regency', value: resident.regency },
      { label: 'Provinsi', name: 'province', value: resident.province },
      { label: 'Kode Pos', name: 'postalCode', value: resident.postalCode },
      { label: 'Nama Ayah', name: 'fatherName', value: resident.fatherName },
      { label: 'Nama Ibu', name: 'motherName', value: resident.motherName },
      { label: 'RT', name: 'rt', value: resident.rt },
      { label: 'RW', name: 'rw', value: resident.rw },
      {
        label: 'Alamat KTP',
        name: 'idCardAddress',
        value: resident.idCardAddress,
      },
      {
        label: 'Alamat Domisili',
        name: 'residentialAddress',
        value: resident.residentialAddress,
      },
      // { label: 'Golongan Darah', name: 'bloodType', value: resident.bloodType },
    ].map((field) => ({
      ...field,
      onChange: isEditing
        ? (value: string) => onEdit(field.name, value)
        : undefined,
      disabled: !isEditing,
    }));
  };

  return (
    <EditPopup
      title="Detail Pemohon"
      fields={renderResidentFields()}
      isOpen={isOpen}
      onClose={onClose}
      viewMode={!isEditing}
      onSave={onSave}
    />
  );
};

export default ApplicantDetails;
