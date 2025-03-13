'use client'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from "sonner"

function SignUp() {
  // Always call all hooks at the top level, unconditionally
  const [isLoading, setIsLoading] = useState(false)
  const { data: session, status } = useSession()
  const router = useRouter()
  
  // Move all conditional logic inside useEffect
  useEffect(() => {
    // Check if authenticated and redirect
    if (status === 'authenticated') {
      toast.error('You are already logged in')
      router.push('/')
    }
  }, [status, router]) // Include router in dependencies

  // Handle sign-in
  const handleSignIn = async (provider: string) => {
    try {
      setIsLoading(true)
      await signIn(provider, { callbackUrl: '/' })
    } catch (error) {
      console.error('Authentication error:', error)
      toast.error('Authentication failed')
    } finally {
      setIsLoading(false)
    }
  }

  // Render loading state INSIDE the component return, not in conditional before it
  // This is the key fix - don't use early returns with hooks
  return (
    <div className='flex items-center justify-center h-screen w-screen bg-gray-100'>
      {status === 'loading' ? (
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900'></div>
      ) : (
        <div className='flex flex-col items-center justify-center gap-5 p-8 bg-white rounded-lg shadow-md'>
          <h1 className='text-2xl font-bold mb-4 text-gray-800'>Sign Up</h1>
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
      )}
    </div>
  )
}

export default SignUp