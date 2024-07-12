import { z } from 'zod'
import { getServerSession } from 'next-auth/next'

import { updateFolder, folderExist } from '@/services/folders'

import type { NextApiRequest, NextApiResponse } from 'next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

type ResponseData = {
    message:
        | 'Folder updated'
        | 'Folder not found'
        | 'Invalid request body'
        | 'Internal Server Error'
        | 'Method Not Allowed'
        | 'Unauthorized'
}

/**
 * Handles the update request for a folder.
 * 
 * @param req - The NextApiRequest object representing the HTTP request.
 * @param res - The NextApiResponse object representing the HTTP response.
 * @returns A Promise that resolves to the updated folder or an error response.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' })
    const session = await getServerSession(req, res, authOptions)
    if (!session || !session.user) return res.status(401).json({ message: 'Unauthorized' })

    const parsedBody = z
        .object({
            folderID: z.string({}).min(36).max(36),
            name: z.string({}).min(1).max(34),
            newParentFolderId: z.string({}).min(36).max(36)
        })
        .safeParse(req.body)

    if (!parsedBody.success || !parsedBody.data) {
        return res.status(400).json({ message: 'Invalid request body' })
    }

    try {
        const folder = await folderExist(parsedBody.data.folderID)
        if (!folder) return res.status(404).json({ message: 'Folder not found' })
        if (folder !== (session.user as any).id) return res.status(404).json({ message: 'Folder not found' })

        // Update the folder
        const { folderID, name, newParentFolderId } = parsedBody.data
        await updateFolder(folderID, name, newParentFolderId)

        return res.status(200).json({ message: 'Folder updated' })
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}
