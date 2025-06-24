import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "./mongodb";
import User from "./models/User";

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
          return null;
        }

        try {
          // Always try demo authentication first for development
          const demoUsers = [
            {
              id: "demo_admin_1",
              email: "admin@ethicastore.com",
              password: "admin123",
              name: "Admin Ethica",
              role: "admin",
              avatar: "",
            },
            // {
            //   id: "demo_user_2",
            //   email: "user@ethicastore.com",
            //   password: "user123",
            //   name: "User Demo",
            //   role: "user",
            //   avatar: "",
            // },
          ];

          const demoUser = demoUsers.find(
            (u) =>
              u.email === credentials.email &&
              u.password === credentials.password
          );

          if (demoUser) {
            console.log("Demo user authenticated:", demoUser.email);
            return {
              id: demoUser.id,
              email: demoUser.email,
              name: demoUser.name,
              role: demoUser.role,
              avatar: demoUser.avatar,
            };
          }

          // Try database authentication if demo fails
          const connection = await connectDB();
          if (connection) {
            const user = await User.findOne({ email: credentials.email });

            if (user) {
              const isPasswordValid = await user.comparePassword(
                credentials.password
              );

              if (isPasswordValid) {
                return {
                  id: user._id.toString(),
                  email: user.email,
                  name: user.name,
                  role: user.role,
                  avatar: user.avatar,
                };
              }
            }
          }

          console.log("Authentication failed for:", credentials.email);
          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 60, // 30 minutes (reduced from 30 days)
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.avatar = user.avatar;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
        session.user.avatar = token.avatar as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin", // Redirect errors to signin page
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-here",
  debug: false, // Disable debug mode to remove warnings
};
