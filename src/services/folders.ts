import { v4 as uuidv4 } from 'uuid';
import { prismaClient } from '@/lib/prisma';

interface Folder {
    id: string;
    name: string;
    owner_id: string;
    folder_id: string | null;
    tags: string[];
    created_at: Date;
}

/**
 * Creates a new folder with the specified name, owner ID, and optional parent folder ID.
 */
const createFolder = async (name: string, userId: string, parentFolderId?: string): Promise<string> => {
    const folderID = uuidv4();
    await prismaClient.folder.create({
        data: {
            created_at: new Date(),
            id: folderID,
            name,
            owner_id: userId,
            folder_id: parentFolderId || null,
            tags: ['folder'],
        },
    });
    return folderID;
};

/**
 * Deletes a folder with the specified folderId.
 */
const deleteFolder = async (folderId: string): Promise<void> => {
    await prismaClient.folder.delete({
        where: { id: folderId },
    });
};

/**
 * Retrieves a folder by its ID.
 */
const getFolder = (folderId: string): Promise<Folder | null> => {
    return prismaClient.folder.findUnique({
        where: { id: folderId },
    });
};

/**
 * Retrieves folders owned by a specific user.
 */
const getFolders = (userId: string): Promise<Folder[]> => {
    return prismaClient.folder.findMany({
        where: { owner_id: userId },
    });
};

/**
 * Retrieves the folders and notes within a given folder.
 */
const getItemsInFolder = async (folderId: string): Promise<{ folders: Folder[]; notes: any[] }> => {
    const [folders, notes] = await Promise.all([
        prismaClient.folder.findMany({ where: { folder_id: folderId } }),
        prismaClient.note.findMany({ where: { folder_id: folderId } }),
    ]);
    return { folders, notes };
};

/**
 * Updates a folder with the specified folderId.
 */
const updateFolder = (folderId: string, name: string, newParentFolderId: string): Promise<Folder> => {
    return prismaClient.folder.update({
        where: { id: folderId },
        data: { name, folder_id: newParentFolderId },
    });
};

/**
 * Finds the folders with the specified name owned by a specific user.
 */
const findFoldersByName = (name: string, userId: string): Promise<Folder[]> => {
    return prismaClient.folder.findMany({
        where: {
            name: name.toLowerCase(),
            owner_id: userId,
        },
    });
};

/**
 * Returns the owner ID of the folder with the specified folder ID, or false if the folder does not exist.
 */
const folderExist = async (folderID: string): Promise<string | false> => {
    const folder = await prismaClient.folder.findFirst({
        where: { folder_id: folderID },
        select: { owner_id: true },
    });
    return folder ? folder.owner_id : false;
};

export type { Folder };
export {
    createFolder,
    deleteFolder,
    findFoldersByName,
    getFolder,
    getFolders,
    getItemsInFolder,
    updateFolder,
    folderExist,
};