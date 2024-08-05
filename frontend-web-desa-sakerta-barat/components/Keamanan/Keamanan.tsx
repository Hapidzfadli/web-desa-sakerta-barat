import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';
import { useSecurityActions } from './hook/useSecurityActions';

const Keamanan: React.FC = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pin, setPin] = useState('');

  const { changePassword, updatePin, isLoading } = useSecurityActions();
  const { toast } = useToast();

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'New password and confirm password do not match.',
      });
      return;
    }
    await changePassword({ oldPassword, newPassword });
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleUpdatePin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 6 || !/^\d+$/.test(pin)) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'PIN must be 6 digits.',
      });
      return;
    }
    await updatePin({ pin });
    setPin('');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="head-form">Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <Input
              type="password"
              placeholder="Password lama"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password baru"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Konfirmasi Password baru"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-save text-black-2"
            >
              {isLoading ? 'perbaharui...' : 'Perbaharui Password'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="head-form">PIN</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdatePin} className="space-y-4">
            <Input
              type="password"
              placeholder="6-digit PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              maxLength={6}
              required
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-save text-black-2"
            >
              {isLoading ? 'Updating...' : 'Perbaharui PIN'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Keamanan;
