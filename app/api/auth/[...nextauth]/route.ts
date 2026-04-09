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
      async authorize(credentials) {
        await dbConnect();
        const user = await User.findOne({ email: credentials?.email });
        
        if (!user) throw new Error("Invalid email or password");
        
        const isValid = await bcrypt.compare(credentials!.password, user.passwordHash);
        if (!isValid) throw new Error("Invalid email or password");
        
        // This data gets saved into the NextAuth session token
        return { id: user._id.toString(), name: user.name, email: user.email, role: user.role };
      }
    })
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/" }, // We handle the UI manually in our AppShell
});

export { handler as GET, handler as POST };