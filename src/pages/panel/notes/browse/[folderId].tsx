import * as React from 'react'

import Head from 'next/head'
import NavbarComponent from '@/components/layout/navbar'
import Button from '@/components/button'
import * as Collapsible from '@radix-ui/react-collapsible'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faChevronCircleDown,
    faFileCirclePlus,
    faFolder,
    faFolderPlus,
    faHome,
    faNoteSticky
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
                                        className="h-4 w-4 cursor-pointer rounded-full p-2 transition-all hover:bg-white/20"
                                        onClick={() => router.push('/panel/notes/browse')}
                                    />
                                    <h1 className="text-3xl font-bold">{folder.name}</h1>
                                </div>
                            </div>
                        )}

                        {itemsInFolder && (
                            <div>
                                <Collapsible.Root defaultOpen={true}>
                                    <Collapsible.Trigger className="group mt-4 flex w-full items-center justify-between gap-2 rounded-md bg-slate-800 p-2">
                                        <div className="flex items-center justify-center">
                                            <FontAwesomeIcon
                                                icon={faChevronCircleDown}
                                                className="h-4 w-4 cursor-pointer rounded-full p-2 transition-all hover:bg-white/20 group-data-[state=open]:rotate-180"
                                            />
                                            <h2>Folders</h2>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <FontAwesomeIcon
                                                icon={faFolderPlus}
                                                className="h-4 w-4 cursor-pointer rounded-full p-2 transition-all hover:bg-white/20"
                                            />
                                        </div>
                                    </Collapsible.Trigger>
                                    <Collapsible.Content className="-mt-2 w-full border-2 rounded-md border-slate-800 p-2 pt-4">
                                        <ul>
                                            {itemsInFolder.folders.map(folder => (
                                                <div
                                                    key={`${folder.name}-${folder.name}`}
                                                    className="group flex w-full cursor-pointer items-center justify-between rounded-md bg-slate-800 p-2 transition-all hover:bg-slate-700"
                                                    onClick={() => router.push(`/panel/notes/browse/${folder.id}`)}
                                                >
                                                    <div>
                                                        <FontAwesomeIcon icon={faFolder} className="mr-2 fill-white" />
                                                        {folder.name}
                                                    </div>
                                                </div>
                                            ))}
                                            {itemsInFolder.folders.length == 0 && (
                                                <div className="flex w-full items-center justify-center rounded-md bg-slate-800 p-2">
                                                    No folders in this folder
                                                </div>
                                            )}
                                        </ul>
                                    </Collapsible.Content>
                                </Collapsible.Root>

                                <Collapsible.Root defaultOpen={true}>
                                    <Collapsible.Trigger className="group mt-4 flex w-full items-center justify-between gap-2 rounded-md bg-slate-800 p-2">
                                        <div className="flex items-center justify-center">
                                            <FontAwesomeIcon
                                                icon={faChevronCircleDown}
                                                className="h-4 w-4 cursor-pointer rounded-full p-2 transition-all hover:bg-white/20 group-data-[state=open]:rotate-180"
                                            />
                                            <h2>Notes</h2>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <FontAwesomeIcon
                                                icon={faFileCirclePlus}
                                                className="h-4 w-4 cursor-pointer rounded-full p-2 transition-all hover:bg-white/20"
                                            />
                                        </div>
                                    </Collapsible.Trigger>
                                    <Collapsible.Content className="-mt-2 w-full border-2 rounded-md border-slate-800 p-2 pt-4">
                                        <ul>
                                            {itemsInFolder.notes.map(note => (
                                                <div
                                                    key={`${note.title}-${note.title}`}
                                                    className="group flex w-full cursor-pointer items-center justify-between rounded-md bg-slate-800 p-2 transition-all hover:bg-slate-700"
                                                    onClick={() => router.push(`/panel/notes/view/${note.id}`)}
                                                >
                                                    <div>
                                                        <FontAwesomeIcon
                                                            icon={faNoteSticky}
                                                            className="mr-2 fill-white"
                                                        />
                                                        {note.title}
                                                    </div>
                                                </div>
                                            ))}
                                            {itemsInFolder.notes.length == 0 && (
                                                <div className="flex w-full items-center justify-center rounded-md bg-slate-800 p-2">
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
