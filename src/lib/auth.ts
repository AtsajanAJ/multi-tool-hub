import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { loginSchema } from "@/lib/validations/auth";
export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" }, // Credentials ต้องใช้ JWT
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;
        const user = await prisma.user.findUnique({ where: {email } });
        if (!user?.passwordHash) return null;
        const ok = await bcrypt.compare(password,user.passwordHash);
        if (!ok) return null;
        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user?.id) {
        token.sub = user.id;
      }
      return token;
    },
    session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub ?? "",
        },
      };
    },
    authorized({ auth, request }) {
        const isLoggedIn = !!auth?.user;
        const isOnLogin = request.nextUrl.pathname.startsWith("/login");
        if (isOnLogin) {
          if (isLoggedIn) {
             return Response.redirect(new URL("/", request.nextUrl));
          }
          return true;
        }
        return isLoggedIn;
      },
  },
});