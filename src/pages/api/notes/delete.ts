import { z } from 'zod'
import { getServerSession } from 'next-auth/next'

import { deleteNote, getNote } from '@/services/notes'

import type { NextApiRequest, NextApiResponse } from 'next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

type ResponseData = {
    message: string
}

/**
 * Handles the deletion for a note by its ID.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' })
    const session = await getServerSession(req, res, authOptions)
    if (!session || !session.user) return res.status(401).json({ message: 'Unauthorized' })

    const parsedBody = z
        .object({
            noteId: z.string({}).min(1).max(36),
        })
        .safeParse(req.body)

    if (!parsedBody.success || !parsedBody.data) {
        return res.status(400).json({ message: 'Invalid request body' })
    }

    try {
        const userId = (session as any).id as string
        const { noteId } = parsedBody.data

        // Check if the note exists and if the user owns it
        const note = await getNote(noteId)
        if (!note || note.owner_id !== userId) return res.status(404).json({ message: 'Note not found' })

        // Delete the note
        const result = await deleteNote(noteId)

        // Return the result
        if (!result) return res.status(500).json({ message: 'Failed to delete note' })
        return res.status(200).json({ message: 'Note deleted' })
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}
