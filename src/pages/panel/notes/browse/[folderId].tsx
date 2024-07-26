import * as React from 'react'

import Head from 'next/head'
import NavbarComponent from '@/components/layout/navbar'
import Button from '@/components/ui/button'
import DialogComponent from '@/components/ui/dialog'
import InputComponent from '@/components/ui/input'
import Alert from '@/components/ui/alert'
import * as Collapsible from '@radix-ui/react-collapsible'
import * as ContextMenu from '@radix-ui/react-context-menu'

import { set, z, ZodError } from 'zod'

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
    const showAlert = (seconds: number, text: string, variant: 'info' | 'destructive' | 'warning' | 'success') => {
        setAlertState({ open: true, text, variant })
        setTimeout(() => {
            setAlertState({ open: false, text: '', variant: 'info' })
        }, seconds * 1000)
    }

    // Note-related states
    const [newNoteState, setNewNoteState] = React.useState({
        title: '',
        content: '',
        dialogOpen: false
    })
    const [editNoteNameState, setEditNoteState] = React.useState({
        content: '',
        dialogOpen: false
    })
    const [deleteNoteDialogState, setDeleteNoteDialogState] = React.useState({
        dialogOpen: false,
        noteId: ''
    })

    // Folder-related states
    const [editFolderNameState, setEditFolderNameState] = React.useState({
        name: '',
        dialogOpen: false
    })
    const [deleteFolderDialogState, setDeleteFolderDialogState] = React.useState({
        dialogOpen: false,
        folderId: ''
    })
    const [newFolderState, setNewFolderState] = React.useState({
        name: '',
        dialogOpen: false
    })

    // Fetch the folder and its contents
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

    // Folder-related functions
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
                updateFoldersAndNotes()
                setNewFolderState({ ...newFolderState, dialogOpen: false })
            }
        } catch (error: ZodError | any) {
            // Check if the error is a ZodError
            setAlertState({
                open: true,
                variant: 'destructive',
                text: error instanceof ZodError ? error.errors[0].message : 'Failed to create note, unknown error'
            })
        }

        setNewFolderState({ ...newFolderState, dialogOpen: false })
    }

    const deleteFolder = async (folderId: string) => {
        const response = await fetch('/api/folder/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                folderId: folderId
            })
        })

        if (response.ok) {
            updateFoldersAndNotes()
            showAlert(5, 'Folder deleted successfully', 'success')
        } else {
            showAlert(5, 'An error occurred while deleting the folder. Please try again later.', 'destructive')
        }

        setDeleteFolderDialogState({ ...deleteFolderDialogState, dialogOpen: false })
    }

    const editFolderName = async (folderId: string, newName: string) => {
        const folderNameSchema = z.string().min(1, { message: 'Give the folder a name' }).max(32, {
            message: 'Folder name is too long'
        })

        try {
            const parsed = folderNameSchema.parse(newName)

            const response = await fetch('/api/folder/edit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    folderId: folderId,
                    newName: parsed
                })
            })

            if (response.ok) {
                updateFoldersAndNotes()
                showAlert(5, 'Folder name edited successfully', 'success')
            }
        } catch (error: ZodError | any) {
            // Check if the error is a ZodError
            setAlertState({
                open: true,
                variant: 'destructive',
                text: error instanceof ZodError ? error.errors[0].message : 'Failed to create note, unknown error'
            })
        }

        setEditFolderNameState({ ...editFolderNameState, dialogOpen: false })
    }

    // Note-related functions
    const createNote = async (title: string, content?: string) => {
        const noteSchema = z.object({
            title: z.string().min(1, { message: 'Give the note a title' }).max(32, {
                message: 'Note title is too long'
            }),
            content: z
                .string()
                .min(1, { message: 'Give the note some content' })
                .max(10000, {
                    message: 'Note content is too long'
                })
                .optional()
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
                    content: parsed.content || 'Default Content',
                    parentFolderId: params.folderId || `${(session as any).id}-rootfd`
                })
            })

            if (response.ok) {
                updateFoldersAndNotes()
                showAlert(5, 'Note created successfully', 'success')
            }
        } catch (error: ZodError | any) {
            // Check if the error is a ZodError
            setAlertState({
                open: true,
                variant: 'destructive',
                text: error instanceof ZodError ? error.errors[0].message : 'Failed to create note, unknown error'
            })
        }

        setNewNoteState({ ...newNoteState, dialogOpen: false, content: '', title: '' })
    }

    const deleteNote = async (noteId: string) => {
        const response = await fetch('/api/notes/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                noteId: noteId
            })
        })

        if (response.ok) {
            updateFoldersAndNotes()
            showAlert(5, 'Note deleted successfully', 'success')
        } else {
            showAlert(5, 'An error occurred while deleting the note. Please try again later.', 'destructive')
        }

        setDeleteNoteDialogState({ ...deleteNoteDialogState, dialogOpen: false })
    }

    const editNoteName = async (noteId: string, newName: string) => {
        const noteNameSchema = z.string().min(1, { message: 'Give the note a title' }).max(32, {
            message: 'Note title is too long'
        })

        try {
            const parsed = noteNameSchema.parse(newName)

            const response = await fetch('/api/notes/edit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    noteId: noteId,
                    newName: parsed
                })
            })

            if (response.ok) {
                const responseBody = await response.json()
                console.log('Note edited:', responseBody)
                updateFoldersAndNotes()
            }
        } catch (error: ZodError | any) {
            // Check if the error is a ZodError
            setAlertState({
                open: true,
                variant: 'destructive',
                text: error instanceof ZodError ? error.errors[0].message : 'Failed to create note, unknown error'
            })
        }

        setEditNoteState({ ...editNoteNameState, dialogOpen: false })
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

                    {/* New Folder Dialog */}
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

                    {/* Delete Folder Dialog */}
                    <DialogComponent
                        dismissible={true}
                        open={deleteFolderDialogState.dialogOpen}
                        title="Delete Folder"
                        setOpen={() => {
                            setDeleteFolderDialogState({ ...deleteFolderDialogState, dialogOpen: false })
                        }}
                    >
                        <p>Are you sure you want to delete this folder?</p>
                        <div className="mt-4 flex w-full items-center justify-end gap-2">
                            <Button
                                onClick={() => {
                                    setDeleteFolderDialogState({ ...deleteFolderDialogState, dialogOpen: false })
                                }}
                                variant="secondary"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={() => {
                                    deleteFolder(deleteFolderDialogState.folderId)
                                }}
                                variant="destructive"
                            >
                                Delete
                            </Button>
                        </div>
                    </DialogComponent>

                    {/* Edit Folder Name Dialog */}
                    <DialogComponent
                        dismissible={true}
                        open={editFolderNameState.dialogOpen}
                        title="Edit Folder Name"
                        setOpen={() => {
                            setEditFolderNameState({ ...editFolderNameState, dialogOpen: false })
                        }}
                    >
                        <p>Give the folder a new name</p>
                        <InputComponent
                            type="text"
                            placeholder="Folder name"
                            className="mt-2 w-full"
                            onChange={e => setEditFolderNameState({ ...editFolderNameState, name: e.target.value })}
                        />

                        <Button
                            onClick={() => editFolderName(editFolderNameState.name, editFolderNameState.name)}
                            variant="primary"
                            className="mt-2 w-full"
                        >
                            Edit Folder Name
                        </Button>
                    </DialogComponent>

                    {/* New Note Dialog */}
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
                            onChange={e => setNewNoteState({ ...newNoteState, title: e.target.value })}
                        />

                        <p>Give the note some default content</p>
                        <textarea
                            placeholder="Note content (optional)"
                            className="border-2-dark mt-2 h-32 w-full rounded-md border-2 bg-gray-200 p-2 outline-none transition-all focus:border-blue-400 dark:border-slate-800 dark:bg-slate-800"
                            onChange={e => setNewNoteState({ ...newNoteState, content: e.target.value })}
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

                    {/* Delete Note Dialog */}
                    <DialogComponent
                        dismissible={true}
                        open={deleteNoteDialogState.dialogOpen}
                        title="Delete note"
                        setOpen={() => {
                            setDeleteNoteDialogState({ ...deleteNoteDialogState, dialogOpen: false })
                        }}
                    >
                        <p>Are you sure you want to delete this note?</p>
                        <div className="mt-4 flex w-full items-center justify-end gap-2">
                            <Button
                                onClick={() => {
                                    setDeleteNoteDialogState({ ...deleteNoteDialogState, dialogOpen: false })
                                }}
                                variant="secondary"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={() => {
                                    deleteNote(deleteNoteDialogState.noteId)
                                }}
                                variant="destructive"
                            >
                                Delete
                            </Button>
                        </div>
                    </DialogComponent>

                    {/* Edit Note Name Dialog */}
                    <DialogComponent
                        dismissible={true}
                        open={editNoteNameState.dialogOpen}
                        title="Edit Note Name"
                        setOpen={() => {
                            setEditNoteState({ ...editNoteNameState, dialogOpen: false })
                        }}
                    >
                        <p>Give the note a new title</p>
                        <InputComponent
                            type="text"
                            placeholder="Note title"
                            className="mt-2 w-full"
                            onChange={e => setEditNoteState({ ...editNoteNameState, content: e.target.value })}
                        />

                        <Button
                            onClick={() => editNoteName(editNoteNameState.content, editNoteNameState.content)}
                            variant="primary"
                            className="mt-2 w-full"
                        >
                            Edit Note Name
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
                                                                        onClick={() => {
                                                                            setEditFolderNameState({
                                                                                dialogOpen: true,
                                                                                name: folder.name
                                                                            })
                                                                        }}
                                                                        className="h-4 w-4 rounded-full fill-gray-200 p-2 hover:bg-gray-400/20 dark:fill-slate-700 dark:hover:bg-white/20"
                                                                    />
                                                                    <FontAwesomeIcon
                                                                        icon={faTrash}
                                                                        onClick={() => {
                                                                            setDeleteFolderDialogState({
                                                                                dialogOpen: true,
                                                                                folderId: folder.id
                                                                            })
                                                                        }}
                                                                        className="h-4 w-4 rounded-full fill-gray-200 p-2 transition-all hover:bg-gray-400/20 hover:text-red-500 dark:fill-slate-700 dark:hover:bg-white/20"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </ContextMenu.Trigger>
                                                        <ContextMenu.Portal>
                                                            <ContextMenu.Content className="flex gap-2 rounded-md bg-gray-200 p-2 dark:bg-slate-700">
                                                                <Button
                                                                    onClick={() => {
                                                                        var win = window.open(
                                                                            `/panel/notes/browse/${folder.id}`,
                                                                            '_blank'
                                                                        )
                                                                        win!.focus()
                                                                    }}
                                                                    variant="secondary"
                                                                >
                                                                    Open in new tab
                                                                </Button>
                                                                <Button
                                                                    onClick={() =>
                                                                        setEditFolderNameState({
                                                                            dialogOpen: true,
                                                                            name: folder.name
                                                                        })
                                                                    }
                                                                    variant="secondary"
                                                                >
                                                                    Rename
                                                                </Button>
                                                                <Button
                                                                    onClick={() => {
                                                                        setDeleteFolderDialogState({
                                                                            dialogOpen: true,
                                                                            folderId: folder.id
                                                                        })
                                                                    }}
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
                                                                        onClick={() => {
                                                                            router.push(`/panel/notes/edit/${note.id}`)
                                                                        }}
                                                                        className="h-4 w-4 rounded-full fill-gray-200 p-2 hover:bg-gray-400/20 dark:fill-slate-700 dark:hover:bg-white/20"
                                                                    />
                                                                    <FontAwesomeIcon
                                                                        icon={faTerminal}
                                                                        onClick={() => {
                                                                            setEditNoteState({
                                                                                dialogOpen: true,
                                                                                content: note.title
                                                                            })
                                                                        }}
                                                                        className="h-4 w-4 rounded-full fill-gray-200 p-2 hover:bg-gray-400/20 dark:fill-slate-700 dark:hover:bg-white/20"
                                                                    />
                                                                    <FontAwesomeIcon
                                                                        icon={faTrash}
                                                                        onClick={() => {
                                                                            setDeleteNoteDialogState({
                                                                                dialogOpen: true,
                                                                                noteId: note.id
                                                                            })
                                                                        }}
                                                                        className="h-4 w-4 rounded-full fill-gray-200 p-2 transition-all hover:bg-gray-400/20 hover:text-red-500 dark:fill-slate-700 dark:hover:bg-white/20"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </ContextMenu.Trigger>
                                                        <ContextMenu.Portal>
                                                            <ContextMenu.Content className="flex gap-2 rounded-md bg-gray-200 p-2 dark:bg-slate-700">
                                                                <Button
                                                                    onClick={() => {
                                                                        var win = window.open(
                                                                            `/panel/notes/view/${note.id}`,
                                                                            '_blank'
                                                                        )
                                                                        win!.focus()
                                                                    }}
                                                                    variant="secondary"
                                                                >
                                                                    Open in new tab
                                                                </Button>
                                                                <Button
                                                                    onClick={() =>
                                                                        setEditNoteState({
                                                                            dialogOpen: true,
                                                                            content: note.title
                                                                        })
                                                                    }
                                                                    variant="secondary"
                                                                >
                                                                    Rename
                                                                </Button>
                                                                <Button
                                                                    onClick={() =>
                                                                        setDeleteNoteDialogState({
                                                                            dialogOpen: true,
                                                                            noteId: note.id
                                                                        })
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
