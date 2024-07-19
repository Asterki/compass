import * as React from 'react'

import Head from 'next/head'
import NavbarComponent from '@/components/layout/navbar'
import Button from '@/components/button'
import NoteViewer from "@/components/notes/viewer"

import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })

import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import { Note } from '@/services/notes'

const ViewNoteById = () => {
    const router = useRouter()
    const params = useParams()

    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            router.push('/auth/access')
        }
    })

    const [note, setNote] = React.useState<Note | null>(null)

    React.useEffect(() => {
        if (status == 'authenticated') {
            (async () => {
                try {
                    const response = await fetch('/api/notes/get', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            noteId: params.id,
                        })
                    })
    
                    if (response.ok) {
                        const responseBody = await response.json()
                        console.log(responseBody.note)

                        setNote(responseBody.note)
    
                        // router.push(`/panel/notes/${responseBody.noteID}`)
                    } else {
                        const errorBody = await response.json()
                        console.error('Error response:', errorBody)
                    }
                } catch (error) {
                    console.error('Fetch error:', error)
                }
            })()
        }
    }, [status])

    return (
        <div
            className={`flex min-h-screen w-full flex-col items-center justify-between ${inter.className} bg-purple-50 text-slate-700 dark:bg-slate-900 dark:text-slate-300`}
        >
            <Head>
                <title>View Note | Compass</title>
            </Head>

            {status == 'loading' && 'Loading...'}

            {status == 'authenticated' && session.user !== undefined && (
                <main className="flex w-full flex-col items-center justify-between">
                    <NavbarComponent session={session} />

                    {note !== null && <NoteViewer note={note as Note} />}

                    ewq

                    <h1>The requested note ID is: {params.id}</h1>
                </main>
            )}
        </div>
    )
}

export default ViewNoteById
