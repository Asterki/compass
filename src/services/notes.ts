import { v4 as uuidv4 } from 'uuid'

import { prismaClient } from '@/lib/prisma'

import { Folder } from './folders'

interface Link {
    id: string
    links_to: string
    label: string
    note_id: string
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
    folder_id: string

    attachments: Attachment[]
    links: Link[]
}

const createNote = async (title: string, content: string, folderId: string, userId: string) => {
    const noteID = uuidv4()

    const note: Note = {
        id: noteID,
        title,
        content,
        created_at: new Date(),
        owner_id: userId,
        folder_id: folderId,
        attachments: [],
        links: []
    }

    prismaClient.note.create({
        data: {
            id: note.id,
            title: note.title,
            content: note.content,
            created_at: note.created_at,
            owner_id: note.owner_id,
            folder_id: note.folder_id
        }
    })

    return note.id
}

const deleteNote = (noteId: string) => {
    prismaClient.note.delete({
        where: {
            id: noteId
        }
    })
}

const getNote = async (noteId: string) => {
    const note = await prismaClient.note.findUnique({
        where: {
            id: noteId
        }
    })

    return note
}

const getNotes = async (folderId: string) => {
    const notes = await prismaClient.note.findMany({
        where: {
            folder_id: folderId
        }
    })

    return notes
}

const updateNote = async (noteId: string, title: string, content: string) => {
    await prismaClient.note.update({
        where: {
            id: noteId
        },
        data: {
            title,
            content
        }
    })
}

export { createNote, deleteNote, getNote, getNotes, updateNote }
