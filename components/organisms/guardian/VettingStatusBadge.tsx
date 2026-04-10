
export default function VettingStatusBadge({ status }: { status: string }) {
    const styles: any = {
        INQUIRY: "bg-zinc-100 text-zinc-600 border-zinc-200",
        VETTING: "bg-blue-100 text-blue-700 border-blue-200",
        APPROVED: "bg-emerald-100 text-emerald-700 border-emerald-200",
        REJECTED: "bg-amber-100 text-amber-700 border-amber-200",
        BLACKLISTED: "bg-red-100 text-red-700 border-red-200",
    };
    return (
        <span className={`px-4 py-1.5 rounded-full border text-xs font-black uppercase tracking-widest ${styles[status]}`}>
            {status.replace("_", " ")}
        </span>
    );
}