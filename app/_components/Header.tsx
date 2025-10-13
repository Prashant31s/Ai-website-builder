import { Button } from '@/components/ui/button'
import { SignInButton } from '@clerk/nextjs'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import path from 'path'
import React from 'react'

const menuOptions = [
    {
        name: 'pricing',
        path: '/pricing'
    },
    {
        name: 'Contact Us',
        path: '/contact-us'
    }
]
function Header() {
  return (
    <div className='flex items-center justify-between p-4 shadow'>
        <div className='flex items-center gap-2'> 
            <Image src={'/logo.svg'} alt='logo' height={35} width={35}/>
            <h2 className='font-bold text-xl'>AI Website Generator</h2>
        </div>
        <div className='flex gap-3'>
                {menuOptions.map((menu, index)=>(
                    <Button variant ={'ghost'} key ={index}>{menu.name}</Button>
                ))}
        </div>
        <div>
            <SignInButton mode='modal' forceRedirectUrl={'/workspace'}>
                <Link href={'/workspace'}>
                    <Button>Get Started<ArrowRight/></Button>
                </Link>
            </SignInButton>
        </div>
    </div>
  )
}

export default Header