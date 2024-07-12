import { z } from 'zod'
import { getServerSession } from 'next-auth/next'

import { getFolder, folderExist } from '@/services/folders'
import { Folder } from '@/services/folders'

import type { NextApiRequest, NextApiResponse } from 'next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

type ResponseData = {
    message:
        | 'Note updated'
        | 'Folder not found'
        | 'Invalid request body'
        | 'Internal Server Error'
        | 'Method Not Allowed'
        | 'Unauthorized'
        | 'Note not found'
    folder?: Folder
}

/**
 * Handles the get of a folder by it's ID.
 *
 * @param req - The NextApiRequest object.
 * @param res - The NextApiResponse object.
 * @returns A JSON response returning the folder contents.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' })
    const session = await getServerSession(req, res, authOptions)
    if (!session || !session.user) return res.status(401).json({ message: 'Unauthorized' })

    const parsedBody = z
        .object({
            folderID: z.string({}).min(36).max(36)
        })
        .safeParse(req.body)

    if (!parsedBody.success || !parsedBody.data) {
        return res.status(400).json({ message: 'Invalid request body' })
    }

    try {
        const note = await folderExist(parsedBody.data.folderID)
        if (!note) return res.status(404).json({ message: 'Folder not found' }) // Check if the note exists

        // Check if the folder belongs to the user
        if (note !== (session.user as any).id) return res.status(404).json({ message: 'Note not found' })

        // Get the folder
        const folder = await getFolder(parsedBody.data.folderID)
        if (!folder || folder == null) return res.status(404).json({ message: 'Folder not found' })
            
        return res.status(200).json({ message: 'Note updated', folder })
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}
