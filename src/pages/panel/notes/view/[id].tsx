import * as React from 'react'

// Components
import Head from 'next/head'
import Link from 'next/link'
import NavbarComponent from '@/components/layout/navbar'
import Button from '@/components/ui/button'
import Dialog from '@/components/ui/dialog'
import Alert from '@/components/ui/alert'
import NoteViewer from '@/components/notes/viewer'

// Fonts
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })

// Next-Related
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'

// Types
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

    const showAlertFor = (seconds: number) => {
        setAlertOpen(true)
        setTimeout(() => {
            setAlertOpen(false)
        }, seconds * 1000)
    }

    const [note, setNote] = React.useState<(Note & { folder: Folder }) | null>(null)
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)

    const [alertOpen, setAlertOpen] = React.useState(false)
    const [alertText, setAlertText] = React.useState('')
    const [alertVariant, setAlertVariant] = React.useState<'info' | 'destructive' | 'warning' | 'success'>('info')

    const deleteCurrentNote = async () => {
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
            setAlertText('An error occurred while deleting the note. Please try again later.')
            setAlertVariant('destructive')
            showAlertFor(5)
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                            <div className="flex w-full items-center justify-end gap-2">
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
                        <div className="mt-2 flex w-full flex-col items-center justify-around gap-4">
                            <div className="flex w-11/12 flex-col items-center justify-between gap-4 border-b-2 border-b-white/20 md:w-9/12 md:flex-row lg:w-8/12">
                                <div className="flex flex-col items-start justify-center text-center md:justify-start md:text-left">
                                    <h1 className="w-full text-center text-3xl font-bold md:text-left">
                                        <Link
                                            href={`/panel/notes/browse/${note.parent_folder_id}`}
                                            className="text-blue-500 dark:text-blue-400"
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
                                <div className="mb-2 flex w-full items-center justify-center gap-2 md:mb-0 md:justify-end">
                                    <Button
                                        onClick={() => {
                                            router.push(`/panel/notes/edit/${params.id}`)
                                        }}
                                        variant={'primary'}
                                        className="w-5/12 md:w-auto"
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setDeleteDialogOpen(true)
                                        }}
                                        variant={'destructive'}
                                        className="w-5/12 md:w-auto"
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>

                            <div className="w-11/12 md:w-9/12 lg:w-8/12">
                                {note !== null && <NoteViewer note={note as Note} />}
                            </div>
                        </div>
                    )}

                    <Alert variant={alertVariant} showing={alertOpen}>
                        {alertText}
                    </Alert>
                </main>
            )}
        </div>
    )
}

export default ViewNoteById
