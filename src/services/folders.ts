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

    prismaClient.folder.create({
        data: {
            created_at: new Date(Date.now()),
            id: folderID,
            name,
            owner_id: userId,
            folder_id: parentFolderId ? parentFolderId : null,
            tags: ['folder']
        }
    })

    return folderID
}

const deleteFolder = async (folderId: string) => {
    prismaClient.folder.delete({
        where: {
            id: folderId
        }
    })
}

const getFolder = async (folderId: string) => {
    return prismaClient.folder.findUnique({
        where: {
            id: folderId
        }
    })
}

const moveFolder = async (folderId: string, newParentFolderId: string) => {
    prismaClient.folder.update({
        where: {
            id: folderId
        },
        data: {
            folder_id: newParentFolderId
        }
    })
}

const getFolders = async (userId: string) => {
    return prismaClient.folder.findMany({
        where: {
            owner_id: userId
        }
    })
}

const getItemsInFolder = async (folderId: string) => {
    let folders = prismaClient.folder.findMany({
        where: {
            folder_id: folderId
        }
    })

    let notes = prismaClient.note.findMany({
        where: {
            folder_id: folderId
        }
    })

    return {
        folders,
        notes
    }
}

const updateFolder = async (folderId: string, name: string) => {
    prismaClient.folder.update({
        where: {
            id: folderId
        },
        data: {
            name
        }
    })
}

const findFoldersByName = async (name: string, userId: string) => {
    return prismaClient.folder.findMany({
        where: {
            name: name.toLowerCase(),
            owner_id: userId
        }
    })
}

const folderExist = async (folderID: string) => {
    const result = await prismaClient.folder.findFirst({
        where: {
            folder_id: folderID
        }
    })

    return !result == null
}

export type { Folder }
export {
    createFolder,
    deleteFolder,
    findFoldersByName,
    getFolder,
    getFolders,
    getItemsInFolder,
    moveFolder,
    updateFolder,
    folderExist
}
