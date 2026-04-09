import { ChildForm } from "@/components/organisms/ChildForm";
import Link from "next/link";
import { Button } from "@/components/atoms/Button";

export default function NewChildPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
                <Link href="/children">
                    <Button variant="ghost" className="px-2 border border-zinc-300">← Back</Button>
                   
                </Link>
                <h1 className="text-2xl font-bold text-zinc-900">Admit New Child</h1>
            </div>

            <ChildForm />
        </div>
    );
}