import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { useUser } from '../../app/context/UserContext'

const BiodataDiri = () => {
const { user, logout } = useUser();
  return (
    <div className=" p-4 space-y-4">
      <Card>
        <div className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
                <AvatarImage src="/path-to-avatar.jpg" alt={user?.username} />
                <AvatarFallback>JK</AvatarFallback>
            </Avatar>
            <div>
                <h2 className="text-xl font-semibold">{user?.username}</h2>
                <p className="text-sm text-gray-500">Last updated: 2min ago</p>
            </div>
            </div>
            <Button variant="outline" size="sm">Edit</Button>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Username</p>
              <p>{user?.username}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Jenis Kelamin</p>
              <p>Laki-laki</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Nama Lengkap</p>
              <p>Hapid Fadli</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">NIK</p>
              <p>320121272101020004</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Tempat Lahir</p>
              <p>     Kab. Kuningan </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Tanggal Lahir</p>
              <p>      21 January 2002  </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p>hapidzfadli@gmail.com </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">No Handphone</p>
              <p>+6285797463762</p>
            </div>
          </div>
          <div className='grid grid-cols-1 gap-4 mt-4'>
            <div>
              <p className="text-sm font-medium text-gray-500">Alamat Tempat Tinggal</p>
              <p>     Jalan Desa Sakerta Barat, Dusun Puhun RT 02 RW01 NO 29, Kab. Kuningan, Jawa Barat </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Alamat Tempat Tinggal</p>
              <p>     Jalan Cipaku Indah VIII No. 53a, RT.5/RW.2, Ledeng, Cidadap, Kota Bandung CIDADAP, KOTA BANDUNG, JAWA BARAT, ID, 40141, Kota Bandung, Jawa Barat </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">No Rekening Bank Rakyat Indonesia</p>
              <p>427301020800530</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informasi Akademik</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Type</p>
              <p>Admin</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Is Active</p>
              <p>Yes</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Teams</p>
              <p>Sales</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Default Team</p>
              <p>None</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Roles</p>
              <p>None</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Dokumen</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <p className="text-sm font-medium text-gray-500">Working Time Calendar</p>
            <p>None</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default BiodataDiri