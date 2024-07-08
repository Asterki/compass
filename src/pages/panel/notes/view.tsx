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
        "# Heading 1\n## Heading 2\n### Heading 3\n#### Heading 4\n##### Heading 5\n###### Heading 6\nUsing two asterisks **this text is bold**.  \nTwo underscores __work as well__.  \nLet's make it *italic now*.  \nYou guessed it, _one underscore is also enough_.  \nCan we combine **_both of that_?** Absolutely.\nWhat if I want to ~~strikethrough~~?\n> This is a blockquote.\n> Want to write on a new line with space between?\n>\n> > And nested? No problem at all.\n> >\n> > > PS. you can **style** your text _as you want_.\n![text if the image fails to load](https://placehold.co/200/png 'Text displayed on hover')\n[markdown-cheatsheet]: https://github.com/im-luka/markdown-cheatsheet\n[docs]: https://github.com/adam-p/markdown-here\n[Like it so far? Follow me on GitHub](https://github.com/im-luka)\n[My Markdown Cheatsheet - star it if you like it][markdown-cheatsheet]\nFind some great docs [here][docs]\n    I created `.env` file at the root.\n    Backticks inside backticks? `` `No problem.` ``\n    ```\n    {\n      learning: 'Markdown',\n      showing: 'block code snippet'\n    }\n    ```\n    ```js\n    const x = 'Block code snippet in JS';\n    console.log(x);\n    ```\n1. HTML\n2. CSS\n3. Javascript\n4. React\n7. I'm Frontend Dev now 👨🏼‍🎨\n  - Node.js\n    - ewq\n+ Express\n- Nest.js\n\t\n- Learning Backend ⌛️    \n  \n  1. Learn Basics\n   1. HTML\n   2. CSS\n   7. Javascript\n2. Learn One Framework\n   - React \n     - Router\n     - Redux\n   * Vue\n   + Svelte\n   \n| Left Align (default) | Center Align | Right Align |\n| :------------------- | :----------: | ----------: |\n| React.js             | Node.js      | MySQL       |\n| Next.js              | Express      | MongoDB     |\n| Vue.js               | Nest.js      | Redis       |\n#### I am working on a new project. [^1]\n[^1]: Stack is: React, Typescript, Tailwind CSS  \nProject is about music & movies.\n##### Hope you will like it. [^see]\n[^see]: Loading... ⌛️",
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
