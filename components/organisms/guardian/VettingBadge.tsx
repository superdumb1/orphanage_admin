export default function VettingBadge({ status }: { status: string }) {
    const styles: any = {
        INQUIRY: "bg-zinc-100 text-zinc-600",
        VETTING: "bg-blue-100 text-blue-700 border-blue-200",
        APPROVED: "bg-emerald-100 text-emerald-700 border-emerald-200",
        REJECTED: "bg-amber-100 text-amber-700 border-amber-200",
        BLACKLISTED: "bg-red-100 text-red-700 border-red-200",
    };
    return (
        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border uppercase tracking-wider ${styles[status]}`}>
            {status.replace("_", " ")}
        </span>
    );
}