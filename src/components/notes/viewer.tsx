import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'

import type { Note } from '@/services/notes'

const NoteViewer: React.FC<{ note: Note }> = props => {
    return (
        <Markdown
            remarkPlugins={[remarkGfm, remarkBreaks]}
            className={`flex w-9/12 flex-col gap-2`}
            skipHtml={true}
            // Parse \n as <br>
            components={{
                h1: ({ node, ...props }) => <h1 className="text-2xl font-bold" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-xl font-bold" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-lg font-bold" {...props} />,
                h4: ({ node, ...props }) => <h4 className="text-base font-bold" {...props} />,
                h5: ({ node, ...props }) => <h5 className="text-sm font-bold" {...props} />,
                h6: ({ node, ...props }) => <h6 className="text-xs font-bold" {...props} />,
                a: ({ node, ...props }) => <a className="text-blue-500 hover:underline" {...props} />,
                table: ({ node, ...props }) => <table border={0} className="table-auto rounded-md" {...props} />,
                thead: ({ node, ...props }) => <thead className="!bg-slate-950" {...props} />,
                tbody: ({ node, ...props }) => <tbody className="!bg-slate-800" {...props} />,
                th: ({ node, ...props }) => <th className="border border-gray-700 p-2" {...props} />,
                td: ({ node, ...props }) => <td className="border border-gray-700 p-2" {...props} />,
                blockquote: ({ node, ...props }) => (
                    <blockquote className="block border-l-2 border-gray-200/20 p-2 *:block" {...props} />
                ),
                p: ({ node, ...props }) => <p className="w-full text-base" {...props} />,
                ul: ({ node, ...props }) => <ul className="ml-4 list-inside list-disc" {...props} />,
                ol: ({ node, ...props }) => <ol className="ml-4 list-inside list-decimal" {...props} />,
                li: ({ node, ...props }) => <li className="text-base" {...props} />,
                code: ({ node, ...props }) => <code className="rounded-md bg-slate-700 p-1" {...props} />,
                pre: ({ node, ...props }) => <pre className="w-full rounded-md bg-slate-800 p-2" {...props} />,
                img: ({ node, ...props }) => <img className="max-w-full" {...props} />,
                hr: ({ node, ...props }) => <hr className="border-t border-gray-200" {...props} />,
                em: ({ node, ...props }) => <em className="italic" {...props} />,
                strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
                del: ({ node, ...props }) => <del className="line-through" {...props} />,
                sup: ({ node, ...props }) => <sup className="text-xs" {...props} />,
                sub: ({ node, ...props }) => <sub className="text-xs" {...props} />,
                br: ({ node, ...props }) => <br {...props} />
            }}
        >
            {/* Parse \n as <br> */}
            {props.note.content.replaceAll(
                '\\n',
                `
 `
            )}
        </Markdown>
    )
}

export default NoteViewer
