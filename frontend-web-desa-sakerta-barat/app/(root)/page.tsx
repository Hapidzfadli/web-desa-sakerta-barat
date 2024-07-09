import Image from 'next/image';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import Explore from '@/components/shared/Explore';
function Home() {
  return (
    <div className="h-full w-full flex-col">
      {/* headline */}
      <div className="headline flex px-10 gap-3 h-4/6 relative">
        <div className="text-headline lg:flex-1 md:flex-1 z-[100]">
          <div className="flex items-center h-full">
            <div>
              <h3 className="h3-medium text-sky-1">Selamat Datang</h3>
              <p className="text-sky-1">Di Website Desa Sakerta Barat</p>
              <p className="pt-2 text-sm text-green-200">
                Melampaui Batas: Desa Sakerta Barat Membawa Inovasi dan
                Transformasi untuk Masa Depan yang Cerah
              </p>
            </div>
          </div>
        </div>
        <div className="img-headline flex-1 ">
          <Image
            src="/assets/images/village.jpg"
            layout="fill"
            className="object-cover"
            alt="Desa Sakerta Barat"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black-3 to-transparent"></div>
        </div>
      </div>

      {/* sambutan */}
      <div className="flex w-full p-10 justify-between ">
        <div className="avatar flex w-full justify-center items-center">
          <Avatar className="min-h-24 min-w-24 sm:min-h-32 sm:min-w-32 lg:min-h-52 lg:min-w-52">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div className="sambutan w-full h-full flex-auto">
          <h2 className="title-sambutan lg:h3-medium sm:p-medium-24 text-green-600">
            Sambutan Kepala Desa
          </h2>
          <p className="p-semibold-14 lg:p-bold-16">Nama Lengkap</p>
          <p className="p-medium-12 lg:p-medium-16">Jabatan</p>
          <p className="my-2 p-regular-12 lg:p-regular-14">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam
            nesciunt veritatis quo saepe, sed aperiam numquam illo voluptatibus
            aut ea.
          </p>
        </div>
      </div>

      {/* explore */}
      <Explore
        title={'Jelajahi Desa'}
        description={
          'Melalui website ini Anda dapat menjelajahi segala hal yang terkait dengan Desa. Aspek pemerintahan, penduduk, demografi, potensi Desa, dan juga berita tentang Desa.'
        }
      />
    </div>

    //sambutan
  );
}

export default Home;
