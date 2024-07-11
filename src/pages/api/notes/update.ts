import { z } from 'zod'
import { getServerSession } from 'next-auth/next'

import { updateNote, getNote } from '@/services/notes'
import { Note } from '@/services/notes'

import type { NextApiRequest, NextApiResponse } from 'next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

type ResponseData = {
    message: string
    note?: any // Change this to Note once the Note type is exported
}

/**
 * Handles the search for a note by its ID.
 *
 * @param req - The NextApiRequest object.
 * @param res - The NextApiResponse object.
 * @returns A JSON response indicating the success or failure of the note creation.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' })
    const session = await getServerSession(req, res, authOptions)
    if (!session || !session.user) return res.status(401).json({ message: 'Unauthorized' })

    const parsedBody = z
        .object({
            noteId: z.string({}).min(36).max(36),
            data: z.object({
                title: z.string({}).min(1).max(34),
                content: z.string({}).min(1).max(10000),
                tags: z.array(z.string().min(2).max(12)).max(5),
                folderId: z.string({}).min(36).max(36),
                archived: z.boolean()
            })
        })
        .safeParse(req.body)

    if (!parsedBody.success || !parsedBody.data) {
        return res.status(400).json({ message: 'Invalid request body' })
    }

    try {
        const note = await getNote(parsedBody.data.noteId)
        if (!note) return res.status(404).json({ message: 'Note not found' })

        if (note?.owner_id !== (session.user as any).id) return res.status(404).json({ message: 'Note not found' })

        // Update the note
        updateNote(
            parsedBody.data.noteId,
            parsedBody.data.data.title,
            parsedBody.data.data.content,
            parsedBody.data.data.tags,
            parsedBody.data.data.archived
        )

        return res.status(200).json({ message: 'Note updated' })
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}
