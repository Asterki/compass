import * as React from 'react'
import { useRouter } from 'next/navigation'

import { useSession } from 'next-auth/react'

import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })

const RedirectToRootFolder = () => {
    const router = useRouter()
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            router.push('/auth/access')
        }
    })

    React.useEffect(() => {
        if (status === 'authenticated' && status == "authenticated") {
            router.push(`/panel/notes/browse/${(session as any).id}-rootfd`)
        }
    }, [status])

    return (
        <div
            className={`flex min-h-screen w-full flex-col items-center justify-between ${inter.className} bg-purple-50 text-slate-700 dark:bg-slate-900 dark:text-slate-300`}
        >
            Redirecting...
        </div>
    )
}

export default RedirectToRootFolder
