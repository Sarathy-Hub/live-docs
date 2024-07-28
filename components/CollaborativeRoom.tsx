'use client'

import React from "react"
import { Editor } from "@/components/editor/Editor"
import Header from "@/components/Header"

import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs"
import { RoomProvider, ClientSideSuspense } from "@liveblocks/react/suspense"

import { useState, useRef, useEffect } from "react"

import { Input } from "./ui/input"
import Image from "next/image"

import Loader from "./Loader"
import ActiveCollaborators from "./ActiveCollaborators"
import { updateDocument } from "@/lib/actions/room.actions"

interface CollaborativeRoomProps {
      roomId: string;
      roomMetadata: any;
}

const CollaborativeRoom = ({ roomId, roomMetadata}: CollaborativeRoomProps) => {

      const currentUserType = "editor"

      const [documentTitle, setDocumenTitle] = useState (roomMetadata.title)
      const [editing, setEditing] = useState (false)
      const [loading, setLoading] = useState (false)

      const containerRef = useRef<HTMLDivElement>(null)
      const inputRef = useRef<HTMLDivElement>(null)

      const updateTitleHandler = async (e: React.KeyboardEvent<HTMLInputElement>) => {

            if (e.key == 'Enter') {
                  setLoading (true)

                  try {

                        if (documentTitle !== roomMetadata.title) {
                              const updatedDocument = await updateDocument(roomId, documentTitle)

                              if (updatedDocument) {
                                    setLoading (false)
                              }
                        }

                  } catch (error) {
                        console.log (error)
                  }

                  setLoading (false)
            }

      }

      useEffect (() => {

            const handleClickOutside = async (e: MouseEvent) => {
                  if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                        setEditing (false)

                        await updateDocument(roomId, documentTitle)
                  }
            }

            document.addEventListener ('mousedown', handleClickOutside)

            return () => {
                  document.removeEventListener ('mousedown', handleClickOutside)
            }

      }, [roomId, documentTitle])

      useEffect (() => {
            if (editing && inputRef.current) {
                  inputRef.current.focus()
            }
      }, [editing])


      return (
            <RoomProvider id={roomId}>
                  <ClientSideSuspense fallback={<Loader />}>
                  <div className="collaborative-room">

                        <Header>
                              <div ref = {containerRef} className = "flex w-fit items-center justify-center gap-2">
                                    {
                                          editing && !loading ? (
                                                <Input 
                                                      type = "text"
                                                      value = {documentTitle}
                                                      ref = {inputRef}
                                                      placeholder = "Enter title"
                                                      onChange = {(e) => setDocumenTitle(e.target.value)}

                                                      onKeyDown={updateTitleHandler}

                                                      disable = {!editing}
                                                      className = "document-title-input"
                                                />
                                          ) : (
                                                <>
                                                      <p className = "document-title">{documentTitle}</p>
                                                </>
                                          )
                                    }

                                    {
                                          currentUserType === 'editor' && !editing && (
                                                <Image 
                                                      src = "/assets/icons/edit.svg"
                                                      alt = "Edit"
                                                      width = {24}
                                                      height = {24}
                                                      onClick = {() => setEditing(true)}

                                                      className = "pointer"
                                                />
                                          )
                                    }

                                    {
                                          currentUserType !== 'editor' && !editing && (
                                                <p className = "view-only-tag">View Only</p>
                                          )

                                    }

                                    {loading && <p className = "text-sm text-gray-400">Saving...</p>}


                              </div>

                              <div className="flex w-full flex-1 justify-end gap-2">
                                    <ActiveCollaborators />

                                    <SignedOut>
                                          <SignInButton />
                                    </SignedOut>

                                    <SignedIn>
                                          <UserButton />
                                    </SignedIn>
                              </div>
                        </Header>
                  <Editor />

                  </div>
                  </ClientSideSuspense>
            </RoomProvider>
      )

}

export default CollaborativeRoom