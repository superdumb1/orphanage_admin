"use client"
import { Button } from "@/components/atoms/Button"
import { useUIModals } from "@/hooks/useUIModal"
import Link from "next/link"

const MemberCardRow = ({ person }: { person: any }) => {
    const {openStaffForm}=useUIModals()
    // console.log("ma",person)
    return (
        <tr className="hover:bg-shaded/50 transition-colors group">
            <td className="p-4 flex items-center gap-4">
                {person.profileImageUrl ? (
                    <img src={person.profileImageUrl} alt="Profile" className="w-10 h-10 rounded-full object-cover border border-border shadow-sm" />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-danger/10 text-danger flex items-center justify-center font-black text-xs border border-danger/20">
                        {person.fullName.charAt(0).toUpperCase()}
                    </div>
                )}
                <div className="flex flex-col">
                    <span className="font-bold text-text group-hover:text-primary transition-colors">
                        {person.fullName} 
                        {person.nepaliName && <span className="font-normal text-text-muted text-[10px] ml-2 italic">({person.nepaliName})</span>}
                    </span>
                    <span className="text-[11px] text-text-muted/70">{person.email} • {person.phone}</span>
                </div>
            </td>

            <td className="p-4">
                <div className="flex flex-col">
                    <span className="font-bold text-text/90 text-xs">{person.designation || 'Not Assigned'}</span>
                    <span className="text-[10px] font-medium text-text-muted uppercase tracking-wider">{person.department?.replace("_", " ") || 'General'}</span>
                </div>
            </td>

            <td className="p-4">
                <div className="flex flex-col gap-1.5 items-start">
                    <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                        {person.employmentType?.replace("_", " ") || 'ACTIVE'}
                    </span>
                    {person.ssf?.type === "SSF" && (
                        <span className="px-2 py-0.5 rounded-md bg-accent/10 text-accent text-[10px] font-black border border-accent/20 uppercase tracking-tighter">SSF Enrolled</span>
                    )}
                </div>
            </td>

            <td className="p-4 text-right">
                <span className="font-black text-success tabular-nums">
                    {person.grossSalary > 0 ? `Rs. ${person.grossSalary.toLocaleString()}` : 'Not Set'}
                </span>
            </td>

            <td className="p-4 text-center " >
                <Button onClick={()=>{openStaffForm(person)}}>Edit</Button>
                <Link href={`/staff/${person._id.toString()}`}>
                    <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-text-muted border border-border hover:bg-bg hover:text-text px-4 py-1.5 transition-all">
                        Manage
                    </Button>
                </Link>
            </td>
        </tr>
    )
}
export default MemberCardRow