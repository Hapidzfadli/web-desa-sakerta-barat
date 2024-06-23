import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Image from 'next/image'
import Link from 'next/link'
import { exploreLink } from '@/constants'
const Explore = ({title, description} : ExploreProps) => {
  return (
    <div className='p-10 flex flex-col sm:flex-col md:flex-row lg:flex-row gap-5' id='explore'>
        <div className="text-explore flex-1">
            <p>{title}</p>
            <p>{description}</p>
        </div>
        <div className="feat-explore flex-1 ">
          <div className='flex justify-start gap-10'>
          {exploreLink.map((link, index) => {
              if (index < 2) {
                return (
                  <Link key={index} href={link.route} className='flex-[0.7_1_0%]'>
                    <div className='flex-[0.7_1_0%]'> {/* Tambahkan elemen <a> di dalam <Link> */}
                      <Card className='relative !shadow-exploreCard border-0 w-full h-auto'>
                        <CardContent>
                          <div className='relative w-full h-[100px]'>
                            <Image
                              src={link.icon}
                              layout="fill"
                              objectFit="contain"
                              alt={link.label}
                              className='absolute top-[-50px] img-explore left-1/2 transform -translate-y-1/2'
                            />
                          </div>
                        </CardContent>
                        <CardFooter className='absolute bottom-0 w-full flex justify-center items-center'>
                          <p className='p-semibold-18 text-green-500'>{link.label}</p>
                        </CardFooter>
                      </Card>
                    </div>
                  </Link>
                );
              } else {
                return null;
              }
            })}
            <div className='flex-[0.2_1_0%]'></div>
          </div>
          <div className='flex justify-end my-24 gap-10'>
          <div className='flex-[0.2_1_0%]'></div>
            {exploreLink.map((link, index) => {
                if (index > 1) {
                  return (
                    <Link key={index} href={link.route} className='flex-[0.7_1_0%]'>
                      <div className='flex-[0.7_1_0%]'> {/* Tambahkan elemen <a> di dalam <Link> */}
                        <Card className='relative !shadow-exploreCard border-0 w-full h-auto'>
                          <CardContent>
                            <div className='relative w-full h-[120px]'>
                              <Image
                                src={link.icon}
                                layout="fill"
                                objectFit="contain"
                                alt={link.label}
                                className='absolute top-[-50px] img-explore left-1/2 transform -translate-y-1/2'
                              />
                            </div>
                          </CardContent>
                          <CardFooter className='absolute bottom-0 w-full flex justify-center items-center'>
                            <p className='p-semibold-18 text-green-500'>{link.label}</p>
                          </CardFooter>
                        </Card>
                      </div>
                    </Link>
                  );
                } else {
                  return null;
                }
              })}
          </div>
        </div>
    </div>
  )
}

export default Explore