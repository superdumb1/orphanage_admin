import Link from "next/link";
import dbConnect from "@/lib/db";
import Child from "@/models/Child";
import Staff from "@/models/Staff";
import Transaction from "@/models/Transaction";
import InventoryItem from "@/models/InventoryItem";
import ActionPlan from "@/models/ActionPlan"; // 👈 New Import!
import { Sparkles, UserPlus, BookOpen, Package, } from "lucide-react";
// Force Next.js to always fetch fresh data when the admin visits the dashboard
export const dynamic = 'force-dynamic';

export default async function Home() {
  await dbConnect();

  // 🚀 Fire all database queries in parallel
  const [
    kidsCount,
    staffCount,
    financeStats,
    lowStockItemsRaw,
    lowStockCount,
    urgentActionsRaw // 👈 Fetching the Action Plans
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

    InventoryItem.countDocuments({ $expr: { $lte: ["$currentStock", "$minimumStockLevel"] } }),

    // 🚨 NEW: Fetch High/Urgent Priority Action Plans that aren't completed
    ActionPlan.find({
      status: { $in: ['PENDING', 'IN_PROGRESS'] },
      priority: { $in: ['HIGH', 'URGENT'] }
    })
      .populate('childId', 'firstName lastName name') // Fetch the child's name
      .populate('assignedStaff', 'fullName') // Fetch the staff member's name
      .sort({ dueDate: 1 }) // Sort by closest due date first
      .limit(4)
      .lean()
  ]);

  // 🧮 PROCESS & SANITIZE THE DATA
  const income = financeStats[0]?.totalIncome || 0;
  const expense = financeStats[0]?.totalExpense || 0;
  const currentBalance = income - expense;

  // Sanitize ObjectIds to prevent Next.js Client Component errors
  const lowStockItems = JSON.parse(JSON.stringify(lowStockItemsRaw));
  const urgentActions = JSON.parse(JSON.stringify(urgentActionsRaw));




  return (
    <div className="flex flex-col flex-1 p-6 md:p-10 bg-bg min-h-screen transition-colors duration-500">

      {/* --- HEADER SECTION --- */}
      <div className="mb-10">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-text">
            System Overview
          </h1>
          <div className="bg-primary/10 p-2 rounded-xl">
            <Sparkles className="text-primary w-6 h-6 animate-pulse" />
          </div>
        </div>
        <p className="text-text-muted text-[10px] uppercase font-black tracking-[0.2em] mt-2 opacity-60">
          Kree Corp • Orphanage Management Portal
        </p>
      </div>

      {/* --- KPI GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">

        <StatCard icon="👧" label="Children" value={kidsCount} sub="Active Intake" variant="primary" />
        <StatCard icon="👩‍🏫" label="Staff" value={staffCount} sub="On-Duty Members" variant="accent" />

        {/* Finance Balance */}
        <div className="bg-card p-6 rounded-dashboard border border-border shadow-glow flex flex-col group transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-black border ${currentBalance < 0 ? 'bg-danger/10 text-danger border-danger/20' : 'bg-success/10 text-success border-success/20'
              }`}>
              NPR
            </div>
            <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Available Funds</span>
          </div>
          <span className={`text-2xl font-black truncate tracking-tighter ${currentBalance < 0 ? 'text-danger' : 'text-success'}`}>
            Rs. {currentBalance.toLocaleString()}
          </span>
          <p className="text-[10px] font-black text-text-muted mt-2 uppercase tracking-widest opacity-60">Current Balance</p>
        </div>

        {/* Urgent Care Alerts */}
        <div className={`bg-card p-6 rounded-dashboard border shadow-glow flex flex-col relative overflow-hidden transition-all duration-500 ${urgentActions.length > 0 ? 'border-warning/50' : 'border-border'}`}>
          <div className="flex justify-between items-start mb-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${urgentActions.length > 0 ? 'bg-warning text-text-invert animate-bounce shadow-glow' : 'bg-shaded text-text-muted'}`}>
              {urgentActions.length > 0 ? '🚨' : '✅'}
            </div>
            <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Urgent Needs</span>
          </div>
          <span className={`text-4xl font-black tracking-tighter ${urgentActions.length > 0 ? 'text-warning' : 'text-text'}`}>
            {urgentActions.length}
          </span>
          <p className="text-[10px] font-black text-text-muted mt-1 uppercase tracking-widest opacity-60">Requires Attention</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* QUICK ACTIONS SIDEBAR */}
        <div className="lg:col-span-1 flex flex-col gap-5">
          <h2 className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] ml-2">Control Center</h2>

          <ActionBtn href="/children/new" title="Admit Child" sub="New profile entry" icon={<UserPlus size={18} />} variant="primary" />
          <ActionBtn href="/finance" title="Open Ledger" sub="Transactions & Gifts" icon={<BookOpen size={18} />} variant="success" />
          <ActionBtn href="/inventory" title="Manage Stock" sub="Warehouse levels" icon={<Package size={18} />} variant="warning" />
        </div>

        {/* FEED SECTION */}
        <div className="lg:col-span-2 flex flex-col gap-10">

          {/* URGENT CARE FEED */}
          <div className="bg-card rounded-dashboard border border-border overflow-hidden shadow-glow">
            <div className="p-6 border-b border-border bg-shaded/40 flex justify-between items-center">
              <h2 className="font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-3 text-text">
                <span className={`w-2.5 h-2.5 rounded-full ${urgentActions.length > 0 ? 'bg-warning animate-ping' : 'bg-success'}`}></span>
                Critical Care Feed
              </h2>
              <Link href="/children/actions" className="text-[9px] font-black text-primary hover:tracking-widest transition-all uppercase">View All →</Link>
            </div>

            <div className="flex flex-col divide-y divide-border/50">
              {urgentActions.length === 0 ? (
                <div className="p-16 text-center">
                  <span className="text-4xl mb-4 block opacity-20">🛡️</span>
                  <p className="font-black uppercase tracking-widest text-[10px] text-text-muted">No Critical Alerts Found</p>
                </div>
              ) : (
                urgentActions.map((plan: any) => (
                  <div key={plan._id} className="p-6 hover:bg-shaded/50 transition-all flex justify-between items-center group cursor-pointer">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-bg border border-border flex items-center justify-center text-lg group-hover:border-primary/50 group-hover:shadow-glow transition-all">
                        {plan.category === 'MEDICAL' ? '⚕️' : '⚖️'}
                      </div>
                      <div>
                        <p className="font-bold text-text group-hover:text-primary transition-colors">{plan.title}</p>
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-1">
                          {plan.childId?.name || "Record"} • <span className="text-primary">{plan.category}</span>
                        </p>
                      </div>
                    </div>
                    <span className="bg-danger/10 text-danger text-[9px] font-black px-3 py-1.5 rounded-lg border border-danger/20 uppercase tracking-tighter">
                      {plan.priority}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* INVENTORY TRAY */}
          <div className="bg-card rounded-dashboard border border-border p-8 shadow-glow">
            <h2 className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] mb-6">Stock Depletion</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {lowStockItems.map((item: any) => (
                <div key={item._id} className="bg-shaded/50 border border-border p-5 rounded-2xl group hover:border-danger/30 transition-all">
                  <p className="text-[10px] font-black text-danger uppercase mb-2 tracking-widest">{item.currentStock} {item.unit} left</p>
                  <p className="font-bold text-sm text-text truncate group-hover:text-danger transition-colors">{item.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- THEMED SUB-COMPONENTS --- */

function StatCard({ icon, label, value, sub, variant }: any) {
  const variants: any = {
    primary: "text-primary bg-primary/10 border-primary/20",
    accent: "text-accent bg-accent/10 border-accent/20",
  };
  return (
    <div className="bg-card p-6 rounded-dashboard border border-border shadow-glow hover:translate-y-[-5px] transition-all duration-500 group">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl border transition-all group-hover:shadow-glow ${variants[variant]}`}>
          {icon}
        </div>
        <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">{label}</span>
      </div>
      <span className="text-4xl font-black text-text tracking-tighter">{value || 0}</span>
      <p className="text-[10px] font-black text-text-muted mt-2 uppercase tracking-widest opacity-60">{sub}</p>
    </div>
  );
}

function ActionBtn({ href, title, sub, icon, variant }: any) {
  const variants: any = {
    primary: "border-primary/20 text-primary hover:bg-primary/5 hover:border-primary",
    success: "border-success/20 text-success hover:bg-success/5 hover:border-success",
    warning: "border-warning/20 text-warning hover:bg-warning/5 hover:border-warning",
  }
  return (
    <Link href={href} className={`group flex items-center justify-between p-6 bg-card rounded-2xl border transition-all duration-300 shadow-sm hover:shadow-glow ${variants[variant]}`}>
      <div className="flex flex-col">
        <span className="font-black text-xs uppercase tracking-[0.15em]">{title}</span>
        <span className="text-[10px] font-bold text-text-muted uppercase mt-1 opacity-70 group-hover:text-current transition-colors">{sub}</span>
      </div>
      <div className="w-10 h-10 rounded-xl bg-bg border border-border flex items-center justify-center text-text-muted group-hover:text-current group-hover:scale-110 group-hover:border-current transition-all">
        {icon}
      </div>
    </Link>
  )
}