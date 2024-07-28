import { liveblocks } from "@/lib/liveblocks"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

import { getUserColor } from "@/lib/utils"

export async function POST(request: Request) {

      // Authentication using CLERK
      const clerkUser = await currentUser()

      // If the user does not exists, redirect them to the SIGN IN page
      if (!clerkUser) {
            redirect('/sign-in')
      }

      // If the user exists, then deconstruct the properties of the user
      const { id, firstName, lastName, emailAddresses, imageUrl } = clerkUser

      const user = {
            id: id,
            info: {
                  id: id,
                  name: `${firstName} ${lastName}`,
                  email: emailAddresses[0].emailAddress,
                  avatar: imageUrl,
                  color: getUserColor(id)
            }
      }

      // Identify the user and return the result
      const { status, body } = await liveblocks.identifyUser(
      {
            userId: user.info.email,
            groupIds: []
      },
      
      { userInfo: user.info },
      );

      return new Response(body, { status });
}