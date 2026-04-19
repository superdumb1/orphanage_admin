// @/components/organisms/child/child-profile/DetailCard.tsx

export const DataRow = ({ 
  label, 
  value, 
  color = "text-text-main font-bold" // Default to semantic main text
}: { 
  label: string; 
  value: string | number; 
  color?: string;
}) => {
  return (
    <div className="flex justify-between items-start py-1 gap-4">
      {/* Label uses text-muted so it automatically adapts to light/dark */}
      <span className="font-ubuntu text-[10px] text-text-muted uppercase tracking-widest shrink-0">
        {label}
      </span>
      
      {/* Value uses the passed color or defaults to text-main */}
      <span className={`text-sm text-right ${color}`}>
        {value}
      </span>
    </div>
  );
};