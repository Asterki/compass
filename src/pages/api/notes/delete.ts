import { z } from 'zod'
import { getServerSession } from 'next-auth/next'

import { deleteNote, noteExists } from '@/services/notes'
import { Note } from '@/services/notes'

import type { NextApiRequest, NextApiResponse } from 'next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

type ResponseData = {
    message: string
}

/**
 * Handles the deletion for a note by its ID.
 *
 * @param req - The NextApiRequest object.
 * @param res - The NextApiResponse object.
 * @returns A JSON response indicating the success or failure of the note deletion.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' })
    const session = await getServerSession(req, res, authOptions)
    if (!session || !session.user) return res.status(401).json({ message: 'Unauthorized' })

    const parsedBody = z
        .object({
            noteId: z.string({}).min(36).max(36)
        })
        .safeParse(req.body)

    if (!parsedBody.success || !parsedBody.data) {
        return res.status(400).json({ message: 'Invalid request body' })
    }

    try {
        const note = await noteExists(parsedBody.data.noteId)
        if (!note) return res.status(404).json({ message: 'Note not found' })

        if (note !== (session.user as any).id) return res.status(404).json({ message: 'Note not found' })

        if (note) {
            deleteNote(parsedBody.data.noteId)
            return res.status(200).json({ message: 'Note deleted' })
        }
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}
