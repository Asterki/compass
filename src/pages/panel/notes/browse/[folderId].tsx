import * as React from 'react'

import Head from 'next/head'
import NavbarComponent from '@/components/layout/navbar'
import Button from '@/components/ui/button'
import DialogComponent from '@/components/ui/dialog'
import InputComponent from '@/components/ui/input'
import Alert from '@/components/ui/alert'
import * as Collapsible from '@radix-ui/react-collapsible'
import * as ContextMenu from '@radix-ui/react-context-menu'

import { z, ZodError } from 'zod'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faChevronCircleDown,
    faFileCirclePlus,
    faFolder,
    faFolderPlus,
    faHome,
    faPencil,
    faStickyNote,
    faTerminal,
    faTrash
} from '@fortawesome/free-solid-svg-icons'

import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })

import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'

import { Note } from '@/services/notes'
import { Folder } from '@/services/folders'

const NotesBrowsePage = () => {
    const router = useRouter()
    const params = useParams()
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            router.push('/auth/access')
        }
    })

    const [itemsInFolder, setIntemsInFolder] = React.useState<{
        notes: Note[]
        folders: Folder[]
    } | null>(null)
    const [folder, setFolder] = React.useState<Folder | null>(null)

    const [alertState, setAlertState] = React.useState({
        open: false,
        text: '',
        variant: 'info' as 'info' | 'destructive' | 'warning' | 'success'
    })

    const [editNoteState, setEditNoteState] = React.useState({
        content: '',
        dialogOpen: false
    })

    const [deleteNoteDialogOpen, setDeleteNoteDialogOpen] = React.useState(false)

    const [editFolderState, setEditFolderState] = React.useState({
        name: '',
        dialogOpen: false
    })

    const [deleteFolderDialogOpen, setDeleteFolderDialogOpen] = React.useState(false)

    const showAlertFor = (seconds: number) => {
        setAlertState({ ...alertState, open: true })
        setTimeout(() => {
            setAlertState({ ...alertState, open: false })
        }, seconds * 1000)
    }

    const [newFolderState, setNewFolderState] = React.useState({
        name: '',
        dialogOpen: false
    })

    const [newNoteState, setNewNoteState] = React.useState({
        title: '',
        content: '',
        dialogOpen: false
    })

    const updateFoldersAndNotes = async () => {
        if (status == 'authenticated') {
            // Fetch the folder
            const responseFolder = await fetch('/api/folder/get', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    folderId: params.folderId || `${(session as any).id}-rootfd`
                })
            })

            if (responseFolder.ok) {
                const responseBodyFolder = await responseFolder.json()
                setFolder(responseBodyFolder.folder)
            } else {
                const errorBodyFolder = await responseFolder.json()
                console.error('Error response:', errorBodyFolder)
            }

            // Fetch the contents of the folder
            const response = await fetch('/api/notes/browser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    parentFolderId: params.folderId || `${(session as any).id}-rootfd`
                })
            })

            if (response.ok) {
                const responseBody = await response.json()
                setIntemsInFolder(responseBody.result)
            } else {
                const errorBody = await response.json() // The folder doesn't exist
                if (errorBody.message == 'Folder not found') {
                    router.push('/panel/notes/browse')
                }
                console.error('Error response:', errorBody)
            }
        }
    }

    const createFolder = async (name: string) => {
        const folderNameSchema = z.string().min(1, { message: 'Give the folder a name' }).max(32, {
            message: 'Folder name is too long'
        })
        try {
            const parsed = folderNameSchema.parse(name)

            const response = await fetch('/api/folder/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: parsed,
                    parentFolderId: params.folderId || `${(session as any).id}-rootfd`
                })
            })

            if (response.ok) {
                const responseBody = await response.json()
                console.log('Folder created:', responseBody)
                updateFoldersAndNotes()
            }
        } catch (error: ZodError | any) {
            // Check if the error is a ZodError
            if (error instanceof ZodError) {
                setAlertState({ ...alertState, text: error.errors[0].message })
            } else {
                setAlertState({ ...alertState, text: 'Failed to create folder, unknown error' })
            }

            console.error('Error:', error)
            showAlertFor(5)
        }
    }

    const createNote = async (title: string, content: string) => {
        const noteSchema = z.object({
            title: z.string().min(1, { message: 'Give the note a title' }).max(32, {
                message: 'Note title is too long'
            }),
            content: z.string().min(1, { message: 'Give the note some content' }).max(10000, {
                message: 'Note content is too long'
            })
        })

        try {
            const parsed = noteSchema.parse({ title, content })

            const response = await fetch('/api/notes/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: parsed.title,
                    content: parsed.content,
                    parentFolderId: params.folderId || `${(session as any).id}-rootfd`
                })
            })

            if (response.ok) {
                const responseBody = await response.json()
                console.log('Note created:', responseBody)
                updateFoldersAndNotes()
            }
        } catch (error: ZodError | any) {
            // Check if the error is a ZodError
            if (error instanceof ZodError) {
                setAlertState({ ...alertState, text: error.errors[0].message })
            } else {
                setAlertState({ ...alertState, text: 'Failed to create note, unknown error' })
            }

            console.error('Error:', error)
            showAlertFor(5)
        }
    }

    React.useEffect(() => {
        updateFoldersAndNotes()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status, params, session])

    return (
        <div
            className={`flex min-h-screen w-full flex-col items-center justify-between ${inter.className} bg-purple-50 text-slate-700 dark:bg-slate-900 dark:text-slate-300`}
        >
            <Head>
                <title>Browse Notes | Compass</title>
            </Head>

            {status == 'loading' && 'Loading...'}

            {status == 'authenticated' && session.user !== undefined && (
                <main className="flex w-full flex-col items-center justify-between">
                    <NavbarComponent session={session} />

                    {/* New Folder Modal */}
                    <DialogComponent
                        dismissible={true}
                        open={newFolderState.dialogOpen}
                        title="Name the folder"
                        setOpen={() => {
                            setNewFolderState({ ...newFolderState, dialogOpen: false })
                        }}
                    >
                        <p>Give the folder a name</p>
                        <InputComponent
                            type="text"
                            placeholder="Folder name"
                            className="mt-2 w-full"
                            value={newFolderState.name}
                            onChange={e => setNewFolderState({ ...newFolderState, name: e.target.value })}
                        />

                        <Button
                            onClick={() => createFolder(newFolderState.name)}
                            variant="primary"
                            className="mt-2 w-full"
                        >
                            Create Folder
                        </Button>
                    </DialogComponent>

                    {/* New Note Modal */}
                    <DialogComponent
                        dismissible={true}
                        open={newNoteState.dialogOpen}
                        title="Name the note"
                        setOpen={() => {
                            setNewNoteState({ ...newNoteState, dialogOpen: false })
                        }}
                    >
                        <p>Give the note a title</p>
                        <InputComponent
                            type="text"
                            placeholder="Note title"
                            className="mt-2 w-full"
                            value={newNoteState.title}
                            onChange={e => setNewNoteState({ ...newNoteState, title: e.target.value })}
                        />

                        <Button
                            onClick={() => {
                                createNote(newNoteState.title, newNoteState.content)
                            }}
                            variant={
                                newNoteState.title.length > 0 && newNoteState.title.length < 32 ? 'primary' : 'disabled'
                            }
                            className="mt-2 w-full"
                        >
                            Create Note
                        </Button>
                    </DialogComponent>

                    {/* Browser  */}
                    <div className="w-11/12 md:w-9/12">
                        {folder && (
                            <div className="mt-2 flex items-center justify-between">
                                <div className="flex items-center justify-center gap-6">
                                    <FontAwesomeIcon
                                        icon={faHome}
                                        className="h-4 w-4 cursor-pointer rounded-full p-2 transition-all hover:bg-gray-400/20 dark:hover:bg-white/20"
                                        onClick={() => router.push('/panel/notes/browse')}
                                    />
                                    <h1 className="text-3xl font-bold">{folder.name}</h1>
                                </div>
                            </div>
                        )}

                        {itemsInFolder && (
                            <div>
                                {/* Folders */}
                                <Collapsible.Root defaultOpen={true}>
                                    <Collapsible.Trigger className="group mt-4 flex w-full items-center justify-between gap-2 rounded-md bg-gray-200 p-2 dark:bg-slate-800">
                                        <div className="flex w-full items-center justify-start">
                                            <FontAwesomeIcon
                                                icon={faChevronCircleDown}
                                                className="h-4 w-4 cursor-pointer rounded-full p-2 transition-all hover:bg-gray-400/20 group-data-[state=open]:rotate-180 dark:hover:bg-white/20"
                                            />
                                            <h2>Folders</h2>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <FontAwesomeIcon
                                                icon={faFolderPlus}
                                                onClick={() =>
                                                    setNewFolderState({
                                                        ...newFolderState,
                                                        dialogOpen: true
                                                    })
                                                }
                                                className="h-4 w-4 cursor-pointer rounded-full p-2 transition-all hover:bg-gray-400/20 dark:hover:bg-white/20"
                                            />
                                        </div>
                                    </Collapsible.Trigger>
                                    <Collapsible.Content className="border-gray-00 -mt-2 w-full rounded-md border-2 p-2 transition-all dark:border-slate-800">
                                        <ul>
                                            {itemsInFolder.folders.map(folder => (
                                                <div key={`${folder.name}-${folder.name}`}>
                                                    <ContextMenu.Root>
                                                        <ContextMenu.Trigger>
                                                            <div className="group mt-2 flex w-full cursor-pointer items-center justify-between rounded-md p-2 transition-all hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700">
                                                                <div
                                                                    className="flex w-full items-center justify-start"
                                                                    onClick={() =>
                                                                        router.push(`/panel/notes/browse/${folder.id}`)
                                                                    }
                                                                >
                                                                    <FontAwesomeIcon
                                                                        icon={faFolder}
                                                                        className="mr-2 fill-white"
                                                                    />
                                                                    {folder.name}
                                                                </div>

                                                                <div className="flex h-4 items-center justify-center gap-2 md:hidden md:group-hover:flex">
                                                                    <FontAwesomeIcon
                                                                        icon={faPencil}
                                                                        className="h-4 w-4 rounded-full fill-gray-200 p-2 hover:bg-gray-400/20 dark:fill-slate-700 dark:hover:bg-white/20"
                                                                    />
                                                                    <FontAwesomeIcon
                                                                        icon={faTrash}
                                                                        className="h-4 w-4 rounded-full fill-gray-200 p-2 transition-all hover:bg-gray-400/20 hover:text-red-500 dark:fill-slate-700 dark:hover:bg-white/20"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </ContextMenu.Trigger>
                                                        <ContextMenu.Portal>
                                                            <ContextMenu.Content className="flex gap-2 rounded-md bg-gray-200 p-2 dark:bg-slate-700">
                                                                <Button
                                                                    onClick={() =>
                                                                        router.push(`/panel/notes/browse/${folder.id}`)
                                                                    }
                                                                    variant="secondary"
                                                                >
                                                                    Open in new tab
                                                                </Button>
                                                                <Button
                                                                    onClick={() =>
                                                                        router.push(`/panel/notes/browse/${folder.id}`)
                                                                    }
                                                                    variant="secondary"
                                                                >
                                                                    Rename
                                                                </Button>
                                                                <Button
                                                                    onClick={() =>
                                                                        router.push(`/panel/notes/browse/${folder.id}`)
                                                                    }
                                                                    variant="destructive"
                                                                >
                                                                    Delete
                                                                </Button>

                                                                <ContextMenu.Arrow className="ml-4 fill-gray-200 dark:fill-slate-700" />
                                                            </ContextMenu.Content>
                                                        </ContextMenu.Portal>
                                                    </ContextMenu.Root>
                                                </div>
                                            ))}
                                            {itemsInFolder.folders.length == 0 && (
                                                <div className="border-gray-00 -mt-2 w-full rounded-md p-2 pt-4 dark:border-slate-800">
                                                    No folders in this folder
                                                </div>
                                            )}
                                        </ul>
                                    </Collapsible.Content>
                                </Collapsible.Root>

                                {/* Notes */}
                                <Collapsible.Root defaultOpen={true}>
                                    <Collapsible.Trigger className="group mt-4 flex w-full items-center justify-between gap-2 rounded-md bg-gray-200 p-2 dark:bg-slate-800">
                                        <div className="flex items-center justify-center">
                                            <FontAwesomeIcon
                                                icon={faChevronCircleDown}
                                                className="h-4 w-4 cursor-pointer rounded-full p-2 transition-all hover:bg-gray-400/20 group-data-[state=open]:rotate-180 dark:hover:bg-white/20"
                                            />
                                            <h2>Notes</h2>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <FontAwesomeIcon
                                                icon={faFileCirclePlus}
                                                onClick={() =>
                                                    setNewNoteState({
                                                        ...newNoteState,
                                                        dialogOpen: true
                                                    })
                                                }
                                                className="h-4 w-4 cursor-pointer rounded-full p-2 transition-all hover:bg-gray-400/20 dark:hover:bg-white/20"
                                            />
                                        </div>
                                    </Collapsible.Trigger>
                                    <Collapsible.Content className="border-gray-00 -mt-2 w-full rounded-md border-2 p-2 dark:border-slate-800">
                                        <ul>
                                            {itemsInFolder.notes.map(note => (
                                                <div key={`${note.id}-${note.title}`}>
                                                    <ContextMenu.Root>
                                                        <ContextMenu.Trigger>
                                                            <div className="group mt-2 flex w-full cursor-pointer items-center justify-between rounded-md p-2 transition-all hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700">
                                                                <div
                                                                    className="flex w-full items-center justify-start"
                                                                    onClick={() =>
                                                                        router.push(`/panel/notes/view/${note.id}`)
                                                                    }
                                                                >
                                                                    <FontAwesomeIcon
                                                                        icon={faStickyNote}
                                                                        className="mr-2 fill-white"
                                                                    />
                                                                    {note.title}
                                                                </div>

                                                                <div className="flex h-4 items-center justify-center gap-2 md:hidden md:group-hover:flex">
                                                                    <FontAwesomeIcon
                                                                        icon={faPencil}
                                                                        className="h-4 w-4 rounded-full fill-gray-200 p-2 hover:bg-gray-400/20 dark:fill-slate-700 dark:hover:bg-white/20"
                                                                    />
                                                                    <FontAwesomeIcon
                                                                        icon={faTerminal}
                                                                        className="h-4 w-4 rounded-full fill-gray-200 p-2 hover:bg-gray-400/20 dark:fill-slate-700 dark:hover:bg-white/20"
                                                                    />
                                                                    <FontAwesomeIcon
                                                                        icon={faTrash}
                                                                        className="h-4 w-4 rounded-full fill-gray-200 p-2 transition-all hover:bg-gray-400/20 hover:text-red-500 dark:fill-slate-700 dark:hover:bg-white/20"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </ContextMenu.Trigger>
                                                        <ContextMenu.Portal>
                                                            <ContextMenu.Content className="flex gap-2 rounded-md bg-gray-200 p-2 dark:bg-slate-700">
                                                                <Button
                                                                    onClick={() =>
                                                                        router.push(`/panel/notes/browse/${note.id}`)
                                                                    }
                                                                    variant="secondary"
                                                                >
                                                                    Open in new tab
                                                                </Button>
                                                                <Button
                                                                    onClick={() =>
                                                                        router.push(`/panel/notes/browse/${note.id}`)
                                                                    }
                                                                    variant="secondary"
                                                                >
                                                                    Rename
                                                                </Button>
                                                                <Button
                                                                    onClick={() =>
                                                                        router.push(`/panel/notes/browse/${note.id}`)
                                                                    }
                                                                    variant="destructive"
                                                                >
                                                                    Delete
                                                                </Button>

                                                                <ContextMenu.Arrow className="ml-4 fill-gray-200 dark:fill-slate-700" />
                                                            </ContextMenu.Content>
                                                        </ContextMenu.Portal>
                                                    </ContextMenu.Root>
                                                </div>
                                            ))}
                                            {itemsInFolder.notes.length == 0 && (
                                                <div className="border-gray-00 -mt-2 w-full rounded-md p-2 pt-4 dark:border-slate-800">
                                                    No notes in this folder
                                                </div>
                                            )}
                                        </ul>
                                    </Collapsible.Content>
                                </Collapsible.Root>
                            </div>
                        )}
                    </div>

                    <Alert variant={alertState.variant} showing={alertState.open}>
                        {alertState.text}
                    </Alert>
                </main>
            )}
        </div>
    )
}

export default NotesBrowsePage
