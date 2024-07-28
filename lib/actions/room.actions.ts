'use server'

import { nanoid } from "nanoid"
import { liveblocks } from "../liveblocks"
import { revalidatePath } from "next/cache"
import { parseStringify } from "../utils"

export const createDocument = async ({ userId, email }: CreateDocumentParams) => {

      const roomId = nanoid()
      // nanoid() is an ID generating function
      
      try {

            // Add the metadata about the document
            const metadata = {
                  creatorId: userId,
                  email: email,
                  title: 'Untitled'
            }

            // Define the access for the users
            const usersAccesses: RoomAccesses = {
                  [email]: ['room:write']
            }

            const room = await liveblocks.createRoom(roomId, {
                  metadata,
                  usersAccesses,
                  defaultAccesses: ['room:write']
            })

            revalidatePath('/')

            return parseStringify(room)


      } catch (error) {

            console.log ("Failed to create document room")
            console.log (error)

      }

}

export const getDocument = async ({ roomId, userId }: { roomId: string; userId: string}) => {

      try {

            const room = await liveblocks.getRoom (roomId)

            const hasAccess = Object.keys(room.usersAccesses).includes(userId)

            if (!hasAccess) {
                  throw new Error ("You do not have access to this document")
            }

            return parseStringify(room)

      } catch (error) {
            console.log ("Error fetching the room", error)
      }

}

export const updateDocument = async (roomId: string, title: string) => {

      try {

            const updatedRoom = await liveblocks.updateRoom(roomId, {
                  metadata: {
                        title
                  }
            })

            revalidatePath (`/documents/${roomId}`)

            return parseStringify(updatedRoom)

      } catch (error) {
            console.log ('Error changing the title of the document')
      }

}