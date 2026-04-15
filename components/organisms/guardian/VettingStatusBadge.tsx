export default function VettingStatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        INQUIRY: "bg-zinc-100 text-zinc-700 border-zinc-200",
        VETTING: "bg-amber-50 text-amber-700 border-amber-200",
        APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
        REJECTED: "bg-rose-50 text-rose-700 border-rose-200",
        BLACKLISTED: "bg-rose-100 text-rose-800 border-rose-300",
    };

    const normalized = status?.toUpperCase?.() || "INQUIRY";
    const style = styles[normalized] || styles.INQUIRY;

    return (
        <span
            className={`
                px-4 py-1.5 rounded-full border
                text-xs font-black uppercase tracking-widest
                ${style}
            `}
        >
            {normalized.replace("_", " ")}
        </span>
    );
}