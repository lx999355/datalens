import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "./prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "用户名或邮箱", type: "text" },
        password: { label: "密码", type: "password" },
      },
      async authorize(credentials) {
        const { username, password } = credentials as {
          username: string
          password: string
        }

        const user = await prisma.user.findFirst({
          where: {
            OR: [{ username }, { email: username }],
            isActive: true,
          },
        })

        if (!user) return null

        // Check if locked
        if (user.lockedUntil && user.lockedUntil > new Date()) {
          throw new Error(
            `账户已被锁定，请于 ${user.lockedUntil.toLocaleString("zh-CN")} 后重试`
          )
        }

        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) {
          // Increment login attempts
          const attempts = user.loginAttempts + 1
          const updates: Record<string, unknown> = { loginAttempts: attempts }
          if (attempts >= 5) {
            updates.lockedUntil = new Date(Date.now() + 30 * 60 * 1000)
          }
          await prisma.user.update({ where: { id: user.id }, data: updates })
          return null
        }

        // Reset login attempts on success
        await prisma.user.update({
          where: { id: user.id },
          data: { loginAttempts: 0, lockedUntil: null },
        })

        return {
          id: user.id,
          name: user.username,
          email: user.email,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
        token.username = user.name
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        ;(session.user as any).id = token.id
        ;(session.user as any).role = token.role
        ;(session.user as any).username = token.username
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
})