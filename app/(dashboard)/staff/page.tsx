import dbConnect from "@/lib/db";
import Staff from "@/models/Staff";
import StaffHomeTop from "@/components/organisms/staffs/StaffHomeTop";
import InteractiveStaffTable from "@/components/organisms/staffs/staffpage/InteractiveStaffTable";
import StaffStatCards from "@/components/organisms/staffs/staffpage/StaffStatCards";

export const dynamic = 'force-dynamic';

export default async function StaffPage() {
    await dbConnect();

    // 1. Fetch raw data
    const rawStaffMembers = await Staff.find({}).sort({ firstName: 1 }).lean();

    // 2. Sanitize and Calculate (Prepare the payload for the Client)
    const staffMembers = rawStaffMembers.map((person: any) => {
        const s = person.salary || {};
        const a = s.allowances || {};

        const grossSalary =
            (s.basicSalary || 0) + (s.grade || 0) + (s.dearnessAllowance || 0) +
            (a.houseRent || 0) + (a.medical || 0) + (a.transport || 0) +
            (a.food || 0) + (a.communication || 0) + (a.other || 0);

        return JSON.parse(JSON.stringify({
            ...person,
            _id: person._id?.toString(),
            grossSalary,
            admissionDate: person.admissionDate ? new Date(person.admissionDate).toISOString() : null,
            createdAt: person.createdAt ? new Date(person.createdAt).toISOString() : null,
            updatedAt: person.updatedAt ? new Date(person.updatedAt).toISOString() : null,
        }));
    });

    return (
        // ✨ Added pt-20 for mobile sidebar clearance
        <div className="flex flex-col gap-6 max-w-7xl mx-auto md:p-6 md:pt-6 lg:p-8 animate-in fade-in duration-500">
            <StaffHomeTop />
            
            <StaffStatCards staffMembers={staffMembers} />
            
            {/* Themed Section Header */}
            <div className="flex flex-col gap-3 mt-2">
                <h2 className="font-ubuntu text-[10px] font-black text-text-muted uppercase tracking-[0.3em] pl-2">
                    Personnel Directory // Active Roster
                </h2>
                <InteractiveStaffTable staffMembers={staffMembers} />
            </div>
        </div>
    );
}