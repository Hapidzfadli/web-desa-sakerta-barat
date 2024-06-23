import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import NavItems from './NavItem'
import MobileNav from './MobileNav'
const Header = () => {
  return (
    <header className='w-full '>
        <div className="wrapper p-4 flex items-center justify-between">
            <Link href="/" className="w-50 flex align-middle items-center">
                <Image
                src="/assets/images/logo.svg" width={50} height={38}
                alt="Desa Sakerta Barat" />
                <div className='flex-col ml-2'>
                    <p className='p-medium-18'>Desa Sakerta Barat</p>
                    <p className='p-reguler-14'>Kabupaten Kuningan</p>
                </div>
            </Link>
            <nav className="md:flex-between hidden w-full max-w-xs">
             <NavItems />
            </nav>

            <MobileNav />
        </div>
    </header>
  )
}

export default Header