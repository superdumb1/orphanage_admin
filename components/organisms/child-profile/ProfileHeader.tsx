import { Button } from "@/components/atoms/Button";
import Link from "next/link";

export const ProfileHeader = ({ child, id }: { child: any; id: string }) => (
  <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-zinc-200">
    <Link href="/children"><Button variant="ghost" className="px-2 border border-zinc-300 text-zinc-600">← Back</Button></Link>
    <Link href={`/children/${id}/edit`}><Button variant="secondary" className="px-5 border border-zinc-300">Edit Profile</Button></Link>

    {child.profileImageUrl ? (
      <img src={child.profileImageUrl} alt="Profile" className="w-14 h-14 rounded-full object-cover border-2 border-indigo-100 ml-2 shadow-sm" />
    ) : (
      <div className="w-14 h-14 rounded-full bg-indigo-50 border-2 border-indigo-100 ml-2 flex items-center justify-center text-indigo-500 font-black text-xl shadow-sm">
        {child.firstName[0]}
      </div>
    )}

    <div>
      <h1 className="text-2xl font-black text-zinc-900 tracking-tight">{child.firstName} {child.lastName}</h1>
      <p className="text-xs text-zinc-500 font-medium">Admitted: {new Date(child.admissionDate).toLocaleDateString()}</p>
    </div>

    <span className="ml-auto bg-emerald-100 text-emerald-800 px-4 py-1.5 rounded-full text-sm font-black tracking-wide border border-emerald-200 shadow-sm">
      {child.status.replace("_", " ")}
    </span>
  </div>
);