import Link from "next/link";
import dbConnect from "@/lib/db";
import Child from "@/models/Child";       // Verify this path!
import Staff from "@/models/Staff";       // Verify this path!
import Transaction from "@/models/Transaction";
import InventoryItem from "@/models/InventoryItem";

// Force Next.js to always fetch fresh data when the admin visits the dashboard
export const dynamic = 'force-dynamic';

export default async function Home() {
  await dbConnect();

  const [
    kidsCount,
    staffCount,
    financeStats,
    lowStockItems,
    lowStockCount
  ] = await Promise.all([
    // 🚨 FIXED: Changed "ACTIVE" to "IN_CARE" to match the Child Schema
    Child.countDocuments({ status: "IN_CARE" }),

    // Staff status correctly uses "ACTIVE"
    Staff.countDocuments({ status: "ACTIVE" }),

    // 3. Finance: Use MongoDB Aggregation to instantly calculate total income and expenses
    Transaction.aggregate([
      {
        $group: {
          _id: null,
          totalIncome: { $sum: { $cond: [{ $eq: ["$type", "INCOME"] }, "$amount", 0] } },
          totalExpense: { $sum: { $cond: [{ $eq: ["$type", "EXPENSE"] }, "$amount", 0] } }
        }
      }
    ]),

    // 4. Inventory: Find the exact items that are running low
    InventoryItem.find({ $expr: { $lte: ["$currentQuantity", "$minQuantityAlert"] } })
      .sort({ currentQuantity: 1 })
      .limit(4)
      .lean(),

    // 5. Inventory: Get the total count of low stock items
    InventoryItem.countDocuments({ $expr: { $lte: ["$currentQuantity", "$minQuantityAlert"] } })
  ]);
  // 🧮 2. PROCESS THE DATA 🧮
  // Calculate Balance safely (defaults to 0 if no transactions exist yet)
  const income = financeStats[0]?.totalIncome || 0;
  const expense = financeStats[0]?.totalExpense || 0;
  const currentBalance = income - expense;

  return (
    <div className="flex flex-col flex-1 p-8 bg-zinc-50 font-sans min-h-screen">

      {/* --- WELCOME HEADER --- */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Mission Control</h1>
        <p className="text-zinc-500 mt-1">Live data feed from your orphanage systems.</p>
      </div>

      {/* --- THE VITALS (KPI Cards) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

        {/* Children */}
        <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xl">👧</div>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Children</span>
          </div>
          <span className="text-3xl font-black text-zinc-900">{kidsCount || 0}</span>
          <span className="text-sm text-zinc-500 font-medium">Currently under care</span>
        </div>

        {/* Staff */}
        <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center text-xl">👩‍🏫</div>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Staff</span>
          </div>
          <span className="text-3xl font-black text-zinc-900">{staffCount || 0}</span>
          <span className="text-sm text-zinc-500 font-medium">Active employees</span>
        </div>

        {/* Finance Balance */}
        <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">💰</div>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Balance</span>
          </div>
          <span className={`text-3xl font-black truncate ${currentBalance < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
            Rs. {currentBalance.toLocaleString()}
          </span>
          <span className="text-sm text-zinc-500 font-medium">Available funds</span>
        </div>

        {/* Inventory Alerts */}
        <div className={`bg-white p-5 rounded-xl border shadow-sm flex flex-col relative overflow-hidden ${lowStockCount > 0 ? 'border-red-200' : 'border-zinc-200'}`}>
          {lowStockCount > 0 && <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>}
          <div className={`flex justify-between items-start mb-4 ${lowStockCount > 0 ? 'pl-2' : ''}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${lowStockCount > 0 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
              {lowStockCount > 0 ? '⚠️' : '✅'}
            </div>
            <span className={`text-xs font-bold uppercase tracking-wider ${lowStockCount > 0 ? 'text-red-400' : 'text-emerald-400'}`}>Alerts</span>
          </div>
          <span className={`text-3xl font-black ${lowStockCount > 0 ? 'text-red-600 pl-2' : 'text-emerald-600'}`}>
            {lowStockCount}
          </span>
          <span className={`text-sm font-medium ${lowStockCount > 0 ? 'text-red-500 pl-2' : 'text-emerald-500'}`}>
            {lowStockCount > 0 ? 'Items low on stock' : 'All stock levels good'}
          </span>
        </div>
      </div>

      {/* --- QUICK ACTIONS & RECENT ACTIVITY --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: Quick Actions */}
        <div className="lg:col-span-1 flex flex-col gap-3">
          <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider mb-2">Quick Actions</h2>

          <Link href="/finance/income/new" className="group flex items-center gap-3 p-4 bg-white rounded-xl border border-emerald-100 shadow-sm hover:border-emerald-300 transition-all">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm group-hover:scale-110 transition-transform">↓</div>
            <div className="flex flex-col">
              <span className="font-bold text-emerald-900 text-sm">Log Donation</span>
              <span className="text-xs text-emerald-600">Record cash or gifts</span>
            </div>
          </Link>

          <Link href="/inventory/movement/new" className="group flex items-center gap-3 p-4 bg-white rounded-xl border border-orange-100 shadow-sm hover:border-orange-300 transition-all">
            <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm group-hover:scale-110 transition-transform">🍽️</div>
            <div className="flex flex-col">
              <span className="font-bold text-orange-900 text-sm">Take Out Stock</span>
              <span className="text-xs text-orange-600">Log daily food/medicine usage</span>
            </div>
          </Link>

          <Link href="/finance/expense/new" className="group flex items-center gap-3 p-4 bg-white rounded-xl border border-zinc-200 shadow-sm hover:border-zinc-300 transition-all">
            <div className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-600 flex items-center justify-center text-sm group-hover:scale-110 transition-transform">↑</div>
            <div className="flex flex-col">
              <span className="font-bold text-zinc-900 text-sm">Record Expense</span>
              <span className="text-xs text-zinc-500">Pay bills or payroll</span>
            </div>
          </Link>
        </div>

        {/* Right Column: DYNAMIC Needs Attention Feed */}
        <div className="lg:col-span-2 flex flex-col">
          <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider mb-4">Needs Attention (Low Stock)</h2>

          <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
            {lowStockItems.length === 0 ? (
              <div className="p-8 text-center bg-emerald-50/50">
                <span className="text-3xl mb-2 block">🎉</span>
                <p className="font-bold text-emerald-900">Everything is fully stocked!</p>
                <p className="text-sm text-emerald-700 mt-1">No items have dropped below their minimum alert level.</p>
              </div>
            ) : (
              lowStockItems.map((item: any) => (
                <div key={item._id.toString()} className="p-4 border-b border-zinc-100 flex justify-between items-center bg-red-50/30 hover:bg-red-50/60 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">
                      {item.category === "GROCERY" ? "🍚" : item.category === "MEDICAL" ? "💊" : item.category === "CLOTHING" ? "👕" : "📦"}
                    </span>
                    <div>
                      <p className="font-bold text-zinc-900 text-sm">{item.itemName}</p>
                      <p className="text-xs text-zinc-500">{item.location || "Storeroom"}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-red-600">{item.currentQuantity} {item.unit} left</p>
                    <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider">Min Required: {item.minQuantityAlert}</p>
                  </div>
                </div>
              ))
            )}

            <div className="p-3 bg-zinc-50 text-center border-t border-zinc-100">
              <Link href="/inventory" className="text-xs font-bold text-indigo-600 hover:text-indigo-800">
                View Full Jinsi Khata (Inventory) →
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}