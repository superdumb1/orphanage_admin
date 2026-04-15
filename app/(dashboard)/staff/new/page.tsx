import { StaffForm } from "@/components/organisms/staffs/staffpage/StaffForm";
import Link from "next/link";
import { Button } from "@/components/atoms/Button";

export default function NewStaffPage() {
    return (
        <div className="flex flex-col gap-6 ">
            <div className="flex items-center gap-4">
                <Link href="/staff">
                    <Button variant="ghost" className="px-2 border border-zinc-300">← Back</Button>
                </Link>
                <h1 className="text-2xl font-bold text-zinc-900">Add New Staff Member</h1>
            </div>
            <StaffForm />
        </div>
    );
}