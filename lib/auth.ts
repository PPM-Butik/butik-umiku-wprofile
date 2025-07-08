import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { connectDB } from "./mongodb"
import User from "./models/User"

interface DemoUser {
  id: string
  email: string
  password: string
  name: string
  role: string
  avatar: string
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Admin user from environment variables
          const demoUsers: DemoUser[] = [
            {
              id: "demo_admin_1",
              email: process.env.ADMIN_EMAIL ?? "",
              password: process.env.ADMIN_PASSWORD ?? "",
              name: "Admin Ethica",
              role: "admin",
              avatar: "",
            },
          ]

          const demoUser = demoUsers.find(
            (user: DemoUser) => user.email === credentials.email && user.password === credentials.password,
          )

          if (demoUser) {
            console.log("Demo user authenticated:", demoUser.email)
            return {
              id: demoUser.id,
              email: demoUser.email,
              name: demoUser.name,
              role: demoUser.role,
              avatar: demoUser.avatar,
            }
          }

          // Try database authentication if demo fails
          const connection = await connectDB()
          if (connection) {
            const user = await User.findOne({ email: credentials.email })

            if (user) {
              const isPasswordValid = await user.comparePassword(credentials.password)

              if (isPasswordValid) {
                return {
                  id: user._id.toString(),
                  email: user.email,
                  name: user.name,
                  role: user.role,
                  avatar: user.avatar,
                }
              }
            }
          }

          console.log("Authentication failed for:", credentials.email)
          return null
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 60, // 30 minutes
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.avatar = user.avatar
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.avatar = token.avatar as string
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
}
