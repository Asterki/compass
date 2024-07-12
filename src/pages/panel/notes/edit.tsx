import * as React from 'react'

import Head from 'next/head'

import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

import NavbarComponent from '@/components/layout/navbar'
import NoteViewer from '@/components/notes/viewer'

import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })

const NotesEditPage = () => {
    const router = useRouter()
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            router.push('/auth/access')
        }
    })

    const editorRef = React.useRef<HTMLTextAreaElement>(null)
    const [noteContent, setNoteContent] = React.useState('')

    return (
        <div
            className={`flex min-h-screen w-full flex-col items-center justify-between ${inter.className} bg-purple-50 text-slate-700 dark:bg-slate-900 dark:text-slate-300`}
        >
            <Head>
                <title>Notes | Class Compass</title>
            </Head>

            {status == 'loading' && 'Loading...'}

            {status == 'authenticated' && session.user !== undefined && (
                <main className="flex w-full flex-col items-center justify-between">
                    <NavbarComponent session={session} />

                    <div className="flex w-full items-start justify-between">
                        <div className="flex w-1/2 flex-col p-4">
                            <textarea
                                ref={editorRef}
                                onChange={(e) => setNoteContent(e.target.value)}
                                name=""
                                id=""
                                className="h-96 w-full rounded-md border border-gray-300 bg-white p-4 dark:border-slate-700 dark:bg-slate-800"
                            ></textarea>
                        </div>

                        <div className="flex w-1/2 flex-col p-4">
                            <NoteViewer
                                note={{
                                    attachments: [],
                                    content: editorRef.current?.value as string,
                                    createdAt: new Date().toUTCString(),
                                    title: 'Test Note',
                                    tags: [],
                                    links: [],
                                    folder: 'null',
                                    user: 'session.user.',
                                    updatedAt: new Date().toISOString()
                                }}
                            />
                        </div>
                    </div>
                </main>
            )}
        </div>
    )
}

export default NotesEditPage
