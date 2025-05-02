'use client'
import { signOut, useSession } from 'next-auth/react'
import React, { useEffect } from 'react'
import { redirect, useRouter } from 'next/navigation'
import { toast } from "sonner"

function SignOutPage() {
    const router = useRouter()

    const handleSignOut = async () => {
        await signOut({ redirect: false })
        toast.success('You have been signed out successfully')
        router.push('/sign-up') // Redirect to sign-up page after sign out
    }

    const handleCancel = () => {
        router.back() // Go back to previous page
    }

    // const session = useSession();
    const { data: session, status } = useSession();


    if (status === 'unauthenticated') {
        toast.error('You are not logged in');
        redirect('/sign-up');
        return null;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-2">Sign Out</h1>
                    <p className="text-gray-600 mb-6">Are you sure you want to sign out?</p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={handleCancel}
                            className="w-full py-3 px-6 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full font-medium transition-colors"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={handleSignOut}
                            className="w-full py-3 px-6 bg-red-500 hover:bg-red-600 text-white rounded-full font-medium transition-colors"
                        >
                            Sign Out
                        </button>
                    </div>

                    <p className="mt-6 text-xs text-gray-500">
                        You will be redirected to the login page after signing out.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SignOutPage