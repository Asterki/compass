import { prismaClient } from '@/lib/prisma'

interface Link {
    id: string
    links_to: string
    label: string
}

interface Attachment {
    id: string
    url: string
    label: string
    note_id: string
}

interface Note {
    id: string
    title: string
    content: string
    created_at: Date
    owner_id: string
    parent_folder_id: string
    archived: boolean
    tags: string[]

    attachments: Attachment[]
    links: Link[]
}

/**
 * Creates a new note with the specified title, content, and folder ID.
 * @param data The data to create the note with.
 * @returns The ID of the created note.
 */
const createNote = async (data: {
    title: string
    content: string
    folderId: string
    ownerId: string
}): Promise<string> => {
    let noteID = await prismaClient.note.create({
        data: {
            title: data.title,
            content: data.content,
            created_at: new Date(),
            tags: [],
            archived: false,
            owner: {
                connect: { id: data.ownerId }
            },
            folder: {
                connect: {
                    id: data.folderId
                }
            }
        },
        select: {
            id: true
        }
    })

    return noteID.id
}

/**
 * Deletes a note with the specified noteId.
 * @param noteId The ID of the note to delete.
 * @returns True if the note was deleted, false otherwise.
 */
const deleteNote = async (noteId: string) => {
    const result = await prismaClient.note.delete({
        where: {
            id: noteId
        }
    })

    if (result) return true
    return false
}

/**
 * Retrieves a note by its ID.
 * @param noteId The ID of the note to retrieve.
 * @returns The note if it exists, null otherwise.
 */
const getNote = async (noteId: string) => {
    const note = await prismaClient.note.findUnique({
        where: {
            id: noteId
        },
        include: {
            attachments: true,
            links: true,
            folder: true
        }
    })

    return note
}

/**
 * Retrieves notes owned by a specific user.
 * @param userId The ID of the user to retrieve notes for.
 * @returns An array of notes owned by the user.
 */
const updateNote = async (
    noteId: string,
    data: { title: string; content: string; tags: string[]; archived: boolean }
) => {
    const result = await prismaClient.note.update({
        where: {
            id: noteId
        },
        data: {
            title: data.title,
            content: data.content,
            tags: data.tags,
            archived: data.archived
        }
    })

    return result
}

/**
 * Retrieves notes owned by a specific user.
 * @param userId The ID of the user to retrieve notes for.
 * @returns An array of notes owned by the user.
 */
const findNotesByName = async (name: string, ownerId: string) => {
    const notes = await prismaClient.note.findMany({
        where: {
            title: {
                contains: name,
                mode: 'insensitive'
            },
            owner_id: ownerId
        }
    })

    return notes
}

/**
 * Retrieves notes owned by a specific user.
 * @param userId The ID of the user to retrieve notes for.
 * @returns An array of notes owned by the user.
 */
const moveNote = async (noteId: string, parentFolderId: string, newParentFolderId: string) => {
    const result = await prismaClient.note.update({
        where: {
            id: noteId,
            parent_folder_id: parentFolderId
        },
        data: {
            parent_folder_id: newParentFolderId
        }
    })

    if (result) return true
    return false
}

/**
 * Finds the folders with the specified tag owned by a specific user.
 * @param tag The tag of the folder to find.
 * @param userId The ID of the user to find the folder for.
 * @returns An array of folders with the specified tag.
 */
const findNotesByTag = async (tag: string, userId: string) => {
    const result = await prismaClient.note.findMany({
        where: {
            tags: {
                has: tag
            },
            owner_id: userId
        }
    })

    return result
}

export { createNote, deleteNote, getNote, updateNote, findNotesByName, moveNote, findNotesByTag }
export type { Note, Attachment, Link }
