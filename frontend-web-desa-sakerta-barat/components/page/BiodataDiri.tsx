import React, { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { useUser } from '../../app/context/UserContext'
import { fetchResidentData } from '../../lib/actions/setting.actions'
import EditPopup from '../shared/EditPopup'

const BiodataDiri = () => {
  const { user } = useUser();
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const data = await fetchResidentData();
        setProfileData(data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load profile data');
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!profileData) return <div>No profile data available</div>;
  const handleSave = (data: Record<string, string>) => {
    console.log('Saved data:', data);
    // Implementasi logika untuk menyimpan data
  };
  return (
    <div className="p-4 space-y-4">
      <Card>
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/path-to-avatar.jpg" alt={profileData.username} />
              <AvatarFallback>{profileData.username?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{profileData.username}</h2>
              <p className="text-sm text-gray-500">Last updated: {new Date(profileData.updatedAt).toLocaleString()}</p>
            </div>
          </div>
          <Button variant="outline" size="sm">Edit</Button>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Personal Information</CardTitle>
            <EditPopup
              title="Edit Personal Information"
              fields={[
                { label: 'Nama Lengkap', name: 'name', value: profileData.name },
                { label: 'Email', name: 'email', value: profileData.email },
                { label: 'Nomor Hp', name: 'phone', value: profileData.phoneNumber },
                { label: 'NIK', name: 'phone', value: profileData.Resident.nationalId },
                { label: 'Alamat KTP', name: 'address', value: profileData.Resident.idCardAddress, type: 'textarea' },
                { label: 'Alamat Domisili', name: 'address', value: profileData.Resident.residentialAddress, type: 'textarea' },
              ]}
              onSave={handleSave}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { label: 'Username', field: 'username' },
              { label: 'Full Name', field: 'name' },
              { label: 'NIK', field: 'Resident.nationalId' },
              { label: 'Date of Birth', field: 'Resident.dateOfBirth' },
              { label: 'Email', field: 'email' },
              { label: 'Phone Number', field: 'phoneNumber' },
              { label: 'ID Card Address', field: 'Resident.idCardAddress' },
              { label: 'Residential Address', field: 'Resident.residentialAddress' },
            ].map((item) => (
              <div key={item.field}>
                <p className="text-sm font-medium text-gray-500">{item.label}</p>
                <p>{item.field.split('.').reduce((obj, key) => obj?.[key], profileData) || 'Not provided'}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Role Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Role</p>
              <p>{profileData.role}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Documents</CardTitle>
        </CardHeader>
        <CardContent>
          {profileData.resident?.documents?.length > 0 ? (
            <ul>
              {profileData.resident.documents.map((doc: any) => (
                <li key={doc.id}>
                  <p className="text-sm font-medium">{doc.type}</p>
                  <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    View Document
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p>No documents available</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default BiodataDiri