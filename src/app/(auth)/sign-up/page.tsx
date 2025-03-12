'use client'
import { signIn, useSession } from 'next-auth/react'

import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { toast } from "sonner"

function SignUp() {
  const [isLoading, setIsLoading] = useState(false)
  const { data: session, status } = useSession()
  const router = useRouter()

  // Add a loading indicator when status is 'loading'
  if (status === 'loading') {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900'></div>
      </div>
    )
  }

  // Handle redirections based on session status
  useEffect(() => {
    // Only show the toast and redirect once when session is confirmed as not existing
    if (status === 'authenticated') {
      toast.error('You are  logged in')
      router.push('/')
    }
  }, [status])

  const handleSignIn = async (provider: string) => {
    try {
      setIsLoading(true)
      await signIn(provider)
    } catch (error) {
      console.error('Authentication error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex items-center justify-center h-screen w-screen bg-gray-100'>
      <div className='flex flex-col items-center justify-center gap-5 p-8 bg-white rounded-lg shadow-md'>
        <h1 className='text-2xl font-bold mb-4 text-gray-400'>Sign Up</h1>
        <button
          className='w-full rounded-full p-3 bg-gray-800 text-white font-bold text-lg hover:bg-gray-700 transition-colors disabled:opacity-50'
          onClick={() => handleSignIn('github')}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Login with GitHub'}
        </button>
        <button
          className='w-full rounded-full p-3 bg-blue-500 text-white font-bold text-lg hover:bg-blue-600 transition-colors disabled:opacity-50'
          onClick={() => handleSignIn('google')}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Login with Google'}
        </button>
      </div>
    </div>
  )
}

export default SignUp