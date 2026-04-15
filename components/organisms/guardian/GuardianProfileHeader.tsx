import Link from "next/link";
import React from "react";

export default function GuardianProfileHeader({ guardian, id }: { guardian: any, id: string }) {
    return (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white p-6 rounded-[2rem] border border-zinc-200 shadow-sm gap-4">
            
            <div className="flex items-center gap-6">
                {/* 📸 PROFILE PICTURE LOGIC */}
                <div className="w-24 h-24 rounded-[1.5rem] overflow-hidden shrink-0 border border-zinc-200 shadow-sm bg-blue-50 flex items-center justify-center text-4xl">
                    {guardian.profileImageUrl ? (
                        <img 
                            src={guardian.profileImageUrl} 
                            alt={guardian.primaryName} 
                            className="w-full h-full object-cover" 
                        />
                    ) : (
                        "👤"
                    )}
                </div>

                {/* NAME & STATUS */}
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-3xl font-black text-zinc-900 tracking-tight">{guardian.primaryName}</h1>
                        <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-black uppercase tracking-widest rounded-lg">
                            {guardian.vettingStatus}
                        </span>
                    </div>
                    <p className="text-zinc-500 font-medium">
                        {guardian.type} • {guardian.secondaryName ? `Partner: ${guardian.secondaryName}` : "Single Applicant"}
                    </p>
                </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-3">
                <Link 
                    href={`/guardians/${id}/edit`} 
                    className="bg-white px-5 py-2.5 rounded-xl text-sm font-bold text-zinc-700 border border-zinc-200 shadow-sm hover:bg-zinc-50 transition-all flex items-center gap-2"
                >
                    ✏️ Edit Profile
                </Link>
            </div>
        </div>
    );
}