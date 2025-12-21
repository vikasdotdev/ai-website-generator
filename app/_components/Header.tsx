import { Button } from '@/components/ui/button'
import { SignInButton } from '@clerk/nextjs'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link';
import React from 'react'

const MenuOptions=[
    {
        name:'Pricing',
        path:'/pricing'
    },
    {
        name:'Contact us',
        path:'/contact-us'
    }
]

const Header = () => {
  return (
    <div className='flex items-center justify-between p-4 shadow'>

        {/* LOGO*/}
        <div className='flex gap-2 items-center'>
            <Image src={'/logo.svg'} alt='logo' width={35} height={35} />
            <h2 className='font-bold text-xl'>AI Website Generator</h2>
        </div>

        {/* MENU OPTION */}
        <div className='flex gap-3'>
            {MenuOptions.map((menu, index)=>(
                <Button variant={'ghost'} key={index}>{menu.name}</Button>
            ))}
        </div>

        {/* GET STARTED BUTTON */}
        <div>
            <SignInButton mode='modal' forceRedirectUrl={'/workspace'}>
                <Link href={'/workspace'}>
                    <Button>Get Started <ArrowRight/></Button>
                </Link>                
            </SignInButton>
        </div>
    </div>
  )
}

export default Header