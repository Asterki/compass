import * as React from 'react'

import Head from 'next/head'
import NavbarComponent from '@/components/layout/navbar'
import Button from '@/components/ui/button'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faBell,
    faBook,
    faCalendarAlt,
    faClock,
    faEgg,
    faGraduationCap,
    faMoneyBill1Wave,
    faShip,
    faStickyNote,
    faTasks
} from '@fortawesome/free-solid-svg-icons'

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

                    <section className="flex flex-col flex-wrap items-center justify-center gap-4 p-4 md:flex-row md:items-stretch">
                        <Link
                            href={'/panel/notes/browse'}
                            className="flex w-11/12 cursor-pointer select-none flex-col items-center justify-center rounded-md bg-white/10 p-4 text-center text-white transition-all hover:scale-105 md:w-3/12"
                        >
                            <FontAwesomeIcon icon={faStickyNote} className="fill-white text-8xl" />
                            <h1 className="text-xl font-bold">Notes</h1>
                            <p className="text-white/80">Access your notes and create new ones.</p>
                        </Link>

                        <Link
                            href={'/panel/calendar'}
                            className="flex w-11/12 cursor-pointer select-none flex-col items-center justify-center rounded-md bg-white/10 p-4 text-center text-white transition-all hover:scale-105 md:w-3/12"
                        >
                            <FontAwesomeIcon icon={faCalendarAlt} className="fill-white text-8xl" />
                            <h1 className="text-xl font-bold">Calendar</h1>
                            <p className="text-white/80">View your calendar and schedule events.</p>
                        </Link>

                        <Link
                            href={'/panel/tasks'}
                            className="flex w-11/12 cursor-pointer select-none flex-col items-center justify-center rounded-md bg-white/10 p-4 text-center text-white transition-all hover:scale-105 md:w-3/12"
                        >
                            <FontAwesomeIcon icon={faTasks} className="fill-white text-8xl" />
                            <h1 className="text-xl font-bold">Tasks</h1>
                            <p className="text-white/80">Manage your tasks and to-do lists.</p>
                        </Link>

                        <Link
                            href={'/panel/recipes'}
                            className="flex w-11/12 cursor-pointer select-none flex-col items-center justify-center rounded-md bg-white/10 p-4 text-center text-white transition-all hover:scale-105 md:w-3/12"
                        >
                            <FontAwesomeIcon icon={faEgg} className="fill-white text-8xl" />
                            <h1 className="text-xl font-bold">Recipes</h1>
                            <p className="text-white/80">Access your cooking recipes and create new ones.</p>
                        </Link>

                        <Link
                            href={'/panel/school'}
                            className="flex w-11/12 cursor-pointer select-none flex-col items-center justify-center rounded-md bg-white/10 p-4 text-center text-white transition-all hover:scale-105 md:w-3/12"
                        >
                            <FontAwesomeIcon icon={faGraduationCap} className="fill-white text-8xl" />
                            <h1 className="text-xl font-bold">School Dashboard</h1>
                            <p className="text-white/80">Access your school dashboard and manage your courses.</p>
                        </Link>

                        <Link
                            href={'/panel/reminders'}
                            className="flex w-11/12 cursor-pointer select-none flex-col items-center justify-center rounded-md bg-white/10 p-4 text-center text-white transition-all hover:scale-105 md:w-3/12"
                        >
                            <FontAwesomeIcon icon={faBell} className="fill-white text-8xl" />
                            <h1 className="text-xl font-bold">Reminders</h1>
                            <p className="text-white/80">Access your reminders and create new ones.</p>
                        </Link>

                        <Link
                            href={'/panel/pomodoro'}
                            className="flex w-11/12 cursor-pointer select-none flex-col items-center justify-center rounded-md bg-white/10 p-4 text-center text-white transition-all hover:scale-105 md:w-3/12"
                        >
                            <FontAwesomeIcon icon={faClock} className="fill-white text-8xl" />
                            <h1 className="text-xl font-bold">Pomodoro</h1>
                            <p className="text-white/80">Access your pomodoro timer and manage your sessions.</p>
                        </Link>

                        <Link
                            href={'/panel/goals'}
                            className="flex w-11/12 cursor-pointer select-none flex-col items-center justify-center rounded-md bg-white/10 p-4 text-center text-white transition-all hover:scale-105 md:w-3/12"
                        >
                            <FontAwesomeIcon icon={faShip} className="fill-white text-8xl" />
                            <h1 className="text-xl font-bold">Goal Setting</h1>
                            <p className="text-white/80">Access your goal setting dashboard and manage your goals.</p>
                        </Link>

                        <Link
                            href={'/panel/books'}
                            className="flex w-11/12 cursor-pointer select-none flex-col items-center justify-center rounded-md bg-white/10 p-4 text-center text-white transition-all hover:scale-105 md:w-3/12"
                        >
                            <FontAwesomeIcon icon={faBook} className="fill-white text-8xl" />
                            <h1 className="text-xl font-bold">Book Manager</h1>
                            <p className="text-white/80">Access your book manager and manage your reading list.</p>
                        </Link>

                        <Link
                            href={'/panel/expenses'}
                            className="flex w-11/12 cursor-pointer select-none flex-col items-center justify-center rounded-md bg-white/10 p-4 text-center text-white transition-all hover:scale-105 md:w-3/12"
                        >
                            <FontAwesomeIcon icon={faMoneyBill1Wave} className="fill-white text-8xl" />
                            <h1 className="text-xl font-bold">Expense Record</h1>
                            <p className="text-white/80">Access your expense record and manage your finances.</p>
                        </Link>
                    </section>

                    <footer className="flex w-full items-center justify-center p-4">
                        <Button onClick={() => router.push('/panel/settings')} variant="secondary">
                            Manage Sections
                        </Button>
                    </footer>
                </main>
            )}
        </div>
    )
}

export default MainPage
