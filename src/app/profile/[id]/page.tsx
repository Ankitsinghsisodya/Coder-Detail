'use client'
import React, { useEffect, useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { createUser } from '@/actions/creat-User'
import { Button } from '@/components/ui/button'
import { useParams } from 'next/navigation'
import { getUserDetails } from '@/actions/get-User-Details'
import { useFormStatus } from 'react-dom'


function page() {
    const params = useParams();
    const { pending } = useFormStatus()
    const userId = params.id as string;
    const [userData, setUserData] = useState({
        name: '',
        codeforces: '',
        leetcode: ''
    })
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function fetchUserData() {
            if (!userId) return;

            try {
                setIsLoading(true);

            } catch (error) {
                console.error("Error fetching user data:", error);
                const response = await getUserDetails(userId);
                if (response.ok) {
                    setUserData({
                        name: response.user?.name as string,
                        codeforces: response.user?.codeforces as string,
                        leetcode: response?.user?.leetcode as string
                    })
                }
            }
            finally {
                setIsLoading(false);
            }
        }
        fetchUserData();
    }, [userId])

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }
    return (
        <div className='container mx-auto w-1/2 flex justify-center items-center h-screen'>

            <form action={createUser} className='border p-5 rounded-2xl flex flex-col gap-y-3'>
                <div >
                    <Input type="hidden" name="userId" value={userId} />
                    <Label htmlFor='name'>Name</Label>
                    <Input
                        name='name'
                        type='text'
                        defaultValue={userData.name}
                        placeholder='Enter your name' />

                </div>
                <div >

                    <Label htmlFor='codeforces'>Codeforces</Label>
                    <Input
                        type='text'
                        name='codeforces'
                        defaultValue={userData.codeforces}
                        placeholder='Enter your codeforces username'
                    />
                </div>
                <div >

                    <Label htmlFor='leetcode'>Leetcode</Label>
                    <Input
                        type='text'
                        name='leetcode'
                        defaultValue={userData.leetcode}
                        placeholder='Enter your leetcode username'
                    />
                </div>
                <Button type="submit" disabled={pending}>{pending ? "Updating..." : "Update"}</Button>
            </form>
        </div>

    )
}

export default page
