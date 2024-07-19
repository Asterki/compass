import * as React from 'react'

import Head from 'next/head'

import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

import NavbarComponent from '@/components/layout/navbar'
import NoteViewer from '@/components/notes/viewer'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faBold,
    faCode,
    faHeading,
    faImage,
    faItalic,
    faLink,
    faList,
    faTableCells,
    faUnderline
} from '@fortawesome/free-solid-svg-icons'

import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })

import { Note } from '@/services/notes'
import Button from '@/components/button'

const NotesEditPage = () => {
    const router = useRouter()
    const params = useParams()

    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            router.push('/auth/access')
        }
    })

    const editorRef = React.useRef<HTMLTextAreaElement>(null)
    const [editorContent, setEditorContent] = React.useState<string>('')

    const addToContent = (content: string) => {
        if (editorRef.current !== null) {
            const editor = editorRef.current
            const start = editor.selectionStart
            const end = editor.selectionEnd

            const textInBetween = editor.value.substring(start, end)

            const before = editor.value.substring(0, start)
            const after = editor.value.substring(end)

            let cursorPos = 0

            // Add the text in between if it exists
            if (textInBetween.length > 0) {
                editor.value = before + content.split('{cursor}')[0] + textInBetween + content.split('{cursor}')[1]
                cursorPos = content.split('{cursor}')[0].length + textInBetween.length
            } else {
                editor.value = before + content.split('{cursor}').join('') + after
                cursorPos = content.split('{cursor}')[0].length
            }

            // Set the cursor to the correct position
            editor.selectionStart = start + cursorPos
            editor.selectionEnd = start + cursorPos

            editor.focus()
            setEditorContent(editor.value)
        }
    }

    const updateNote = async () => {
        if (status == 'authenticated') {
            try {
                const response = await fetch('/api/notes/update', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        noteId: params.id,
                        title: 'Test Note',
                        tags: [],
                        content: editorContent,
                        archived: false
                    })
                })

                if (response.ok) {
                    const responseBody = await response.json()
                    console.log(responseBody.note)
                } else {
                    const errorBody = await response.json()
                    console.error('Error response:', errorBody)
                }
            } catch (error) {
                console.error('Fetch error:', error)
            }
        }
    }

    const [note, setNote] = React.useState<Note | null>(null)

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
                        setEditorContent(responseBody.note.content)
                        editorRef.current!.focus()
                        editorRef.current!.value = responseBody.note.content.replaceAll(
                            /\\n/g,
                            `
`
                        )
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
                <title>Notes | Class Compass</title>
            </Head>

            {status == 'loading' && 'Loading...'}

            {status == 'authenticated' && session.user !== undefined && (
                <main className="flex w-full flex-col items-center justify-between">
                    <NavbarComponent session={session} />

                    <Button variant='secondary' onClick={updateNote}>Save</Button>

                    <div className="flex w-full items-start justify-between">
                        <div className="flex w-1/2 gap-2 p-4">
                            <div className="flex flex-col gap-2 p-4">
                                <FontAwesomeIcon
                                    icon={faHeading}
                                    className="h-4 w-4 rounded-full p-2 text-2xl transition-all hover:bg-white/20"
                                    onClick={() => addToContent('# {cursor}')}
                                />
                                <FontAwesomeIcon
                                    icon={faTableCells}
                                    className="h-4 w-4 rounded-full p-2 text-2xl transition-all hover:bg-white/20"
                                    onClick={() =>
                                        addToContent(
                                            '| Column 1 | Column 2 |\n| --- | --- |\n| Data 1 | Data 2 | {cursor}'
                                        )
                                    }
                                />
                                <FontAwesomeIcon
                                    icon={faList}
                                    className="h-4 w-4 rounded-full p-2 text-2xl transition-all hover:bg-white/20"
                                    onClick={() => addToContent('- {cursor}')}
                                />
                                <FontAwesomeIcon
                                    icon={faBold}
                                    className="h-4 w-4 rounded-full p-2 text-2xl transition-all hover:bg-white/20"
                                    onClick={() => addToContent('**{cursor}**')}
                                />
                                <FontAwesomeIcon
                                    icon={faItalic}
                                    className="h-4 w-4 rounded-full p-2 text-2xl transition-all hover:bg-white/20"
                                    onClick={() => addToContent('*{cursor}*')}
                                />
                                <FontAwesomeIcon
                                    icon={faUnderline}
                                    className="h-4 w-4 rounded-full p-2 text-2xl transition-all hover:bg-white/20"
                                    onClick={() => addToContent('__{cursor}__')}
                                />
                                <FontAwesomeIcon
                                    icon={faCode}
                                    className="h-4 w-4 rounded-full p-2 text-2xl transition-all hover:bg-white/20"
                                    onClick={() => addToContent('```\n{cursor}\n')}
                                />
                                <FontAwesomeIcon
                                    icon={faImage}
                                    className="h-4 w-4 rounded-full p-2 text-2xl transition-all hover:bg-white/20"
                                    onClick={() => addToContent('![{cursor}]()')}
                                />
                                <FontAwesomeIcon
                                    icon={faLink}
                                    className="h-4 w-4 rounded-full p-2 text-2xl transition-all hover:bg-white/20"
                                    onClick={() => addToContent('[{cursor}]()')}
                                />
                            </div>

                            <div className="w-full">
                                <h1 className="text-2xl">Editor</h1>
                                <hr />
                                <textarea
                                    placeholder="Start typing your note here..."
                                    ref={editorRef}
                                    className="h-96 w-full rounded-md border border-gray-300 bg-white p-4 dark:border-slate-700 dark:bg-slate-800"
                                    onChange={e => setEditorContent(e.target.value)}
                                ></textarea>
                            </div>
                        </div>

                        <div className="flex w-1/2 flex-col p-4">
                            <h1 className="text-2xl">Preview</h1>

                            <hr />

                            <NoteViewer
                                note={{
                                    attachments: [],
                                    content: editorContent,
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
