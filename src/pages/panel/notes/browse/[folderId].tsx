import * as React from 'react'

import Head from 'next/head'
import NavbarComponent from '@/components/layout/navbar'
import Button from '@/components/button'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder, faNoteSticky } from '@fortawesome/free-solid-svg-icons'

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
    }, [status, params])

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

                    {/* Browser  */}
                    <div className="w-9/12">
                        {folder && (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <h1 className="text-3xl font-bold">{folder.name}</h1>
                                    <p>Created at. {(() => {
                                        const date = new Date(folder.created_at)
                                        return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`
                                    })()}</p>
                                </div>
                                <Button variant="success">Create note</Button>
                            </div>
                        )}

                        {itemsInFolder && (
                            <div>
                                <h2 className='mt-4'>Folders</h2>
                                <ul>
                                    {itemsInFolder.folders.map(folder => (
                                        <div
                                            key={`${folder.name}-${folder.name}`}
                                            className="group flex w-full cursor-pointer items-center justify-between rounded-md bg-slate-800 p-2"
                                            onClick={() => router.push(`/panel/notes/browse/${folder.id}`)}
                                        >
                                            <div>
                                                <FontAwesomeIcon icon={faFolder} className="mr-2 fill-white" />
                                                {folder.name}
                                            </div>
                                        </div>
                                    ))}
                                </ul>

                                <h2 className='mt-4'>Notes</h2>
                                <ul>
                                    {itemsInFolder.notes.map(note => (
                                        <div
                                            key={`${note.title}`}
                                            className="group flex w-full cursor-pointer items-center justify-between rounded-md bg-slate-800 p-2"
                                            onClick={() => router.push(`/panel/notes/view/${note.id}`)}
                                        >
                                            <div>
                                                <FontAwesomeIcon icon={faNoteSticky} className="mr-2 fill-white" />
                                                {note.title}
                                            </div>
                                        </div>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </main>
            )}
        </div>
    )
}

export default NotesBrowsePage
