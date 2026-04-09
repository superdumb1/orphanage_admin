export const DetailCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200 flex flex-col gap-4 h-full">
    <h2 className="text-lg font-black text-zinc-900 mb-3 border-b border-zinc-100 pb-2">{title}</h2>
    <div className="flex flex-col gap-2">{children}</div>
  </div>
);

export const DataRow = ({ label, value, color }: { label: string; value: string | number; color?: string }) => (
  <p className="text-sm text-zinc-600">
    <strong className="text-zinc-900 w-28 inline-block">{label}:</strong> 
    <span className={color}>{value}</span>
  </p>
);