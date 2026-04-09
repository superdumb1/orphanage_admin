import dbConnect from "@/lib/db";
import Child from "@/models/Child";
import { Button } from "@/components/atoms/Button";
import Link from "next/link";

export const dynamic = 'force-dynamic'; 

export default async function ChildrenPage() {
    await dbConnect();
    const children = await Child.find({}).sort({ createdAt: -1 }).lean();

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-zinc-900">Children in Care</h1>
                <Link href="/children/new">
                    <Button variant="primary">+ Admit Child</Button>
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
                <table className="w-full text-left text-sm text-zinc-600">
                    <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-900">
                        <tr>
                            <th className="p-4 font-medium">Name</th>
                            <th className="p-4 font-medium">Status</th>
                            <th className="p-4 font-medium">Admitted</th>
                            <th className="p-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {children.length === 0 ? (
                            <tr><td colSpan={4} className="p-4 text-center">No records found.</td></tr>
                        ) : (
                            children.map((child: any) => (
                                <tr key={child._id.toString()} className="border-b border-zinc-100 hover:bg-zinc-50">
                                    {/* UPDATED: Flex container with Avatar and Name */}
                                    <td className="p-4 font-medium text-zinc-900 flex items-center gap-3">
                                        {child.profileImageUrl ? (
                                            <img src={child.profileImageUrl} alt="Profile" className="w-8 h-8 rounded-full object-cover border border-zinc-200" />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-zinc-200 border border-zinc-300 flex items-center justify-center text-zinc-500 text-xs font-bold">
                                                {child.firstName[0]}
                                            </div>
                                        )}
                                        <span>{child.firstName} {child.lastName}</span>
                                    </td>
                                    <td className="p-4"><span className="bg-zinc-100 px-2 py-1 rounded text-xs font-bold">{child.status.replace("_", " ")}</span></td>
                                    <td className="p-4">{new Date(child.admissionDate).toLocaleDateString()}</td>
                                    <td className="p-4 text-right">
                                        <Link href={`/children/${child._id.toString()}`} className="text-red-600 hover:underline">View</Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}