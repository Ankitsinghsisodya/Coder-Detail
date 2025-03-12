'use client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button } from './ui/button'
// import {auth} from "@/auth"; // Adjust the path



function Header() {
    const session = useSession();

    const [imageUrl, setImgageUrl] = useState(null);
    console.log("session by ankit", session.data.user);
    useEffect(() => {
        if (session.data?.user?.image) {
            setImgageUrl(session?.data.user.image);
        }
    }, [])
    return (
        <div className='w-full bg-white'>
            <nav className='w-screen mx-auto flex justify-between items-center bg-gray-800 p-4 text-white'>
                <div>
                    Coder Details
                </div>
                <div>

                    <ul className='flex space-x-4'>
                        <Button>
                            <Link href={`/`} className='hover:text-gray-300'>Home</Link>
                        </Button>
                        <Button>
                            <Link href={`/profile/${session?.data?.user?.id}`} className='hover:text-gray-300'>Profile</Link>
                        </Button>
                        <Button>
                            <Link href='/sign-up' className='hover:text-gray-300'>Sign Up</Link>
                        </Button>
                        <Button>
                            <Link href='/sign-out' className='hover:text-gray-300'>Sign Out</Link>
                        </Button>
                        <Avatar>
                            <AvatarImage src={imageUrl || ''} />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </ul>
                </div>
            </nav>
        </div>
    )
}

export default Header
