import * as React from 'react'

import Head from 'next/head'
import NavbarComponent from '@/components/layout/navbar'
import Button from '@/components/button'

import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })

import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

/**
 * The main page component.
 * Renders the main page content based on the user's session status.
 */
const MainPage = () => {
    const router = useRouter()
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            router.push('/auth/access')
        }
    })
    
    const createNewNote = async () => {
        try {
            const response = await fetch('/api/notes/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: 'New Note',
                    content: 'This is a new note.'
                })
            })

            if (response.ok) {
                const responseBody = await response.json() 
                console.log(responseBody)

                router.push(`/panel/notes/${responseBody.noteID}`) 
            } else {
                const errorBody = await response.json() 
                console.error('Error response:', errorBody)
            }
        } catch (error) {
            console.error('Fetch error:', error)
        }
    }

    return (
        <div
            className={`flex min-h-screen w-full flex-col items-center justify-between ${inter.className} bg-purple-50 text-slate-700 dark:bg-slate-900 dark:text-slate-300`}
        >
            <Head>
                <title>Dashboard | ClassCompass</title>
            </Head>

            {status == 'loading' && 'Loading...'}

            {status == 'authenticated' && session.user !== undefined && (
                <main className="flex w-full flex-col items-center justify-between">
                    <NavbarComponent session={session} />

                    <section>
                        <Button variant="primary" className="">
                            Go to the Marketplace
                        </Button>

                        <Button variant="success" onClick={() => createNewNote()}>
                            Create note
                        </Button>
                    </section>
                </main>
            )}
        </div>
    )
}

export default MainPage
