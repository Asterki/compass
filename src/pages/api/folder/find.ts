import { z } from 'zod'
import { getServerSession } from 'next-auth/next'

import { findFoldersByName } from '@/services/folders'

import type { NextApiRequest, NextApiResponse } from 'next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

type ResponseData = {
    message: 'Folders found' | 'Invalid request body' | 'Internal Server Error' | 'Method Not Allowed' | 'Unauthorized'
    folders?: {
        id: string
        name: string
    }[]
}

/**
 * Handles the search for a folder by its name.
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
            folderName: z.string({}).min(1).max(36)
        })
        .safeParse(req.body)

    if (!parsedBody.success || !parsedBody.data) {
        return res.status(400).json({ message: 'Invalid request body' })
    }

    try {
        const userID = (session.user as any).id as string
        const folders = await findFoldersByName(parsedBody.data.folderName, userID)

        const returnedFolders = folders.map(folder => {
            return {
                id: folder.id,
                name: folder.name
            }
        })

        return res.status(200).json({ message: 'Folders found', folders: returnedFolders })
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}
