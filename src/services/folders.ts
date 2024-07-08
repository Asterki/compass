import { v4 as uuidv4 } from 'uuid'

import { prismaClient } from '@/lib/prisma'

interface Folder {
    id: string
    name: string
    folder_id: string
    created_at: Date
    owner_id: string
}

const createFolder = async (name: string, userId: string, parentFolderId?: string) => {
    const folderID = uuidv4()

    const folder: Folder = {
        id: folderID,
        name,
        userId
    }

    prismaClient.folder.create({
        data: {
            id: folder.id,
            name: folder.name,
            userId: folder.userId
        }
    })

    return folder.id
}


export type { Folder }
export { createFolder }