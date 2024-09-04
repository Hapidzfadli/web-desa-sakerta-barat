'use client';
import Link from 'next/link';
import Image from 'next/image';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { authFormSchema } from '../../lib/utils';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import CustomInput from './CustomInput';
import { Loader2 } from 'lucide-react';
import { loginUser, registerUser } from '../../lib/actions/user.actions';
import { useToast } from '../ui/use-toast';
const AuthForm = ({ type }: { type: string }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      if (type === 'register') {
        const userData = {
          firstName: data.firstName!,
          lastName: data.lastName!,
          name: data.name!,
          username: data.username!,
          email: data.email!,
          password: data.password!,
        };
        const newUser = await registerUser(userData);
        setUser(newUser);
        if (newUser) {
          toast({
            title: 'Registration Successful',
            description: 'You have successfully registered. Please log in.',
            duration: 5000,
          });
          router.push('/login');
        }
      }
      if (type === 'login') {
        const response = await loginUser({
          username: data.username,
          password: data.password,
        });

        if (response) {
          if (
            response.data.role === 'ADMIN' ||
            response.data.role === 'KADES'
          ) {
            router.push('/admin/dashboard');
          } else {
            router.push('/member/dashboard');
          }
          toast({
            title: 'Login Successful',
            description: 'You have successfully logged in.',
            duration: 3000,
          });
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: error.message || 'An error occurred. Please try again.',
        variant: 'destructive',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="auth-from">
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl flex flex-col md:flex-row overflow-hidden">
          {/* Left side - Login form */}
          <div className="w-full md:w-1/2 p-6 md:p-8">
            <div className="relative mb-4 flex flex-col md:flex-row md:justify-between items-center">
              <div className="w-20 h-20 mb-4 md:mb-0 md:mr-2 relative">
                <Image
                  src="/assets/images/logo.svg"
                  alt="Logo"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <h2 className="text-xl md:text-2xl text-center md:text-left mb-6">
                {type === 'login' ? (
                  <>
                    Masuk dan Jadilah Bagian dari{' '}
                    <span className="font-bold">Perubahan Desa.</span>
                  </>
                ) : (
                  <>
                    Bergabunglah dan Nikmati{' '}
                    <span className="font-bold">Kemudahan Pelayanan Desa.</span>
                  </>
                )}
              </h2>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {type === 'register' && (
                  <>
                    <div className="flex flex-col md:flex-row gap-4">
                      <CustomInput
                        control={form.control}
                        name="firstName"
                        label="First Name"
                        placeholder="Masukan Nama Depan"
                      />
                      <CustomInput
                        control={form.control}
                        name="lastName"
                        label="Last Name"
                        placeholder="Masukan Nama Belakang"
                      />
                    </div>
                    <CustomInput
                      control={form.control}
                      name="name"
                      label="Nama Lengkap"
                      placeholder="Masukan Nama Lengkap"
                    />
                    <CustomInput
                      control={form.control}
                      name="email"
                      label="Email"
                      placeholder="Masukan Email"
                    />
                  </>
                )}
                <CustomInput
                  control={form.control}
                  name="username"
                  label="Username"
                  placeholder="Masukan username"
                />
                <CustomInput
                  control={form.control}
                  name="password"
                  label="Password"
                  placeholder="Masukan Password"
                />
                <div className={`flex flex-col gap-4`}>
                  {type === 'login' && (
                    <p className="text-sm text-blue-800 cursor-pointer">
                      Lupa Password ?{' '}
                    </p>
                  )}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="form-btn"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={20} className="animate-spin" /> &nbsp;
                        Loading...
                      </>
                    ) : type === 'login' ? (
                      'Login'
                    ) : (
                      'Register'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>

          {/* Right side - Image and sign up */}
          <div className="w-full md:w-1/2 bg-white p-6 md:p-8 flex flex-col justify-between relative">
            <div className="absolute inset-0 bg-gray-100 m-4 rounded-lg"></div>
            <div className="relative z-10 flex-grow flex items-center justify-center">
              <div className="relative w-full max-w-[300px] md:max-w-[500px] h-[200px] md:h-[300px]">
                <Image
                  src="/assets/images/world.png"
                  alt="World People"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            </div>
            <div className="mt-4 bg-blue-100 p-4 rounded-lg flex flex-col md:flex-row justify-between items-center relative z-10">
              <span className="text-sm text-blue-800 mb-2 md:mb-0">
                Mari Berkontribusi untuk Kemajuan Desa
              </span>
              <Link href={type === 'register' ? '/login' : '/register'}>
                <button className="bg-white text-blue-500 px-4 py-2 rounded-md shadow w-full md:w-auto">
                  {type === 'register' ? 'Login' : 'Daftar'}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthForm;
