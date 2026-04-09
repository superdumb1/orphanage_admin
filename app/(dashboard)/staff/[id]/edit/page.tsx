import dbConnect from "@/lib/db";
import Staff from "@/models/Staff";
import { notFound } from "next/navigation";
import { StaffForm } from "@/components/organisms/StaffForm";
import Link from "next/link";
import { Button } from "@/components/atoms/Button";

export default async function EditStaffPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    await dbConnect();
    
    const staff = await Staff.findById(id).lean() as any;
    if (!staff) return notFound();

    // We serialize the data so Next.js doesn't complain about passing raw MongoDB Dates/ObjectIDs to a Client Component
    const serializedStaff = JSON.parse(JSON.stringify(staff));

    return (
        <div className="flex flex-col gap-6 max-w-4xl pb-10">
            <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-zinc-200">
                <Link href={`/staff/${id}`}>
                    <Button variant="ghost" className="px-2 border border-zinc-300">← Cancel</Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900">Edit Employee Record</h1>
                    <p className="text-sm text-zinc-500">Updating data for <span className="font-bold text-zinc-700">{staff.fullName}</span></p>
                </div>
            </div>

            {/* We pass the existing data into our form! */}
            <StaffForm initialData={serializedStaff} />
        </div>
    );
}