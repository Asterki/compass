import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Note {
    note: {
        title: string
        content: string
        createdAt: string
        updatedAt: string
        folder: string
        user: string
        tags: string[]
        attachments: {
            name: string
            type: string
            url: string
        }[]
        links: {
            linkID: string
            url: string
        }[]
    }
}

const NoteViewer: React.FC<Note> = props => {
    return (
        <Markdown
            remarkPlugins={[remarkGfm]}
            components={{
                h1: ({ node, ...props }) => <h1 className="text-2xl font-bold" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-xl font-bold" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-lg font-bold" {...props} />,
                h4: ({ node, ...props }) => <h4 className="text-base font-bold" {...props} />,
                h5: ({ node, ...props }) => <h5 className="text-sm font-bold" {...props} />,
                h6: ({ node, ...props }) => <h6 className="text-xs font-bold" {...props} />,
                p: ({ node, ...props }) => <p className="text-base" {...props} />,
                a: ({ node, ...props }) => <a className="text-blue-500" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal" {...props} />,
                li: ({ node, ...props }) => <li className="text-base" {...props} />,
                table: ({ node, ...props }) => <table className="table-auto" {...props} />,
                thead: ({ node, ...props }) => <thead className="bg-gray-50" {...props} />,
                tbody: ({ node, ...props }) => <tbody className="bg-white" {...props} />,
                th: ({ node, ...props }) => <th className="border border-gray-200 p-2" {...props} />,
                td: ({ node, ...props }) => <td className="border border-gray-200 p-2" {...props} />,
                blockquote: ({ node, ...props }) => (
                    <blockquote className="border-l-4 border-gray-200 p-2" {...props} />
                ),
                code: ({ node, ...props }) => <code className="bg-gray-50 p-1" {...props} />,
                pre: ({ node, ...props }) => <pre className="bg-gray-50 p-2" {...props} />,
                img: ({ node, ...props }) => <img className="max-w-full" {...props} />,
                hr: ({ node, ...props }) => <hr className="border-t border-gray-200" {...props} />,
                em: ({ node, ...props }) => <em className="italic" {...props} />,
                strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
                del: ({ node, ...props }) => <del className="line-through" {...props} />,
                sup: ({ node, ...props }) => <sup className="text-xs" {...props} />,
                sub: ({ node, ...props }) => <sub className="text-xs" {...props} />,
                br: ({ node, ...props }) => <br {...props} />,
            }}
        >
            {props.note.content}
        </Markdown>
    )
}

export default NoteViewer
