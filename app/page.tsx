import Link from "next/link";
import dbConnect from "@/lib/db";
import Child from "@/models/Child";       
import Staff from "@/models/Staff";       
import Transaction from "@/models/Transaction";
import InventoryItem from "@/models/InventoryItem";
import ActionPlan from "@/models/ActionPlan"; // 👈 New Import!

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
    <div className="flex flex-col flex-1 p-8 bg-zinc-50 font-sans min-h-screen">


      {/* --- THE VITALS (KPI Cards) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        {/* Children */}
        <div className="bg-primary p-5 rounded-xl border border-zinc-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xl">👧</div>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Children</span>
          </div>
          <span className="text-3xl font-black text-zinc-900">{kidsCount || 0}</span>
          <span className="text-sm text-zinc-500 font-medium">Currently under care</span>
        </div>

        {/* Staff */}
        <div className="bg-primary p-5 rounded-xl border border-zinc-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center text-xl">👩‍🏫</div>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Staff</span>
          </div>
          <span className="text-3xl font-black text-zinc-900">{staffCount || 0}</span>
          <span className="text-sm text-zinc-500 font-medium">Active employees</span>
        </div>

        {/* Finance Balance */}
        <div className="bg-primary p-5 rounded-xl border border-zinc-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">💰</div>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Balance</span>
          </div>
          <span className={`text-3xl font-black truncate ${currentBalance < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
            NPR {currentBalance.toLocaleString()}
          </span>
          <span className="text-sm text-zinc-500 font-medium">Available funds</span>
        </div>

        {/* Action Alerts (Replacing Inventory Alert for higher priority) */}
        <div className={`bg-primary p-5 rounded-xl border shadow-sm flex flex-col relative overflow-hidden ${urgentActions.length > 0 ? 'border-amber-200' : 'border-zinc-200'}`}>
          {urgentActions.length > 0 && <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>}
          <div className="flex justify-between items-start mb-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${urgentActions.length > 0 ? 'bg-amber-50 text-amber-600' : 'bg-zinc-50 text-zinc-600'}`}>
              {urgentActions.length > 0 ? '🚨' : '✅'}
            </div>
            <span className={`text-xs font-bold uppercase tracking-wider ${urgentActions.length > 0 ? 'text-amber-500' : 'text-zinc-400'}`}>Care Alerts</span>
          </div>
          <span className={`text-3xl font-black ${urgentActions.length > 0 ? 'text-amber-600' : 'text-zinc-900'}`}>
            {urgentActions.length}
          </span>
          <span className="text-sm text-zinc-500 font-medium">
            {urgentActions.length > 0 ? 'Urgent plans pending' : 'All critical needs met'}
          </span>
        </div>
      </div>

      {/* --- MAIN DASHBOARD FEED --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: Quick Actions */}
        <div className="lg:col-span-1 flex flex-col gap-3">
          <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider mb-2">Quick Actions</h2>
          
          <Link href="/children/new" className="group flex items-center gap-3 p-4 bg-primary rounded-xl border border-blue-100 shadow-sm hover:border-blue-300 transition-all">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm group-hover:scale-110 transition-transform">+</div>
            <div className="flex flex-col">
              <span className="font-bold text-blue-900 text-sm">Admit Child</span>
              <span className="text-xs text-blue-600">Register a new intake</span>
            </div>
          </Link>

          <Link href="/finance" className="group flex items-center gap-3 p-4 bg-primary rounded-xl border border-emerald-100 shadow-sm hover:border-emerald-300 transition-all">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm group-hover:scale-110 transition-transform">↓</div>
            <div className="flex flex-col">
              <span className="font-bold text-emerald-900 text-sm">Open Ledger</span>
              <span className="text-xs text-emerald-600">Record cash, income, or gifts</span>
            </div>
          </Link>

          <Link href="/inventory" className="group flex items-center gap-3 p-4 bg-primary rounded-xl border border-orange-100 shadow-sm hover:border-orange-300 transition-all">
            <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm group-hover:scale-110 transition-transform">📦</div>
            <div className="flex flex-col">
              <span className="font-bold text-orange-900 text-sm">Manage Inventory</span>
              <span className="text-xs text-orange-600">Update stock & consumption</span>
            </div>
          </Link>
        </div>

        {/* Right Column: DYNAMIC Needs Attention Feed */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* 🚨 SECTION 1: URGENT CHILD CARE PLANS */}
          <div>
            <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              Critical Care Feed
            </h2>
            
            <div className="bg-primary rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
              {urgentActions.length === 0 ? (
                <div className="p-8 text-center bg-zinc-50">
                  <span className="text-3xl mb-2 block">💙</span>
                  <p className="font-bold text-zinc-900">No urgent action plans.</p>
                  <p className="text-sm text-zinc-500 mt-1">All critical medical and legal tasks are handled.</p>
                </div>
              ) : (
                urgentActions.map((plan: any) => (
                  <div key={plan._id} className="p-4 border-b border-zinc-100 flex justify-between items-center bg-amber-50/20 hover:bg-amber-50/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm
                        ${plan.category === 'MEDICAL' ? 'bg-rose-100 text-rose-600' : 
                          plan.category === 'LEGAL' ? 'bg-purple-100 text-purple-600' : 
                          'bg-blue-100 text-blue-600'}`}>
                        {plan.category === 'MEDICAL' ? '⚕️' : plan.category === 'LEGAL' ? '⚖️' : '📚'}
                      </div>
                      <div>
                        <p className="font-bold text-zinc-900 text-sm">{plan.title}</p>
                        <p className="text-xs text-zinc-500 mt-0.5">
                          <strong className="text-zinc-700">{plan.childId?.name || plan.childId?.firstName || "Unknown Child"}</strong> • Assigned to: {plan.assignedStaff?.fullName || "Unassigned"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider
                        ${plan.priority === 'URGENT' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                        {plan.priority}
                      </span>
                      {plan.dueDate && (
                        <p className="text-xs font-medium text-zinc-500 mt-2">Due: {new Date(plan.dueDate).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>
                ))
              )}
              <div className="p-3 bg-zinc-50 text-center border-t border-zinc-100">
                <Link href="/children/actions" className="text-xs font-bold text-blue-600 hover:text-blue-800">
                  View All Action Plans →
                </Link>
              </div>
            </div>
          </div>

          {/* 📦 SECTION 2: LOW STOCK ALERTS */}
          <div>
            <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider mb-4">Inventory Alerts</h2>
            
            <div className="bg-primary rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
              {lowStockItems.length === 0 ? (
                <div className="p-6 text-center bg-emerald-50/50">
                  <p className="font-bold text-emerald-900 text-sm">Everything is fully stocked!</p>
                </div>
              ) : (
                lowStockItems.map((item: any) => (
                  <div key={item._id} className="p-3 border-b border-zinc-100 flex justify-between items-center hover:bg-zinc-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{item.category === "FOOD" ? "🍚" : item.category === "MEDICAL" ? "💊" : "📦"}</span>
                      <div>
                        <p className="font-bold text-zinc-900 text-sm">{item.name}</p>
                        <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">{item.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-rose-600">{item.currentStock} {item.unit} left</p>
                      <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Min: {item.minimumStockLevel}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}