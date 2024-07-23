import { z } from 'zod'
import { getServerSession } from 'next-auth/next'

import { getFolder, getItemsInFolder } from '@/services/folders'

import type { NextApiRequest, NextApiResponse } from 'next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

type ResponseData = {
    message: string
    result?: {
        folders: {
            id: string
            name: string
            created_at: Date
        }[]
        notes: {
            id: string
            title: string
            created_at: Date
        }[]
    }
}

/**
 * Gets the note's browser, which will contain things such as the parent folders, notes inside them, und so weiter
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' })
    const session = await getServerSession(req, res, authOptions)
    if (!session || !session.user) return res.status(401).json({ message: 'Unauthorized' })

    const parsedBody = z
        .object({
            parentFolderId: z.string({})
        })
        .safeParse(req.body)

    if (!parsedBody.success || !parsedBody.data) {
        return res.status(400).json({ message: 'Invalid request body' })
    }

    try {
        // CHeck if the folder exists and it's owned by the user
        const folderExist = await getFolder(parsedBody.data.parentFolderId)
        if (!folderExist) return res.status(404).json({ message: 'Folder not found' })
        if (folderExist!.owner_id !== (session as any).id) return res.status(404).json({ message: 'Folder not found' })

        const folder = await getItemsInFolder(parsedBody.data.parentFolderId)
        return res.status(200).json({ message: 'Note browser', result: folder })
    } catch (error) {
        console.error('Error creating note:', error)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}
