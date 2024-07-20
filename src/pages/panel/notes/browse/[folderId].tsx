import * as React from 'react'

import Head from 'next/head'
import NavbarComponent from '@/components/layout/navbar'
import Button from '@/components/button'
import * as Collapsible from '@radix-ui/react-collapsible'
import * as ContextMenu from '@radix-ui/react-context-menu'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faChevronCircleDown,
    faFileCirclePlus,
    faFolder,
    faFolderPlus,
    faHome,
    faNoteSticky,
    faPencil,
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

    React.useEffect(() => {
        ;(async () => {
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
                    const errorBody = await response.json()
                    console.error('Error response:', errorBody)
                }
            }
        })()
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
                                        <div className="flex items-center justify-center">
                                            <FontAwesomeIcon
                                                icon={faChevronCircleDown}
                                                className="h-4 w-4 cursor-pointer rounded-full p-2 transition-all hover:bg-gray-400/20 group-data-[state=open]:rotate-180 dark:hover:bg-white/20"
                                            />
                                            <h2>Folders</h2>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <FontAwesomeIcon
                                                icon={faFolderPlus}
                                                className="h-4 w-4 cursor-pointer rounded-full p-2 transition-all hover:bg-gray-400/20 dark:hover:bg-white/20"
                                            />
                                        </div>
                                    </Collapsible.Trigger>
                                    <Collapsible.Content className="border-gray-00 -mt-2 w-full rounded-md border-2 p-2 pt-4 dark:border-slate-800">
                                        <ul>
                                            {itemsInFolder.folders.map(folder => (
                                                <div key={`${folder.name}-${folder.name}`}>
                                                    <ContextMenu.Root>
                                                        <ContextMenu.Trigger>
                                                            <Collapsible.Trigger
                                                                className="group flex w-full cursor-pointer items-center justify-between rounded-md p-2 transition-all hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700"
                                                                onClick={() =>
                                                                    router.push(`/panel/notes/browse/${folder.id}`)
                                                                }
                                                            >
                                                                <div className="flex-items-center justify-center">
                                                                    <FontAwesomeIcon
                                                                        icon={faFolder}
                                                                        className="mr-2 fill-white"
                                                                    />
                                                                    {folder.name}
                                                                </div>

                                                                <div className="items-center justify-center gap-2 md:group-hover:flex md:hidden h-4 flex">
                                                                    <FontAwesomeIcon
                                                                        icon={faPencil}
                                                                        className="h-4 w-4 rounded-full fill-gray-200 p-2 hover:bg-gray-400/20 dark:fill-slate-700 dark:hover:bg-white/20"
                                                                    />
                                                                    <FontAwesomeIcon
                                                                        icon={faTrash}
                                                                        className="h-4 w-4 rounded-full fill-gray-200 p-2 transition-all hover:bg-gray-400/20 hover:text-red-500 dark:fill-slate-700 dark:hover:bg-white/20"
                                                                    />
                                                                </div>
                                                            </Collapsible.Trigger>
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
                                                className="h-4 w-4 cursor-pointer rounded-full p-2 transition-all hover:bg-gray-400/20 dark:hover:bg-white/20"
                                            />
                                        </div>
                                    </Collapsible.Trigger>
                                    <Collapsible.Content className="border-gray-00 -mt-2 w-full rounded-md border-2 p-2 pt-4 dark:border-slate-800">
                                        <ul>
                                            {itemsInFolder.notes.map(note => (
                                                <div key={`${note.id}-${note.title}`}>
                                                    <ContextMenu.Root>
                                                        <ContextMenu.Trigger>
                                                            <Collapsible.Trigger
                                                                className="group flex w-full cursor-pointer items-center justify-between rounded-md p-2 transition-all hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700"
                                                                onClick={() =>
                                                                    router.push(`/panel/notes/browse/${note.id}`)
                                                                }
                                                            >
                                                                <div className="flex-items-center justify-center">
                                                                    <FontAwesomeIcon
                                                                        icon={faFolder}
                                                                        className="mr-2 fill-white"
                                                                    />
                                                                    {note.title}
                                                                </div>

                                                                <div className="items-center justify-center gap-2 md:group-hover:flex md:hidden h-4 flex">
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
                                                            </Collapsible.Trigger>
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
                </main>
            )}
        </div>
    )
}

export default NotesBrowsePage
