
export default function InfoRow({ label, value, isBold = false }: { label: string, value: string | number, isBold?: boolean }) {
    return (
        <div>
            <p className="text-[10px] uppercase font-black text-zinc-400 tracking-widest">{label}</p>
            <p className={`text-sm ${isBold ? 'font-black text-zinc-900' : 'font-medium text-zinc-700'}`}>{value}</p>
        </div>
    );
}