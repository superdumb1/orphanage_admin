import { Register } from "@/components/organisms/RegisterUser"; // Adjust path if needed
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function RegisterPage() {
    // If they are already logged in, send them straight to the dashboard
    const session = await getServerSession();
    if (session) {
        redirect("/");
    }

    return <Register />;
}