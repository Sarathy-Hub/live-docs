import { useOthers } from "@liveblocks/react/suspense"
import React from "react"

import Image from "next/image"

// Define the type for each property of the user

const ActiveCollaborators = () => {

      const others = useOthers() // This will get the other users who are viewing the document

      const collaborators = others.map((other) => other.info)

      return (
            <ul className="collaborators-list">
                  {
                        collaborators.map(({id, avatar, name, color} ) => (
                              <li key = {id}>
                                    <Image 
                                          src = {avatar}
                                          alt = {name}
                                          width={100}
                                          height={100}

                                          className = 'inline-block size-8 rounded-full ring-2 ring-dark-100'
                                          style = {{border: `3px solid ${color}`}}
                                    />
                              </li>
                        ))
                  }
            </ul>
      )

}

export default ActiveCollaborators