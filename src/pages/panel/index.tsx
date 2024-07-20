import * as React from 'react'

import Head from 'next/head'
import NavbarComponent from '@/components/layout/navbar'
import Button from '@/components/button'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder, faNoteSticky, faStickyNote } from '@fortawesome/free-solid-svg-icons'

import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })

import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

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

    return (
        <div
            className={`flex min-h-screen w-full flex-col items-center justify-between ${inter.className} bg-purple-50 text-slate-700 dark:bg-slate-900 dark:text-slate-300`}
        >
            <Head>
                <title>Dashboard | Compass</title>
            </Head>

            {status == 'loading' && 'Loading...'}

            {status == 'authenticated' && session.user !== undefined && (
                <main className="flex w-full flex-col items-center justify-between">
                    <NavbarComponent session={session} />

                    <section className="p-4">
                        <Link
                            href={'/panel/notes/browse'}
                            className="flex cursor-pointer select-none flex-col items-center justify-center rounded-md bg-white/10 p-4 text-white transition-all hover:scale-105"
                        >
                            <FontAwesomeIcon icon={faStickyNote} className="fill-white text-8xl" />
                            <h1 className="text-xl font-bold">Notes</h1>
                        </Link>
                    </section>
                </main>
            )}
        </div>
    )
}

export default MainPage
