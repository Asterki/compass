import { z } from 'zod'
import { getServerSession } from 'next-auth/next'

import { getNote, noteExists } from '@/services/notes'
import { Note } from '@/services/notes'

import type { NextApiRequest, NextApiResponse } from 'next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

type ResponseData = {
    message: string
    note?: Note
}

/**
 * Handles the search for a note by its ID.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' })
    const session = await getServerSession(req, res, authOptions)
    if (!session || !session.user) return res.status(401).json({ message: 'Unauthorized' })

    const parsedBody = z
        .object({
            noteId: z.string().min(36).max(36)
        })
        .safeParse(req.body)

    if (!parsedBody.success || !parsedBody.data) {
        return res.status(400).json({ message: 'Invalid request body' })
    }

    try {
        const { noteId } = parsedBody.data

        const noteExist = await noteExists(noteId)
        if (!noteExist) return res.status(404).json({ message: 'Note not found' }) // Check if the note exists

        // Check if the note belongs to the user
        if (noteExist !== (session as any).id) return res.status(404).json({ message: 'Note not found' })

        // Update the note
        const note = await getNote(noteId)
        // This should never happen since we already checked if the note exists
        // but since typescript is a crybaby, we have to check again
        if (!note) return res.status(404).json({ message: 'Note not found' }) 
        return res.status(200).json({ message: 'Note found', note })
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}
