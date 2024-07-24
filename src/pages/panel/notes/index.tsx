import Head from 'next/head'
import * as React from 'react'

import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })

const NotesIndex = () => {
    const router = useRouter()
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            router.push('/auth/access')
        }
    })

    React.useEffect(() => {
        ;(async () => {
            if (status == 'authenticated') {
                const response = await fetch('/api/notes/browser', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        parentFolderId: `${(session as any).id}-rootfd`
                    })
                })

                if (response.ok) {
                    const responseBody = await response.json()
                    console.log(responseBody)

                    // router.push(`/panel/notes/${responseBody.noteID}`)
                } else {
                    const errorBody = await response.json()
                    console.error('Error response:', errorBody)
                }
            }
        })()
    }, [status])

    return (
        <div
            className={`flex min-h-screen w-full flex-col items-center justify-between ${inter.className} bg-purple-50 text-slate-700 dark:bg-slate-900 dark:text-slate-300`}
        >
            <Head>
                <title>Notes | Compass</title>
            </Head>

            {status == 'loading' && 'Loading...'}

            {status == 'authenticated' && session.user !== undefined && (
                <main className="flex w-full flex-col items-center justify-between">
                    <h1>ejwioq</h1>
                </main>
            )}
        </div>
    )
}

export default NotesIndex
