import React from 'react'
const StatCard: React.FC<{ label: string, value: number, color: string }> = ({ label, value, color }) => {
    const colors: any = {
        zinc: "bg-white border-zinc-200 text-zinc-900",
        blue: "bg-blue-50 border-blue-100 text-blue-700",
        emerald: "bg-emerald-50 border-emerald-100 text-emerald-700",
        red: "bg-red-50 border-red-100 text-red-700"
    };
    return (
        <div className={`p-5 rounded-2xl border shadow-sm ${colors[color]}`}>
            <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-1">{label}</p>
            <p className="text-3xl font-black">{value}</p>
        </div>
    );
}



const StatCards: React.FC<{ guardians:any }> = ({ guardians }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard label="Total Applicants" value={guardians.length} color="zinc" />
            <StatCard label="Under Vetting" value={guardians.filter((g: any) => g.vettingStatus === 'VETTING').length} color="blue" />
            <StatCard label="Approved Families" value={guardians.filter((g: any) => g.vettingStatus === 'APPROVED').length} color="emerald" />
            <StatCard label="Blacklisted" value={guardians.filter((g: any) => g.vettingStatus === 'BLACKLISTED').length} color="red" />
        </div>
    )
}

export default StatCards