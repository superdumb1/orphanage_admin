import Link from "next/link";
import dbConnect from "@/lib/db";
import Child from "@/models/Child";
import Staff from "@/models/Staff";
import Transaction from "@/models/Transaction";
import InventoryItem from "@/models/InventoryItem";
import ActionPlan from "@/models/ActionPlan";
import { Sparkles } from "lucide-react";
import QuickActionSidebar from "@/components/organisms/ActionButtonsDashboard";

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
      .sort({ currentStock: 1 })
      .limit(3)
      .lean(),
    ActionPlan.find({
      status: { $in: ['PENDING', 'IN_PROGRESS'] },
      priority: { $in: ['HIGH', 'URGENT'] }
    })
      .populate('childId', 'firstName lastName name')
      .populate('assignedStaff', 'fullName')
      .sort({ dueDate: 1 })
      .limit(4)
      .lean()
  ]);

  const income = financeStats[0]?.totalIncome || 0;
  const expense = financeStats[0]?.totalExpense || 0;
  const currentBalance = income - expense;

  const lowStockItems = JSON.parse(JSON.stringify(lowStockItemsRaw));
  const urgentActions = JSON.parse(JSON.stringify(urgentActionsRaw));

  return (
    <div className="flex flex-col flex-1 min-h-screen duration-500 font-sans">

      {/* --- HEADER SECTION --- */}
      <div className="mb-10">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-text-main font-ubuntu">
            System Overview
          </h1>
          <div className="bg-primary/10 p-2 rounded-xl border border-primary/20">
            <Sparkles className="text-primary w-6 h-6 animate-pulse" />
          </div>
        </div>
        <p className="text-text-muted text-[10px] uppercase font-black tracking-[0.3em] mt-2 opacity-60 font-ubuntu">
          Kree Corp // Orphanage Management Portal
        </p>
      </div>

      {/* --- KPI GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">

        <StatCard icon="👧" label="Children" value={kidsCount} sub="Active Intake" variant="primary" />
        <StatCard icon="👩‍🏫" label="Staff" value={staffCount} sub="On-Duty Members" variant="secondary" />

        {/* Finance Balance */}
        <div className="bg-card p-6 rounded-dashboard border border-border shadow-glow flex flex-col group transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-black border font-ubuntu ${currentBalance < 0 ? 'bg-danger/10 text-danger border-danger/20' : 'bg-success/10 text-success border-success/20'}`}>
              NPR
            </div>
            <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] font-ubuntu">Available Funds</span>
          </div>
          <span className={`text-2xl font-black truncate tracking-tighter ${currentBalance < 0 ? 'text-danger' : 'text-success'}`}>
            Rs. {currentBalance.toLocaleString()}
          </span>
          <p className="text-[10px] font-black text-text-muted mt-2 uppercase tracking-widest opacity-60 font-ubuntu">Current Balance</p>
        </div>

        {/* Urgent Care Alerts */}
        <div className={`bg-card p-6 rounded-dashboard border shadow-glow flex flex-col relative overflow-hidden transition-all duration-500 ${urgentActions.length > 0 ? 'border-danger/30' : 'border-border'}`}>
          <div className="flex justify-between items-start mb-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${urgentActions.length > 0 ? 'bg-danger text-white animate-bounce shadow-glow' : 'bg-shaded text-text-muted border border-border'}`}>
              {urgentActions.length > 0 ? '🚨' : '✅'}
            </div>
            <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] font-ubuntu">Urgent Needs</span>
          </div>
          <span className={`text-4xl font-black tracking-tighter ${urgentActions.length > 0 ? 'text-danger' : 'text-text-main'}`}>
            {urgentActions.length}
          </span>
          <p className="text-[10px] font-black text-text-muted mt-1 uppercase tracking-widest opacity-60 font-ubuntu">Requires Attention</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <QuickActionSidebar />

        {/* FEED SECTION */}
        <div className="lg:col-span-2 flex flex-col gap-10">

          {/* URGENT CARE FEED */}
          <div className="bg-card rounded-dashboard border border-border overflow-hidden shadow-glow">
            <div className="p-6 border-b border-border bg-shaded flex justify-between items-center">
              <h2 className="font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-3 text-text-main font-ubuntu">
                <span className={`w-2 h-2 rounded-full ${urgentActions.length > 0 ? 'bg-danger animate-ping' : 'bg-success'}`}></span>
                Critical Care Feed
              </h2>
              <Link href="/children/actions" className="text-[9px] font-black text-primary hover:tracking-widest transition-all uppercase font-ubuntu">View All →</Link>
            </div>

            <div className="flex flex-col divide-y divide-border">
              {urgentActions.length === 0 ? (
                <div className="p-16 text-center">
                  <span className="text-4xl mb-4 block opacity-10">🛡️</span>
                  <p className="font-black uppercase tracking-widest text-[10px] text-text-muted font-ubuntu">No Critical Alerts Found</p>
                </div>
              ) : (
                urgentActions.map((plan: any) => (
                  <div key={plan._id} className="p-6 hover:bg-shaded transition-all flex justify-between items-center group cursor-pointer border-l-2 border-l-transparent hover:border-l-primary">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-background border border-border flex items-center justify-center text-lg group-hover:border-primary/50 group-hover:shadow-glow transition-all">
                        {plan.category === 'MEDICAL' ? '⚕️' : '⚖️'}
                      </div>
                      <div>
                        <p className="font-bold text-text-main group-hover:text-primary transition-colors">{plan.title}</p>
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-1 font-ubuntu">
                          {plan.childId?.name || "Record"} // <span className="text-primary">{plan.category}</span>
                        </p>
                      </div>
                    </div>
                    <span className="bg-danger/10 text-danger text-[9px] font-black px-3 py-1.5 rounded-lg border border-danger/20 uppercase tracking-tighter font-ubuntu">
                      {plan.priority}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* INVENTORY TRAY */}
          <div className="bg-card rounded-dashboard border border-border p-8 shadow-glow">
            <h2 className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] mb-6 font-ubuntu">Stock Depletion</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {lowStockItems.map((item: any) => (
                <div key={item._id} className="bg-shaded border border-border p-5 rounded-2xl group hover:border-danger/30 transition-all">
                  <p className="text-[10px] font-black text-danger uppercase mb-2 tracking-widest font-ubuntu">{item.currentStock} {item.unit} left</p>
                  <p className="font-bold text-sm text-text-main truncate group-hover:text-danger transition-colors">{item.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub, variant }: any) {
  const variants: any = {
    primary: "text-primary bg-primary/10 border-primary/20 group-hover:border-primary/50",
    secondary: "text-text-main bg-shaded border-border group-hover:border-primary/30",
  };
  return (
    <div className="bg-card p-6 rounded-dashboard border border-border shadow-glow hover:translate-y-[-4px] transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl border transition-all ${variants[variant]}`}>
          {icon}
        </div>
        <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] font-ubuntu">{label}</span>
      </div>
      <span className="text-4xl font-black text-text-main tracking-tighter">{value || 0}</span>
      <p className="text-[10px] font-black text-text-muted mt-2 uppercase tracking-widest opacity-60 font-ubuntu">{sub}</p>
    </div>
  );
}