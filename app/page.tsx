import Link from "next/link";
import dbConnect from "@/lib/db";
import Child from "@/models/Child";       
import Staff from "@/models/Staff";       
import Transaction from "@/models/Transaction";
import InventoryItem from "@/models/InventoryItem";
import ActionPlan from "@/models/ActionPlan";
import { Sparkles } from "lucide-react"; // Fancy touch

export const dynamic = 'force-dynamic';

export default async function Home() {
  await dbConnect();

  const [
    kidsCount,
    staffCount,
    financeStats,
    lowStockItemsRaw,
    urgentActionsRaw
  ] = await Promise.all([
    Child.countDocuments({ status: "IN_CARE" }),
    Staff.countDocuments({ status: "ACTIVE" }),
    Transaction.aggregate([
      {
        $group: {
          _id: null,
          totalIncome: { $sum: { $cond: [{ $eq: ["$type", "INCOME"] }, "$amount", 0] } },
          totalExpense: { $sum: { $cond: [{ $eq: ["$type", "EXPENSE"] }, "$amount", 0] } }
        }
      }
    ]),
    InventoryItem.find({ $expr: { $lte: ["$currentStock", "$minimumStockLevel"] } })
      .sort({ currentStock: 1 }).limit(3).lean(),
    ActionPlan.find({ 
      status: { $in: ['PENDING', 'IN_PROGRESS'] },
      priority: { $in: ['HIGH', 'URGENT'] }
    })
      .populate('childId', 'firstName lastName name')
      .populate('assignedStaff', 'fullName')
      .sort({ dueDate: 1 }).limit(4).lean()
  ]);

  const income = financeStats[0]?.totalIncome || 0;
  const expense = financeStats[0]?.totalExpense || 0;
  const currentBalance = income - expense;

  const lowStockItems = JSON.parse(JSON.stringify(lowStockItemsRaw));
  const urgentActions = JSON.parse(JSON.stringify(urgentActionsRaw));

  return (
    <div className="flex flex-col flex-1 p-8 bg-bg min-h-screen transition-colors duration-500">
      
      {/* --- HEADER SECTION --- */}
      <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tighter flex items-center gap-2">
            Dashboard <Sparkles className="text-primary w-6 h-6 animate-pulse" />
          </h1>
          <p className="text-text/50 text-sm font-medium">Kree Corp Management System • Orphanage Admin</p>
      </div>

      {/* --- KPI GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        
        {/* Children */}
        <StatCard 
            icon="👧" 
            label="Children" 
            value={kidsCount} 
            sub="Active intake" 
            accent="blue" 
        />

        {/* Staff */}
        <StatCard 
            icon="👩‍🏫" 
            label="Staff" 
            value={staffCount} 
            sub="On-duty members" 
            accent="purple" 
        />

        {/* Balance */}
        <div className="bg-card p-6 rounded-[2rem] border border-border shadow-xl flex flex-col relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-xl">NPR</div>
            <span className="text-[10px] font-black text-text/40 uppercase tracking-widest">Available Funds</span>
          </div>
          <span className={`text-2xl font-black truncate ${currentBalance < 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
            Rs. {currentBalance.toLocaleString()}
          </span>
          <div className="mt-auto h-1 w-full bg-border rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-full opacity-30"></div>
          </div>
        </div>

        {/* Action Alerts */}
        <div className={`bg-card p-6 rounded-[2rem] border shadow-xl flex flex-col relative overflow-hidden transition-all ${urgentActions.length > 0 ? 'border-amber-500/50 scale-[1.02]' : 'border-border'}`}>
          <div className="flex justify-between items-start mb-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${urgentActions.length > 0 ? 'bg-amber-500 text-black animate-bounce' : 'bg-shaded text-text'}`}>
              {urgentActions.length > 0 ? '🚨' : '✅'}
            </div>
            <span className="text-[10px] font-black text-text/40 uppercase tracking-widest">Urgent Needs</span>
          </div>
          <span className={`text-3xl font-black ${urgentActions.length > 0 ? 'text-amber-500' : 'text-text'}`}>
            {urgentActions.length}
          </span>
          <p className="text-xs font-bold opacity-60 mt-1 uppercase tracking-tighter">Tasks Requiring Attention</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* QUICK ACTIONS */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <h2 className="text-xs font-black text-text/40 uppercase tracking-[0.2em] ml-2">Control Center</h2>
          
          <ActionBtn href="/children/new" title="Admit Child" sub="New profile entry" icon="+" color="blue" />
          <ActionBtn href="/finance" title="Open Ledger" sub="Transactions & Gifts" icon="↓" color="emerald" />
          <ActionBtn href="/inventory" title="Inventory" sub="Stock management" icon="📦" color="amber" />
        </div>

        {/* FEED SECTION */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* URGENT FEED */}
          <div className="bg-card rounded-[2.5rem] border border-border overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-border bg-shaded/50 flex justify-between items-center">
              <h2 className="font-black text-sm uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                Critical Care Feed
              </h2>
              <Link href="/children/actions" className="text-[10px] font-black hover:text-primary transition-colors">VIEW ALL →</Link>
            </div>
            
            <div className="flex flex-col">
              {urgentActions.length === 0 ? (
                <div className="p-12 text-center opacity-40">
                  <span className="text-4xl mb-4 block">🛡️</span>
                  <p className="font-bold uppercase tracking-widest text-xs">No Critical Alerts</p>
                </div>
              ) : (
                urgentActions.map((plan: any) => (
                  <div key={plan._id} className="p-5 border-b border-border hover:bg-shaded/30 transition-all flex justify-between items-center group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-bg border border-border flex items-center justify-center text-lg group-hover:border-primary transition-colors">
                        {plan.category === 'MEDICAL' ? '⚕️' : '⚖️'}
                      </div>
                      <div>
                        <p className="font-bold text-text group-hover:text-primary transition-colors">{plan.title}</p>
                        <p className="text-[11px] font-medium opacity-50 uppercase tracking-wider">
                          {plan.childId?.name || "Child Record"} • {plan.category}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                       <span className="bg-rose-500/10 text-rose-500 text-[9px] font-black px-2 py-1 rounded border border-rose-500/20">
                         {plan.priority}
                       </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* INVENTORY ALERT */}
          <div className="bg-card rounded-[2.5rem] border border-border p-6 shadow-xl">
             <h2 className="text-xs font-black text-text/40 uppercase tracking-[0.2em] mb-4">Stock depletion</h2>
             <div className="flex flex-wrap gap-4">
                {lowStockItems.map((item: any) => (
                    <div key={item._id} className="bg-shaded border border-border p-4 rounded-2xl flex-1 min-w-[150px]">
                        <p className="text-[10px] font-black text-rose-500 uppercase mb-1">{item.currentStock} {item.unit} left</p>
                        <p className="font-bold text-sm truncate">{item.name}</p>
                    </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SUB COMPONENTS FOR CLEANLINESS ---

function StatCard({ icon, label, value, sub, accent }: any) {
    const colors: any = {
        blue: "text-blue-500 bg-blue-500/10",
        purple: "text-purple-500 bg-purple-500/10"
    };
    return (
        <div className="bg-card p-6 rounded-[2rem] border border-border shadow-xl hover:translate-y-[-4px] transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${colors[accent]}`}>{icon}</div>
            <span className="text-[10px] font-black text-text/40 uppercase tracking-widest">{label}</span>
          </div>
          <span className="text-4xl font-black text-text">{value || 0}</span>
          <p className="text-xs font-bold opacity-40 mt-1 uppercase tracking-tighter">{sub}</p>
        </div>
    );
}

function ActionBtn({ href, title, sub, icon, color }: any) {
    const colorMap: any = {
        blue: "border-blue-500/20 text-blue-500 hover:bg-blue-500/5 hover:border-blue-500",
        emerald: "border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/5 hover:border-emerald-500",
        amber: "border-amber-500/20 text-amber-500 hover:bg-amber-500/5 hover:border-amber-500",
    }
    return (
        <Link href={href} className={`group flex items-center justify-between p-5 bg-card rounded-2xl border transition-all ${colorMap[color]}`}>
            <div className="flex flex-col">
                <span className="font-black text-sm uppercase tracking-wider">{title}</span>
                <span className="text-[10px] font-bold opacity-60 uppercase">{sub}</span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-bg border border-border flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                {icon}
            </div>
        </Link>
    );
}