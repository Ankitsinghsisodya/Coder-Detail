'use client'
import { SessionProvider } from 'next-auth/react'
import React from 'react'
interface Props {
    children: React.ReactNode
    session?: any
}
function SessionProviderWrapper({ children, session }: Props) {
    return (
        <SessionProvider session={session}>{children}</SessionProvider>
    )
}

export default SessionProviderWrapper
