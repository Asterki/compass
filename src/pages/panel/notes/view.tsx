import Head from 'next/head'

import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

import NavbarComponent from '@/components/layout/navbar'
import NoteViewer from '@/components/notes/viewer'

import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })

const NotesViewPage = () => {
    const router = useRouter()
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            router.push('/auth/access')
        }
    })

    const tempNote = {
        title: 'Some title',
        content:
            '# Lorem, ipsum dolor sit amet\n## consectetur adipisicing elit. Repellendus quod a nobis.\nLibero dicta et dolore sapiente possimus non alias ratione illum, vero distinctio,\ncumque deleniti necessitatibus accusantium recusandae atque voluptas. Cum laboriosam\n## incidunt numquam, atque expedita voluptate \nnesciunt repellat non consequuntur aspernatur ab cumque. Adipisci deserunt perspiciatis voluptates nulla, itaque ipsa quas tempora,\nquaerat minima corporis sed nam repellendus officiis, vitae explicabo. Ab totam ipsum\nlabore laboriosam repellat odit quo minima qui, adipisci corrupti aspernatur nam tempora\nfugit eligendi expedita minus repudiandae dolor quibusdam iusto provident. Ratione\nveniam saepe voluptate maiores earum quo voluptatibus ex pariatur? Dignissimos eius\nnihil, doloribus in quae quam, earum minus corrupti ratione molestias quos obcaecati\nfacere, veritatis aliquid fugiat iure nulla quibusdam totam dolore. Ut corporis,\nlaudantium, dolor quia et officiis labore error odit est consequatur aperiam\nconsectetur. Alias aspernatur nostrum ea deleniti repellendus doloremque voluptatum\nporro autem iste, laboriosam nobis eos odio sapiente quisquam, nemo adipisci molestiae\nperferendis ratione consequatur unde nulla molestias quas!',
        createdAt: new Date(Date.now()).toUTCString(),
        updatedAt: new Date(Date.now()).toUTCString(),
        folder: 'Some folder',
        user: 'Some user',
        tags: ['Some tag', 'Another tag'],
        attachments: [
            {
                name: 'Some attachment',
                type: 'pdf',
                url: 'https://example.com/some-attachment.pdf'
            },
            {
                name: 'Another attachment',
                type: 'image',
                url: 'https://example.com/another-attachment.png'
            },
            {
                name: 'Yet another attachment',
                type: 'document',
                url: 'https://example.com/yet-another-attachment.docx'
            }
        ],
        links: [
            {
                linkID: 'some-link',
                url: 'https://example.com/some-link'
            },
            {
                linkID: 'another-link',
                url: 'https://example.com/another-link'
            },
            {
                linkID: 'yet-another-link',
                url: 'https://example.com/yet-another-link'
            }
        ]
    }

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

                    <div className="flex w-full flex-col items-center justify-center">
                        <div className="flex flex-col items-center justify-start border-b-2 border-b-slate-200/20">
                            <h1 className="text-lg font-bold">Note Name</h1>
                            <p className="text-sm">Created {new Date(Date.now()).toUTCString()}</p>
                        </div>

                        <div className="mt-2 flex w-9/12 flex-col justify-start gap-2">
                            <NoteViewer note={tempNote} />
                        </div>
                    </div>
                </main>
            )}
        </div>
    )
}

export default NotesViewPage
