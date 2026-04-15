export default function InfoRow({
    label,
    value,
    isBold = false,
}: {
    label: string;
    value: string | number;
    isBold?: boolean;
}) {
    return (
        <div className="flex flex-col gap-0.5">

            {/* LABEL */}
            <p className="text-[10px] uppercase font-black text-zinc-400 tracking-widest">
                {label}
            </p>

            {/* VALUE */}
            <p
                className={`text-sm ${
                    isBold
                        ? "font-black text-zinc-900"
                        : "font-medium text-zinc-700"
                }`}
            >
                {value ?? "—"}
            </p>
        </div>
    );
}