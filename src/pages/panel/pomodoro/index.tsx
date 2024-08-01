import * as React from 'react'

import Head from 'next/head'
import NavbarComponent from '@/components/layout/navbar'
import Button from '@/components/ui/button'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-solid-svg-icons'

import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })

import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

const PanelPomodoro = () => {
    const router = useRouter()
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            router.push('/auth/access')
        }
    })

    const [timerRunning, setTimerRunning] = React.useState(false)
    const [time, setTime] = React.useState(1500)
    const [typeTimer, setTypeTimer] = React.useState<"pomodoro" | "break" | "longbreak">("pomodoro")
    

    React.useEffect(() => {
        if (timerRunning) {
            const interval = setInterval(() => {
                setTime((time) => time - 1)
                if (time == 0) {
                    setTimerRunning(false)
                    setTypeTimer(typeTimer == "pomodoro" ? "break" : "pomodoro")
                    setTime(typeTimer == "pomodoro" ? 1500 : 900)
                }
            }, 1000)

            return () => clearInterval(interval)
        }
    }, [timerRunning])

    return (
        <div
            className={`flex min-h-screen w-full flex-col items-center justify-between ${inter.className} bg-purple-50 text-slate-700 dark:bg-slate-900 dark:text-slate-300`}
        >
            <Head>
                <title>Pomodoro | Compass</title>
            </Head>

            {status == 'loading' && 'Loading...'}

            {status == 'authenticated' && session.user !== undefined && (
                <main className="flex w-full flex-col items-center justify-between">
                    <NavbarComponent session={session} />

                    <p className="text-2xl">Pomodoro Timer</p>

                    <div className="flex gap-4">
                        <Button onClick={() => setTime(1500)} variant={timerRunning ? "disabled" : "primary"}>
                            Pomodoro
                        </Button>
                        <Button onClick={() => setTime(300)} variant={timerRunning ? "disabled" : "primary"}>
                            Short Break
                        </Button>
                        <Button onClick={() => setTime(900)} variant={timerRunning ? "disabled" : "primary"}>
                            Long Break
                        </Button>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-4 p-4">
                        <p className="text-4xl">
                            {Math.floor(time / 60)}:{time % 60 < 10 ? '0' : ''}
                            {time % 60}
                        </p>

                        <Button onClick={() => setTimerRunning(!timerRunning)} variant="success">
                            {timerRunning ? 'Stop' : 'Start'}
                        </Button>

                        <Button onClick={() => setTime(1500)} variant="destructive">
                            Reset
                        </Button>

                        <p className="text-xl">
                            {typeTimer == "pomodoro" ? "Pomodoro" : typeTimer == "break" ? "Short Break" : "Long Break"}

                        </p>
                    </div>
                </main>
            )}
        </div>
    )
}

export default PanelPomodoro
