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

const createNote = async (
    title: string,
    content: string,
    folderId: string,
    userId: string,
) => {
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
