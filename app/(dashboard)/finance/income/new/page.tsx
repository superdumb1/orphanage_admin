import { IncomeForm } from "@/components/organisms/transactions/IncomeForm";
import Link from "next/link";
import { Button } from "@/components/atoms/Button";

export default function NewIncomePage() {
    return (
        <div className="flex flex-col gap-6 max-w-3xl pb-10">
            <div className="flex items-center gap-4">
                <Link href="/finance"><Button variant="ghost" className="px-2">← Back</Button></Link>
                <h1 className="text-2xl font-bold text-zinc-900">Record Income</h1>
            </div>
            <IncomeForm />
        </div>
    );
}