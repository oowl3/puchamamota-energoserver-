import { User, getServerSession } from 'next-auth'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface User {
    id?: string
  }
  interface Session {
    user: User & {
      id: string
    }
  }
}

export const session = async ({ session, token }: { session: any; token: JWT }) => {
  if (session.user) {
    session.user.id = token.id as string;
  }
  return session;
}

export const getUserSession = async (): Promise<User> => {
  const authUserSession = await getServerSession({
    callbacks: {
      session,
    },
  })
  if (!authUserSession?.user) throw new Error('No autorizado')
  return authUserSession.user
}