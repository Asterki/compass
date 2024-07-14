import { v4 as uuidv4 } from 'uuid'
import { prismaClient } from '@/lib/prisma'

interface Folder {
    id: string
    name: string
    owner_id: string
    parent_folder_id: string | null
    tags: string[]
    created_at: Date
}

/**
 * Creates a new folder with the specified name, owner ID, and optional parent folder ID.
 * @param data The data to create the folder with.
 * @returns The ID of the created folder.
 */
const createFolder = async (data: { name: string; userId: string; parentFolderId?: string }): Promise<string> => {
    const folderID = await prismaClient.folder.create({
        data: {
            created_at: new Date(),
            name: data.name,
            owner_id: data.userId,
            parent_folder_id: data.parentFolderId || null,
            tags: ['']
        },
        select: {
            id: true
        }
    })

    return folderID.id
}

/**
 * Deletes a folder with the specified folderId.
 * @param folderId The ID of the folder to delete.
 * @returns True if the folder was deleted, false otherwise.
 */
const deleteFolder = async (folderId: string): Promise<boolean> => {
    const result = await prismaClient.folder.delete({
        where: { id: folderId }
    })

    if (result) return true
    return false
}

/**
 * Retrieves a folder by its ID.
 * @param folderId The ID of the folder to retrieve.
 */
const getFolder = (folderId: string): Promise<Folder | null> => {
    return prismaClient.folder.findUnique({
        where: { id: folderId }
    })
}

/**
 * Retrieves folders owned by a specific user.
 * @param userId The ID of the user to retrieve folders for.
 * @returns An array of folders owned by the user.
 */
const getFoldersByUserID = (userId: string): Promise<Folder[]> => {
    return prismaClient.folder.findMany({
        where: { owner_id: userId },
        select: {
            id: true,
            name: true,
            owner_id: true,
            parent_folder_id: true,
            tags: true,
            created_at: true
        }
    })
}

/**
 * Retrieves the folders and notes within a given folder.
 * @param folderId The ID of the folder to retrieve items for.
 * @returns An object containing the folders and notes within the folder.
 */
const getItemsInFolder = async (
    folderId: string
): Promise<{
    folders: { id: string; name: string; created_at: Date }[]
    notes: { id: string; title: string; created_at: Date }[]
}> => {
    const [folders, notes] = await Promise.all([
        prismaClient.folder.findMany({
            where: { parent_folder_id: folderId },
            select: { id: true, name: true, created_at: true }
        }),
        prismaClient.note.findMany({
            where: { parent_folder_id: folderId },
            select: { id: true, title: true, created_at: true }
        })
    ])
    return { folders, notes }
}

/**
 * Updates a folder with the specified folderId.
 * @param folderId The ID of the folder to update.
 * @param data The data to update the folder with.
 */
const updateFolder = (folderId: string, data: { name: string; newParentFolderId: string }): Promise<Folder> => {
    return prismaClient.folder.update({
        where: { id: folderId },
        data: { name: data.name, parent_folder_id: data.newParentFolderId }
    })
}

/**
 * Finds the folders with the specified name owned by a specific user.
 * @param name The name of the folder to find.
 * @param userId The ID of the user to find the folder for.
 * @returns An array of folders with the specified name.
 */
const findFoldersByName = (name: string, userId: string): Promise<Folder[]> => {
    return prismaClient.folder.findMany({
        where: {
            name: {
                contains: name,
                mode: 'insensitive'
            },
            owner_id: userId
        }
    })
}

/**
 * Returns the owner ID of the folder with the specified folder ID, or false if the folder does not exist.
 * @param folderID The ID of the folder to check.
 * @returns The owner ID of the folder, or false if the folder does not exist.
 */
const folderExist = async (folderID: string): Promise<string | false> => {
    const folder = await prismaClient.folder.findFirst({
        where: { id: folderID },
        select: { owner_id: true }
    })
    return folder ? folder.owner_id : false
}

export type { Folder }
export {
    createFolder,
    deleteFolder,
    getFolder,
    getFoldersByUserID,
    getItemsInFolder,
    updateFolder,
    findFoldersByName,
    folderExist
}Returns the owner ID of the folder with the specified folder ID, or false if the folder does not exist.
* @param folderID The ID of the folder to check.
* @returns The owner ID of the folder, or false if the folder does not exist.
*/
const folderExist = async (folderID: string): Promise<string | false> => {
   const folder = await prismaClient.folder.findFirst({
       where: { id: folderID },
       select: { owner_id: true }
   })
   return folder ? folder.owner_id : false
}
