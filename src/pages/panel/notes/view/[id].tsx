import * as React from 'react'

import Head from 'next/head'
import Link from 'next/link'

import NavbarComponent from '@/components/layout/navbar'
import Button from '@/components/ui/button'
import Dialog from '@/components/ui/dialog'

import NoteViewer from '@/components/notes/viewer'

import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })

import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import { Note } from '@/services/notes'
import { Folder } from '@/services/folders'

const ViewNoteById = () => {
    const router = useRouter()
    const params = useParams()

    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            router.push('/auth/access')
        }
    })

    const [note, setNote] = React.useState<(Note & { folder: Folder }) | null>(null)
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)

    const deleteCurrentNote = async () => {
        try {
            const response = await fetch('/api/notes/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    noteId: params.id
                })
            })

            if (response.ok) {
                const responseBody = await response.json()
                console.log(responseBody)

                router.push(`/panel/notes/browse/${note?.parent_folder_id}`)
            } else {
                const errorBody = await response.json()
                console.error('Error response:', errorBody)
            }
        } catch (error) {
            console.error('Fetch error:', error)
        }
    }

    React.useEffect(() => {
        if (status == 'authenticated') {
            ;(async () => {
                try {
                    const response = await fetch('/api/notes/get', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            noteId: params.id
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

                    {/* Delete Note Dialog */}
                    <Dialog
                        open={deleteDialogOpen}
                        dismissible={true}
                        setOpen={setDeleteDialogOpen}
                        title="Delete note"
                    >
                        <div className="flex flex-col items-start justify-start gap-4">
                            <p>Are you sure you want to delete this note?</p>
                            <div className="flex items-center justify-between gap-2">
                                <Button
                                    onClick={() => {
                                        setDeleteDialogOpen(false)
                                    }}
                                    variant={'secondary'}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={() => {
                                        deleteCurrentNote()
                                    }}
                                    variant={'destructive'}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </Dialog>

                    {note !== null && (
                        <div className="flex w-full flex-col items-center justify-around gap-4">
                            <div className="flex w-9/12 items-center justify-between gap-4">
                                <div className="flex flex-col items-start justify-start">
                                    <h1 className="text-3xl font-bold">
                                        <Link
                                            href={`/panel/notes/browse/${note.parent_folder_id}`}
                                            className="text-blue-400"
                                        >
                                            {note.folder.name}
                                        </Link>
                                        /{note?.title}
                                    </h1>
                                    <div className="flex items-center">
                                        ID: {params.id}, Created: {new Date(note.created_at).toLocaleString()}
                                        <br /> Tags: {note.tags.length !== 0 ? note.tags.join(', ') : 'None'}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between gap-2">
                                    <Button
                                        onClick={() => {
                                            router.push(`/panel/notes/edit/${params.id}`)
                                        }}
                                        variant={'primary'}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setDeleteDialogOpen(true)
                                        }}
                                        variant={'destructive'}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>

                            {note !== null && <NoteViewer note={note as Note} />}
                        </div>
                    )}
                </main>
            )}
        </div>
    )
}

export default ViewNoteById
