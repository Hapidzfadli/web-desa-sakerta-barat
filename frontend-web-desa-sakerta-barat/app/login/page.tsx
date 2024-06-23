import Image from 'next/image'
import React from 'react'

const Login = () => {
  return (
    <div className="min-h-screen  bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl flex overflow-hidden">
        {/* Left side - Login form */}
        <div className="w-1/2 p-8">
        <div className="relative w-16 h-16 mb-6">
            <Image
              src="/assets/images/logo.svg"
              alt="Logo"
              layout="fill"
              objectFit="contain"
            />
          </div>
          <h2 className="text-2xl mb-6">Masuk dan Jadilah Bagian dari <span className='font-bold'>Perubahan Desa.</span></h2>
          <form>
            <div className="mb-4">
              <input type="text" placeholder="Masukan username anda" className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div className="mb-4">
              <input type="password" placeholder="Masukan password anda" className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div className="flex justify-between items-center mb-4">
              <a href="#" className="text-blue-500">Lupa Password ?</a>
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center">
                Masuk
                {/* <ArrowRightCircle className="ml-2" size={20} /> */}
              </button>
            </div>
          </form>
        </div>
        
        {/* Right side - Image and sign up */}
        <div className="w-1/2 bg-white p-8 flex flex-col justify-between relative">
          <div className="absolute inset-0 bg-gray-100 m-4 rounded-lg"></div>
          <div className="relative z-10 flex-grow flex items-center justify-center">
            <div className="relative w-[500px] h-[300px]">
              <Image
                src="/assets/images/world.png"
                alt="World People"
                layout="fill"
                objectFit="contain"
              />
            </div>
          </div>
          <div className="mt-4 bg-blue-100 p-4 rounded-lg flex justify-between items-center relative z-10">
            <span className="text-sm text-blue-800">Mari Berkontribusi untuk Kemajuan Desa</span>
            <button className="bg-white text-blue-500 px-4 py-2 rounded-md shadow">Daftar</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login