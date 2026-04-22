import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      // Inside NextAuth CredentialsProvider
      async authorize(credentials) {
        await dbConnect();
        const user = await User.findOne({ email: credentials?.email });

        if (!user) throw new Error("Invalid credentials.");

        const isValid = await bcrypt.compare(credentials!.password, user.passwordHash);
        if (!isValid) throw new Error("Invalid credentials.");

        // ✨ ADD THIS CHECK: Block login if Admin hasn't approved them yet!
        if (!user.isActive) {
          throw new Error("Account is pending Administrator clearance.");
        }

        return { id: user._id.toString(), name: user.name, email: user.email, role: user.role };
      }
    })
  ],
  callbacks: {
    // ✨ STAGE 2: Persist the role into the Token
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    // ✨ STAGE 3: Make the role accessible in useSession()
    async session({ session, token }: any) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
  pages: { signIn: "/" },
});

export { handler as GET, handler as POST };